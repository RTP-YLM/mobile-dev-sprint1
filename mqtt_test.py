#!/usr/bin/env python3
"""
Simple MQTT Test - NodeMCU Simulation
"""

import paho.mqtt.client as mqtt
import ssl
import random
from datetime import datetime

BROKER = "6b80e273a4374a82880a22449bae15b7.s1.eu.hivemq.cloud"
PORT = 8883
USER = "apirach"
PASS = "sDT5cX9A@F7ERP6"

# Create client
client = mqtt.Client(client_id="nodemcu-test-001")
client.username_pw_set(USER, PASS)

# TLS setup
client.tls_set(cert_reqs=ssl.CERT_NONE)
client.tls_insecure_set(True)

print("Connecting to HiveMQ Cloud...")
print(f"Broker: {BROKER}:{PORT}")

try:
    # Connect blocking
    client.connect(BROKER, PORT, keepalive=60)
    print("✅ Connected!\n")
    
    # Simulate sending sensor data
    for i in range(1, 4):
        temp = round(random.uniform(20, 35), 1)
        humid = round(random.uniform(40, 80), 1)
        now = datetime.now().strftime('%H:%M:%S')
        
        print(f"[{now}] Message #{i}")
        print(f"   🌡️  Temp: {temp}°C → nodemcu/sensor/temperature")
        print(f"   💧 Humidity: {humid}% → nodemcu/sensor/humidity")
        
        # Publish
        client.publish("nodemcu/sensor/temperature", str(temp), qos=1)
        client.publish("nodemcu/sensor/humidity", str(humid), qos=1)
        
        if i < 3:
            print("   ⏱️  Waiting 2 seconds...\n")
            import time
            time.sleep(2)
    
    print("\n✅ Done! Published 3 messages.")
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    client.disconnect()
    print("👋 Disconnected")
