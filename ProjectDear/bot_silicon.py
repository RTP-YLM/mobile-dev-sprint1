"""
Gold Scalping Bot - Silicon Version (macOS M1/M2/M3)
Uses SiliconMetaTrader5 instead of native MetaTrader5
"""
import json
import time
from datetime import datetime
import signal
import sys

try:
    from siliconmetatrader5 import MetaTrader5
except ImportError:
    print("❌ siliconmetatrader5 not installed!")
    print("Run: pip3 install siliconmetatrader5")
    sys.exit(1)

import pandas as pd
from indicators import generate_signals
from logger import TradeLogger


class GoldScalpingBot:
    def __init__(self, config_path="config.json"):
        # Load config
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # Initialize MT5 connection
        self.mt5 = MetaTrader5(host="localhost", port=8001, keepalive=True)
        
        # Initialize logger
        self.logger = TradeLogger()
        
        # Trading state
        self.running = False
        self.trades_today = 0
        self.consecutive_losses = 0
        self.daily_profit = 0.0
        
        print("🤖 Gold Scalping Bot (Silicon) initialized")
        print(f"   Symbol: {self.config['strategy']['symbol']}")
        print(f"   Risk: {self.config['strategy']['risk_percent']}% per trade")
        print(f"   TP/SL: {self.config['strategy']['take_profit_pips']}/{self.config['strategy']['stop_loss_pips']} pips")
    
    def start(self):
        """Start the trading bot"""
        # Check connection
        if not self.mt5.ping():
            print("❌ Cannot connect to MT5. Is Docker running?")
            print("   Run: cd silicon-metatrader5/docker && docker compose up")
            return
        
        # Check login
        account_info = self.mt5.account_info()
        if not account_info:
            print("⚠️  Not logged in. Login via VNC:")
            print("   http://localhost:6081/vnc.html (password: 123456)")
            return
        
        print(f"\n✅ Connected to MT5")
        print(f"   Account: {account_info.login}")
        print(f"   Balance: ${account_info.balance:.2f}")
        print(f"   Server: {account_info.server}")
        
        self.running = True
        print("\n🚀 Bot started! Monitoring market...\n")
        
        # Main loop
        try:
            while self.running:
                self.run_cycle()
                time.sleep(30)  # Check every 30 seconds
        except KeyboardInterrupt:
            print("\n⚠️  Bot stopped by user")
        finally:
            self.stop()
    
    def run_cycle(self):
        """Single trading cycle"""
        # Check trading hours
        current_hour = datetime.now().hour
        start_hour = self.config['strategy']['trading_hours']['start']
        end_hour = self.config['strategy']['trading_hours']['end']
        
        # Handle overnight trading (e.g., 14:00-02:00)
        in_trading_hours = False
        if start_hour < end_hour:
            in_trading_hours = start_hour <= current_hour < end_hour
        else:  # Crosses midnight
            in_trading_hours = current_hour >= start_hour or current_hour < end_hour
        
        if not in_trading_hours:
            return
        
        # Check max trades limit
        if self.trades_today >= self.config['strategy']['max_trades_per_day']:
            print(f"⏸️  Max trades reached today ({self.trades_today})")
            return
        
        # Check consecutive losses
        if self.consecutive_losses >= self.config['strategy']['max_consecutive_losses']:
            print(f"⏸️  Max consecutive losses ({self.consecutive_losses}). Stopped for today.")
            return
        
        # Get market data (use copy_rates_from_pos - recommended for Silicon!)
        symbol = self.config['strategy']['symbol']
        timeframe_str = self.config['strategy']['timeframe']
        
        # Map timeframe
        tf_map = {
            'M1': self.mt5.TIMEFRAME_M1,
            'M5': self.mt5.TIMEFRAME_M5,
            'M15': self.mt5.TIMEFRAME_M15,
            'M30': self.mt5.TIMEFRAME_M30,
            'H1': self.mt5.TIMEFRAME_H1,
            'H4': self.mt5.TIMEFRAME_H4,
            'D1': self.mt5.TIMEFRAME_D1
        }
        timeframe = tf_map.get(timeframe_str, self.mt5.TIMEFRAME_M5)
        
        rates = self.mt5.copy_rates_from_pos(symbol, timeframe, 0, 100)
        
        if rates is None or len(rates) == 0:
            print("⚠️  No data received")
            return
        
        # Convert to DataFrame
        data = pd.DataFrame(rates)
        data['time'] = pd.to_datetime(data['time'], unit='s')
        
        # Generate signals
        data = generate_signals(data, self.config)
        latest = data.iloc[-1]
        signal = latest['signal']
        
        # Check for existing positions
        positions = self.mt5.positions_get(symbol=symbol)
        positions = list(positions) if positions else []
        
        # Manage existing positions
        for pos in positions:
            self._manage_position(pos, latest)
        
        # No signal or already have position
        if signal == 0 or len(positions) > 0:
            return
        
        # Execute trade
        if signal == 1:  # BUY
            self._execute_trade("BUY", latest)
        elif signal == -1:  # SELL
            self._execute_trade("SELL", latest)
    
    def _execute_trade(self, order_type, market_data):
        """Execute a trade"""
        symbol = self.config['strategy']['symbol']
        risk_percent = self.config['strategy']['risk_percent']
        sl_pips = self.config['strategy']['stop_loss_pips']
        tp_pips = self.config['strategy']['take_profit_pips']
        
        # Get account balance
        account_info = self.mt5.account_info()
        if not account_info:
            return
        
        balance = account_info.balance
        risk_amount = balance * (risk_percent / 100)
        
        # Calculate lot size (simplified for XAUUSD)
        pip_value = 0.01  # per 0.01 lot
        lot_size = (risk_amount / sl_pips) / pip_value
        lot_size = max(0.01, min(round(lot_size, 2), 1.0))  # 0.01 - 1.0
        
        # Get current price
        tick = self.mt5.symbol_info_tick(symbol)
        if not tick:
            return
        
        # Get symbol info
        symbol_info = self.mt5.symbol_info(symbol)
        if not symbol_info:
            return
        
        point = symbol_info.point
        
        # Calculate SL/TP prices
        if order_type == "BUY":
            price = tick.ask
            sl = price - sl_pips * point * 10
            tp = price + tp_pips * point * 10
            order_type_mt5 = self.mt5.ORDER_TYPE_BUY
        else:  # SELL
            price = tick.bid
            sl = price + sl_pips * point * 10
            tp = price - tp_pips * point * 10
            order_type_mt5 = self.mt5.ORDER_TYPE_SELL
        
        # Place order
        request = {
            "action": self.mt5.TRADE_ACTION_DEAL,
            "symbol": symbol,
            "volume": lot_size,
            "type": order_type_mt5,
            "price": price,
            "sl": sl,
            "tp": tp,
            "deviation": 10,
            "magic": 234000,
            "comment": f"Scalp_{order_type}",
            "type_time": self.mt5.ORDER_TIME_GTC,
            "type_filling": self.mt5.ORDER_FILLING_IOC,
        }
        
        result = self.mt5.order_send(request)
        
        if result.retcode != self.mt5.TRADE_RETCODE_DONE:
            print(f"❌ Order failed: {result.comment}")
            return
        
        self.trades_today += 1
        
        # Log trade
        self.logger.log_trade({
            'timestamp': datetime.now().isoformat(),
            'symbol': symbol,
            'type': order_type,
            'lot_size': lot_size,
            'entry_price': result.price,
            'sl': sl,
            'tp': tp,
            'exit_price': None,
            'profit': None,
            'status': 'OPEN',
            'comment': f"RSI: {market_data['rsi']:.2f}, ATR: {market_data['atr']:.2f}"
        })
        
        print(f"\n💰 Trade #{self.trades_today} executed!")
        print(f"   Type: {order_type}")
        print(f"   Price: {result.price:.2f}")
        print(f"   Lot: {lot_size}")
        print(f"   RSI: {market_data['rsi']:.2f} | ATR: {market_data['atr']:.2f}\n")
    
    def _manage_position(self, position, market_data):
        """Manage open position (emergency exit on RSI reversal)"""
        # Emergency exit on RSI reversal
        if position.type == 0:  # BUY position
            if market_data['rsi'] > 70:  # Overbought
                self._close_position(position, "EMERGENCY_EXIT_RSI")
        else:  # SELL position
            if market_data['rsi'] < 30:  # Oversold
                self._close_position(position, "EMERGENCY_EXIT_RSI")
    
    def _close_position(self, position, reason=""):
        """Close a position"""
        tick = self.mt5.symbol_info_tick(position.symbol)
        if not tick:
            return
        
        request = {
            "action": self.mt5.TRADE_ACTION_DEAL,
            "symbol": position.symbol,
            "volume": position.volume,
            "type": self.mt5.ORDER_TYPE_SELL if position.type == 0 else self.mt5.ORDER_TYPE_BUY,
            "position": position.ticket,
            "price": tick.bid if position.type == 0 else tick.ask,
            "deviation": 10,
            "magic": 234000,
            "comment": f"Close: {reason}",
            "type_time": self.mt5.ORDER_TIME_GTC,
            "type_filling": self.mt5.ORDER_FILLING_IOC,
        }
        
        result = self.mt5.order_send(request)
        if result.retcode != self.mt5.TRADE_RETCODE_DONE:
            print(f"❌ Close failed: {result.comment}")
            return
        
        print(f"🔒 Position closed: {position.ticket} ({reason})")
        
        # Log closed trade
        profit = position.profit
        status = "WIN" if profit > 0 else "LOSS"
        
        self.logger.log_trade({
            'timestamp': datetime.now().isoformat(),
            'symbol': position.symbol,
            'type': 'BUY' if position.type == 0 else 'SELL',
            'lot_size': position.volume,
            'entry_price': position.price_open,
            'sl': position.sl,
            'tp': position.tp,
            'exit_price': position.price_current,
            'profit': profit,
            'status': status,
            'comment': reason
        })
        
        self.daily_profit += profit
        
        if profit > 0:
            self.consecutive_losses = 0
            print(f"✅ WIN: ${profit:.2f}")
        else:
            self.consecutive_losses += 1
            print(f"❌ LOSS: ${profit:.2f} (consecutive: {self.consecutive_losses})")
        
        print(f"📊 Daily P/L: ${self.daily_profit:.2f}\n")
    
    def stop(self):
        """Stop the bot"""
        self.running = False
        self.logger.print_summary()
        self.mt5.shutdown()
        print("\n👋 Bot stopped. See you next time!\n")


def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n⚠️  Stopping bot...")
    sys.exit(0)


if __name__ == "__main__":
    # Register signal handler
    signal.signal(signal.SIGINT, signal_handler)
    
    # Start bot
    bot = GoldScalpingBot()
    bot.start()
