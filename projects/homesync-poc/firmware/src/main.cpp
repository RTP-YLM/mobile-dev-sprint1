/**
 * HomeSync POC - NodeMCU Firmware
 * 
 * อ่านค่าจาก PZEM-004T และส่งผ่าน MQTT ไป HiveMQ
 * ควบคุม Relay ผ่าน MQTT Commands
 * 
 * Hardware:
 * - NodeMCU ESP8266
 * - PZEM-004T v3.0
 * - Relay Module
 * 
 * Wiring:
 * - NodeMCU 5V    → PZEM VCC
 * - NodeMCU GND   → PZEM GND
 * - NodeMCU D1    → PZEM TX  
 * - NodeMCU D2    → PZEM RX
 * - NodeMCU D5    → Relay IN
 */

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>
#include "config.h"

// PZEM-004T SoftwareSerial
PZEM004Tv30 pzem(D1, D2);  // RX, TX

// WiFi & MQTT
WiFiClientSecure espClient;
PubSubClient mqtt(espClient);

// Relay Pin
const int RELAY_PIN = D5;
bool relayState = false;

// Timing
unsigned long lastReadTime = 0;
const unsigned long READ_INTERVAL = 5000;  // 5 seconds
unsigned long lastReconnectAttempt = 0;

// Function declarations
void setupWiFi();
void setupMQTT();
void reconnectMQTT();
void readAndPublish();
void publishTelemetry(const char* subtopic, float value);
void handleCommand(char* topic, byte* payload, unsigned int length);
void setRelay(bool state);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n🏠 HomeSync POC - NodeMCU Starting...");
  
  // Setup relay pin
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  relayState = false;
  
  // Initialize PZEM
  Serial.println("Initializing PZEM-004T...");
  
  // Setup WiFi
  setupWiFi();
  
  // Setup MQTT with TLS
  espClient.setInsecure();  // For POC only - skip certificate validation
  setupMQTT();
  
  Serial.println("✅ Setup complete!");
}

void loop() {
  // Ensure MQTT connection
  if (!mqtt.connected()) {
    unsigned long now = millis();
    if (now - lastReconnectAttempt > 5000) {
      lastReconnectAttempt = now;
      reconnectMQTT();
    }
  } else {
    mqtt.loop();
  }
  
  // Read and publish telemetry
  unsigned long now = millis();
  if (now - lastReadTime > READ_INTERVAL) {
    lastReadTime = now;
    readAndPublish();
  }
}

void setupWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
    Serial.println("Restarting...");
    ESP.restart();
  }
}

void setupMQTT() {
  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setCallback(handleCommand);
  mqtt.setBufferSize(512);
}

void reconnectMQTT() {
  Serial.print("Attempting MQTT connection...");
  
  String clientId = "homesync-poc-node1-" + String(ESP.getChipId(), HEX);
  
  if (mqtt.connect(clientId.c_str(), MQTT_USER, MQTT_PASS)) {
    Serial.println("connected");
    
    // Subscribe to command topic
    mqtt.subscribe(MQTT_TOPIC_COMMAND);
    Serial.print("Subscribed to: ");
    Serial.println(MQTT_TOPIC_COMMAND);
    
    // Publish online status
    mqtt.publish("homesync/poc/node1/status", "online", true);
  } else {
    Serial.print("failed, rc=");
    Serial.println(mqtt.state());
  }
}

void readAndPublish() {
  Serial.println("\n📊 Reading sensors...");
  
  // Read from PZEM
  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  float frequency = pzem.frequency();
  float pf = pzem.pf();
  
  // Check if readings are valid
  if (isnan(voltage) || voltage < 0) {
    Serial.println("⚠️ Error reading voltage");
    voltage = 0;
  }
  if (isnan(current) || current < 0) {
    Serial.println("⚠️ Error reading current");
    current = 0;
  }
  if (isnan(power) || power < 0) {
    Serial.println("⚠️ Error reading power");
    power = 0;
  }
  
  // Print readings
  Serial.printf("Voltage: %.1f V\n", voltage);
  Serial.printf("Current: %.3f A\n", current);
  Serial.printf("Power: %.1f W\n", power);
  Serial.printf("Energy: %.3f kWh\n", energy);
  Serial.printf("Frequency: %.1f Hz\n", frequency);
  Serial.printf("PF: %.2f\n", pf);
  
  // Publish to MQTT
  if (mqtt.connected()) {
    publishTelemetry("voltage", voltage);
    publishTelemetry("current", current);
    publishTelemetry("power", power);
    
    Serial.println("✅ Published to MQTT");
  } else {
    Serial.println("⚠️ MQTT not connected, skipping publish");
  }
}

void publishTelemetry(const char* subtopic, float value) {
  char topic[128];
  snprintf(topic, sizeof(topic), "%s/%s", MQTT_TOPIC_TELEMETRY, subtopic);
  
  char payload[64];
  snprintf(payload, sizeof(payload), "{\"value\":%.2f,\"timestamp\":\"%s\"}", 
           value, 
           "2024-01-01T00:00:00Z");  // Simplified timestamp
  
  // Use current timestamp
  char timestamp[32];
  unsigned long epoch = millis() / 1000;
  snprintf(timestamp, sizeof(timestamp), "%lu", epoch);
  snprintf(payload, sizeof(payload), "{\"value\":%.2f,\"timestamp\":%s}", 
           value, timestamp);
  
  mqtt.publish(topic, payload);
}

void handleCommand(char* topic, byte* payload, unsigned int length) {
  Serial.print("📨 Message received [");
  Serial.print(topic);
  Serial.print("]: ");
  
  // Convert payload to string
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  Serial.println(message);
  
  // Check if it's a relay command
  if (strcmp(topic, MQTT_TOPIC_COMMAND) == 0) {
    // Simple parsing - look for "true" or "false"
    if (strstr(message, "\"state\":true") != NULL) {
      setRelay(true);
    } else if (strstr(message, "\"state\":false") != NULL) {
      setRelay(false);
    } else if (strstr(message, "true") != NULL) {
      setRelay(true);
    } else if (strstr(message, "false") != NULL) {
      setRelay(false);
    }
  }
}

void setRelay(bool state) {
  relayState = state;
  digitalWrite(RELAY_PIN, state ? HIGH : LOW);
  
  Serial.printf("🔌 Relay %s\n", state ? "ON" : "OFF");
  
  // Publish relay state
  if (mqtt.connected()) {
    char payload[64];
    snprintf(payload, sizeof(payload), "{\"state\":%s,\"timestamp\":%lu}", 
             state ? "true" : "false", millis() / 1000);
    mqtt.publish("homesync/poc/node1/telemetry/relay", payload);
  }
}
