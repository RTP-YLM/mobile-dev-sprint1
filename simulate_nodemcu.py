#!/usr/bin/env python3
"""
Simple NodeMCU MQTT Simulation - HiveMQ Cloud
"""

import paho.mqtt.client as mqtt
import ssl
import json
import random
import time
from datetime import datetime

MQTT_BROKER = "6b80e273a4374a82880a22449bae15b7.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_USER = "apirach"
MQTT_PASS = "sDT5cX9A@F7ERP6"

TOPIC_TEMP = "nodemcu/sensor/temperature"
TOPIC_HUMID = "nodemcu/sensor/humidity"
TOPIC_STATUS = "nodemcu/status"

def simulate_nodemcu():
    client = mqtt.Client(client_id=f"nodemcu-{random.randint(1000,9999)}")
    client.username_pw_set(MQTT_USER, MQTT_PASS)
    
    # TLS with certificate verification disabled (for demo only)
    client.tls_set(cert_reqs=ssl.CERT_NONE)
    client.tls_insecure_set(True)
    
    connected = False
    
    def on_connect(c, userdata, flags, rc):
        nonlocal connected
        if rc == 0:
            print("✅ Connected to HiveMQ Cloud!")
            connected = True
            c.publish(TOPIC_STATUS, json.dumps({
                "device": "nodemcu-001",
                "status": "online",
                "time": datetime.now().strftime('%H:%M:%S')
            }), qos=1, retain=True)
        else:
            print(f"❌ Connection failed (code: {rc})")
    
    def on_disconnect(c, userdata, rc):
        nonlocal connected
        print(f"⚠️ Disconnected (code: {rc})")
        connected = False
    
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    
    print("🔌 Connecting to HiveMQ...")
    print(f"   URL: {MQTT_BROKER}:{MQTT_PORT}")
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        client.loop_start()
        
        # Wait for connection
        for i in range(10):
            if connected:
                break
            time.sleep(0.5)
        
        if not connected:
            print("❌ Timeout - couldn't connect")
            return
        
        print("\n📡 NodeMCU sending data...")
        print("=" * 45)
        
        count = 0
        while count < 3:  # Send 3 cycles then stop
            count += 1
            temp = round(random.uniform(20, 35), 1)
            humid = round(random.uniform(40, 80), 1)
            
            now = datetime.now().strftime('%H:%M:%S')
            
            print(f"\n[{now}] Message #{count}")
            print(f"   🌡️  Temperature: {temp}°C → {TOPIC_TEMP}")
            client.publish(TOPIC_TEMP, str(temp), qos=1)
            
            time.sleep(0.3)
            
            print(f"   💧 Humidity: {humid}% → {TOPIC_HUMID}")
            client.publish(TOPIC_HUMID, str(humid), qos=1)
            
            if count < 3:
                print("   ⏱️  Waiting 5 seconds...")
                time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping...")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        if connected:
            client.publish(TOPIC_STATUS, json.dumps({
                "device": "nodemcu-001", 
                "status": "offline"
            }), qos=1, retain=True)
        client.loop_stop()
        client.disconnect()
        print("\n👋 Disconnected")

if __name__ == "__main__":
    simulate_nodemcu()
