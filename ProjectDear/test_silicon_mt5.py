#!/usr/bin/env python3
"""
Test SiliconMetaTrader5 Connection
"""
try:
    from siliconmetatrader5 import MetaTrader5
except ImportError:
    print("❌ siliconmetatrader5 not installed")
    print("Run: pip3 install siliconmetatrader5")
    exit(1)

import pandas as pd

print("🔌 Connecting to MT5...")
mt5 = MetaTrader5(host="localhost", port=8001, keepalive=True)

# Check connection
if mt5.ping():
    print("✅ Connection alive!")
else:
    print("❌ Connection failed. Is Docker running?")
    print("   Run: cd silicon-metatrader5/docker && docker compose up")
    exit(1)

# Get account info
account_info = mt5.account_info()
if account_info:
    print("\n📊 Account Info:")
    print(f"   Login: {account_info.login}")
    print(f"   Balance: ${account_info.balance:.2f}")
    print(f"   Server: {account_info.server}")
    print(f"   Leverage: 1:{account_info.leverage}")
else:
    print("⚠️  Not logged in. Login via VNC first:")
    print("   http://localhost:6081/vnc.html (password: 123456)")
    mt5.shutdown()
    exit(0)

# Test data fetch (using copy_rates_from_pos - recommended!)
print("\n📈 Fetching XAUUSD data...")
rates = mt5.copy_rates_from_pos("XAUUSD", mt5.TIMEFRAME_M5, 0, 100)

if rates is not None and len(rates) > 0:
    df = pd.DataFrame(rates)
    df['time'] = pd.to_datetime(df['time'], unit='s')
    
    print(f"✅ Received {len(df)} bars")
    print("\nLatest 5 bars:")
    print(df[['time', 'open', 'high', 'low', 'close']].tail())
else:
    print("❌ No data received. Check symbol in MT5 Market Watch")

mt5.shutdown()
print("\n✅ Test complete!")
