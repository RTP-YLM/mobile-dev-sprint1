/**
 * HomeSync POC - Arduino IDE Version
 * 
 * ใช้ไฟล์นี้ถ้าต้องการใช้ Arduino IDE แทน PlatformIO
 * 
 * วิธีใช้:
 * 1. ติดตั้ง Library:
 *    - PubSubClient by Nick O'Leary
 *    - PZEM-004Tv30 by Peter Mandula
 * 
 * 2. เปิดไฟล์นี้ใน Arduino IDE
 * 
 * 3. แก้ไข WiFi & MQTT credentials ด้านล่าง
 * 
 * 4. Select Board: "NodeMCU 1.0 (ESP-12E Module)"
 * 
 * 5. Upload
 */

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>

// ============ CONFIGURATION ============
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// HiveMQ Cloud
const char* MQTT_BROKER = "YOUR_CLUSTER.hivemq.cloud";
const int MQTT_PORT = 8883;
const char* MQTT_USER = "YOUR_HIVEMQ_USERNAME";
const char* MQTT_PASS = "YOUR_HIVEMQ_PASSWORD";

// Topics
const char* TOPIC_TELEMETRY = "homesync/poc/node1/telemetry";
const char* TOPIC_COMMAND = "homesync/poc/node1/command/relay";
// ========================================

// Hardware pins
PZEM004Tv30 pzem(D1, D2);  // RX, TX
const int RELAY_PIN = D5;

// WiFi & MQTT
WiFiClientSecure espClient;
PubSubClient mqtt(espClient);

bool relayState = false;
unsigned long lastRead = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n🏠 HomeSync POC Starting...");
  
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  
  // Connect WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  
  // Setup MQTT with TLS (insecure for POC)
  espClient.setInsecure();
  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setCallback(mqttCallback);
}

void loop() {
  if (!mqtt.connected()) reconnect();
  mqtt.loop();
  
  if (millis() - lastRead > 5000) {
    lastRead = millis();
    readAndPublish();
  }
}

void reconnect() {
  while (!mqtt.connected()) {
    Serial.print("MQTT connecting...");
    String clientId = "NodeMCU-" + String(ESP.getChipId());
    
    if (mqtt.connect(clientId.c_str(), MQTT_USER, MQTT_PASS)) {
      Serial.println("connected");
      mqtt.subscribe(TOPIC_COMMAND);
    } else {
      Serial.print("failed, retry in 5s");
      delay(5000);
    }
  }
}

void readAndPublish() {
  float v = pzem.voltage();
  float i = pzem.current();
  float p = pzem.power();
  
  Serial.printf("V=%.1f, I=%.3f, P=%.1f\n", v, i, p);
  
  char payload[128];
  snprintf(payload, sizeof(payload), "{\"value\":%.2f}", v);
  mqtt.publish("homesync/poc/node1/telemetry/voltage", payload);
  
  snprintf(payload, sizeof(payload), "{\"value\":%.3f}", i);
  mqtt.publish("homesync/poc/node1/telemetry/current", payload);
  
  snprintf(payload, sizeof(payload), "{\"value\":%.2f}", p);
  mqtt.publish("homesync/poc/node1/telemetry/power", payload);
}

void mqttCallback(char* topic, byte* payload, unsigned int len) {
  char msg[len+1];
  memcpy(msg, payload, len);
  msg[len] = '\0';
  
  if (strstr(msg, "true")) {
    relayState = true;
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Relay ON");
  } else if (strstr(msg, "false")) {
    relayState = false;
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Relay OFF");
  }
}
