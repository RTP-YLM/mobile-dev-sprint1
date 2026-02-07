#!/usr/bin/env python3
"""
Gold Trading Signal Bot - Semi-Auto
Analyzes market and sends signals via Telegram (no auto-execution)
"""
import json
import time
import requests
from datetime import datetime
import signal
import sys

import pandas as pd
from indicators import generate_signals

# Yahoo Finance for free market data
import yfinance as yf


class SignalBot:
    def __init__(self, config_path="config.json"):
        # Load config
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # Telegram setup (you'll need to provide BOT_TOKEN and CHAT_ID)
        self.telegram_token = None  # Set this
        self.telegram_chat_id = None  # Set this
        
        # State
        self.running = False
        self.last_signal = None
        self.last_signal_time = None
        
        print("🤖 Gold Signal Bot initialized")
        print(f"   Symbol: {self.config['strategy']['symbol']}")
        print(f"   Timeframe: {self.config['strategy']['timeframe']}")
        print(f"   Mode: SIGNAL ONLY (no auto-execution)")
    
    def set_telegram(self, token, chat_id):
        """Set Telegram credentials"""
        self.telegram_token = token
        self.telegram_chat_id = chat_id
        print(f"✅ Telegram configured: Chat {chat_id}")
    
    def send_telegram(self, message):
        """Send message via Telegram"""
        if not self.telegram_token or not self.telegram_chat_id:
            print(f"📱 [Telegram] {message}")
            return False
        
        url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
        payload = {
            "chat_id": self.telegram_chat_id,
            "text": message,
            "parse_mode": "HTML"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"❌ Telegram send failed: {e}")
            return False
    
    def fetch_market_data(self):
        """Fetch XAUUSD data from Yahoo Finance (free!)"""
        try:
            # Gold futures: GC=F
            ticker = yf.Ticker("GC=F")
            
            # Get data based on timeframe
            timeframe = self.config['strategy']['timeframe']
            interval_map = {
                'M1': '1m',
                'M5': '5m',
                'M15': '15m',
                'M30': '30m',
                'H1': '1h',
                'H4': '4h',
                'D1': '1d'
            }
            interval = interval_map.get(timeframe, '5m')
            
            # Fetch last 1-2 days of data
            data = ticker.history(period='2d', interval=interval)
            
            if data.empty:
                print("⚠️  No data received from Yahoo Finance")
                return None
            
            # Rename columns to match our format
            data = data.rename(columns={
                'Open': 'open',
                'High': 'high',
                'Low': 'low',
                'Close': 'close',
                'Volume': 'tick_volume'
            })
            
            data = data[['open', 'high', 'low', 'close', 'tick_volume']].copy()
            data.reset_index(inplace=True)
            data.rename(columns={'Datetime': 'time'}, inplace=True)
            
            return data
        
        except Exception as e:
            print(f"❌ Data fetch error: {e}")
            return None
    
    def analyze_market(self):
        """Analyze market and generate signal"""
        # Fetch data
        data = self.fetch_market_data()
        if data is None or len(data) < 50:
            return None
        
        # Generate signals
        data = generate_signals(data, self.config)
        
        # Get latest bar
        latest = data.iloc[-1]
        signal = latest['signal']
        
        # Check trading hours
        current_hour = datetime.now().hour
        start_hour = self.config['strategy']['trading_hours']['start']
        end_hour = self.config['strategy']['trading_hours']['end']
        
        in_trading_hours = False
        if start_hour < end_hour:
            in_trading_hours = start_hour <= current_hour < end_hour
        else:
            in_trading_hours = current_hour >= start_hour or current_hour < end_hour
        
        if not in_trading_hours:
            signal = 0  # Override signal outside trading hours
        
        return {
            'signal': signal,
            'price': latest['close'],
            'rsi': latest['rsi'],
            'atr': latest['atr'],
            'bb_upper': latest['bb_upper'],
            'bb_lower': latest['bb_lower'],
            'time': latest['time'],
            'in_trading_hours': in_trading_hours
        }
    
    def format_signal_message(self, analysis):
        """Format signal message for Telegram"""
        signal = analysis['signal']
        
        if signal == 0:
            return None  # No signal
        
        # Calculate suggested SL/TP
        price = analysis['price']
        sl_pips = self.config['strategy']['stop_loss_pips']
        tp_pips = self.config['strategy']['take_profit_pips']
        
        # Gold: 1 pip = 0.10, so multiply by 10 for actual price
        pip_value = 0.10
        
        if signal == 1:  # BUY
            direction = "🟢 BUY"
            entry_price = price
            stop_loss = price - (sl_pips * pip_value)
            take_profit = price + (tp_pips * pip_value)
        else:  # SELL
            direction = "🔴 SELL"
            entry_price = price
            stop_loss = price + (sl_pips * pip_value)
            take_profit = price - (tp_pips * pip_value)
        
        # Format message
        msg = f"""
<b>{direction} SIGNAL - XAUUSD</b>

📊 <b>Market Analysis:</b>
Price: ${price:.2f}
RSI: {analysis['rsi']:.1f}
ATR: {analysis['atr']:.2f}

📈 <b>Suggested Trade:</b>
Entry: ${entry_price:.2f}
Stop Loss: ${stop_loss:.2f} ({sl_pips} pips)
Take Profit: ${take_profit:.2f} ({tp_pips} pips)

Risk: {self.config['strategy']['risk_percent']}% per trade
Max Trades Today: {self.config['strategy']['max_trades_per_day']}

⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

<i>Execute manually on:</i>
https://my.exness.com/webtrading/
""".strip()
        
        return msg
    
    def start(self):
        """Start monitoring"""
        if not self.telegram_token:
            print("\n⚠️  Telegram not configured!")
            print("   Set credentials first:")
            print("   bot.set_telegram('BOT_TOKEN', 'CHAT_ID')")
            print("\n   Running in console mode (signals will print here)\n")
        
        self.running = True
        self.send_telegram("🤖 <b>Signal Bot Started</b>\n\nMonitoring XAUUSD for trading opportunities...")
        
        print("🚀 Bot started! Monitoring market...\n")
        
        try:
            while self.running:
                analysis = self.analyze_market()
                
                if analysis:
                    signal = analysis['signal']
                    
                    # Only send if:
                    # 1. New signal (different from last)
                    # 2. At least 15 minutes since last signal
                    time_since_last = None
                    if self.last_signal_time:
                        time_since_last = (datetime.now() - self.last_signal_time).total_seconds() / 60
                    
                    should_send = (
                        signal != 0 and
                        signal != self.last_signal and
                        (time_since_last is None or time_since_last >= 15)
                    )
                    
                    if should_send:
                        message = self.format_signal_message(analysis)
                        if message:
                            self.send_telegram(message)
                            self.last_signal = signal
                            self.last_signal_time = datetime.now()
                            print(f"📤 Signal sent: {'BUY' if signal == 1 else 'SELL'} at ${analysis['price']:.2f}")
                    
                    # Status update (console only)
                    if not analysis['in_trading_hours']:
                        print(f"⏸️  Outside trading hours | Price: ${analysis['price']:.2f} | RSI: {analysis['rsi']:.1f}")
                    else:
                        status = "🟢 BUY" if signal == 1 else "🔴 SELL" if signal == -1 else "⚪ HOLD"
                        print(f"{status} | Price: ${analysis['price']:.2f} | RSI: {analysis['rsi']:.1f} | ATR: {analysis['atr']:.2f}")
                
                # Check every 1 minute
                time.sleep(60)
        
        except KeyboardInterrupt:
            print("\n⚠️  Bot stopped by user")
        finally:
            self.stop()
    
    def stop(self):
        """Stop the bot"""
        self.running = False
        self.send_telegram("🛑 <b>Signal Bot Stopped</b>")
        print("\n👋 Bot stopped!\n")


def signal_handler(sig, frame):
    """Handle Ctrl+C"""
    print("\n⚠️  Stopping bot...")
    sys.exit(0)


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    
    # Create bot
    bot = SignalBot()
    
    # Optional: Set Telegram credentials
    # bot.set_telegram("YOUR_BOT_TOKEN", "YOUR_CHAT_ID")
    
    # Start monitoring
    bot.start()
