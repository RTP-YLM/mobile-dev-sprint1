# Gold Scalping Bot - Demo

**ทุน:** $300 USD (Demo Account)  
**Strategy:** Volatility Breakout Scalping  
**เป้าหมาย:** 10-20% profit/สัปดาห์

## 📁 โครงสร้าง
```
ProjectDear/
├── bot.py              # Main trading bot
├── config.json         # การตั้งค่า strategy + risk
├── indicators.py       # Indicators (RSI, Bollinger, ATR)
├── broker.py           # MT5 API connection
├── logger.py           # Log trades
├── requirements.txt    # Python dependencies
├── trades.db           # SQLite database
└── logs/               # Trade logs
```

## 🎯 Strategy
- **Entry:** Bollinger Breakout + ATR > 1.5 + RSI 30-70
- **Exit:** TP 30 pips / SL 15 pips (1:2)
- **Risk:** 2% per trade
- **Max trades/day:** 5
- **เวลาเทรด:** 14:00-02:00 น.

## 🚀 Setup

### 1. ติดตั้ง MetaTrader 5
- ดาวน์โหลด: https://www.metatrader5.com/en/download
- สมัคร demo account (broker: Exness, XM, IC Markets)

### 2. ติดตั้ง Python dependencies
```bash
pip install -r requirements.txt
```

### 3. แก้ config.json
ใส่ข้อมูล MT5 account

### 4. รัน bot
```bash
python bot.py
```

## 📊 ติดตาม
- Log: `logs/trades_YYYY-MM-DD.log`
- Database: `trades.db` (SQLite)
- Alert: ส่งมาทาง chat

---
**Created:** 2025-01-XX  
**Status:** Development
