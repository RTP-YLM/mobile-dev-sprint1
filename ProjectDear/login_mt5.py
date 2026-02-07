#!/usr/bin/env python3
"""
Auto-login to MT5 via SiliconMetaTrader5
"""
from siliconmetatrader5 import MetaTrader5

print("🔐 Logging in to MT5...")

mt5 = MetaTrader5(host="localhost", port=8001, keepalive=True)

# Check connection
if not mt5.ping():
    print("❌ Cannot connect to MT5 Docker container")
    print("   Is it running? Check: docker ps")
    exit(1)

print("✅ Connected to MT5 API")

# Login credentials
login = 415211240
password = "3605@Dear"
server = "Exness-MT5Trial14"

print(f"\n🔑 Attempting login...")
print(f"   Login: {login}")
print(f"   Server: {server}")

# Attempt login
authorized = mt5.initialize(
    login=login,
    password=password,
    server=server,
    timeout=30000,
    portable=False
)

if authorized:
    account_info = mt5.account_info()
    if account_info:
        print("\n✅ Login successful!")
        print(f"\n📊 Account Info:")
        print(f"   Login: {account_info.login}")
        print(f"   Name: {account_info.name}")
        print(f"   Balance: ${account_info.balance:.2f}")
        print(f"   Equity: ${account_info.equity:.2f}")
        print(f"   Server: {account_info.server}")
        print(f"   Leverage: 1:{account_info.leverage}")
        print(f"   Currency: {account_info.currency}")
        
        # Test data fetch
        print("\n📈 Testing data fetch (XAUUSD)...")
        rates = mt5.copy_rates_from_pos("XAUUSD", mt5.TIMEFRAME_M5, 0, 10)
        
        if rates and len(rates) > 0:
            print(f"✅ Data OK! Got {len(rates)} bars")
            print(f"   Latest price: {rates[-1]['close']:.2f}")
        else:
            print("⚠️  No XAUUSD data. Add to Market Watch in MT5")
        
        print("\n🎉 All systems ready! You can now run the bot:")
        print("   python3 bot_silicon.py")
    else:
        print("❌ Login succeeded but cannot get account info")
else:
    error = mt5.last_error()
    print(f"\n❌ Login failed!")
    print(f"   Error: {error}")
    print("\nPossible reasons:")
    print("   1. Wrong credentials")
    print("   2. Server name incorrect")
    print("   3. Account disabled/expired")
    print("   4. MT5 not fully started in Docker")

mt5.shutdown()
