/**
 * HomeSync POC - Configuration
 * 
 * แก้ไขค่าในไฟล์นี้ให้ตรงกับ environment ของคุณ
 */

#ifndef CONFIG_H
#define CONFIG_H

// ============================================
// WiFi Configuration
// ============================================
#define WIFI_SSID       "YOUR_WIFI_SSID"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

// ============================================
// MQTT Configuration - HiveMQ Cloud
// ============================================
// สมัครฟรีที่ https://www.hivemq.com/mqtt-cloud/
#define MQTT_BROKER     "YOUR_CLUSTER.hivemq.cloud"
#define MQTT_PORT       8883  // TLS port
#define MQTT_USER       "YOUR_HIVEMQ_USERNAME"
#define MQTT_PASS       "YOUR_HIVEMQ_PASSWORD"

// ============================================
// MQTT Topics
// ============================================
#define MQTT_TOPIC_TELEMETRY  "homesync/poc/node1/telemetry"
#define MQTT_TOPIC_COMMAND    "homesync/poc/node1/command/relay"

// ============================================
// Device Configuration
// ============================================
#define DEVICE_ID       "node1"
#define DEVICE_NAME     "HomeSync POC Node 1"

// ============================================
// Timing Configuration
// ============================================
#define TELEMETRY_INTERVAL_MS   5000    // 5 seconds
#define WIFI_CONNECT_TIMEOUT_MS 30000   // 30 seconds
#define MQTT_RECONNECT_DELAY_MS 5000    // 5 seconds

#endif // CONFIG_H
