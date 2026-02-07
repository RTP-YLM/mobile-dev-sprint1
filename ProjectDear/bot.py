"""
Gold Scalping Bot - Main Trading Engine
Strategy: Volatility Breakout Scalping
"""
import json
import time
from datetime import datetime
import signal
import sys

from broker import MT5Broker
from indicators import generate_signals
from logger import TradeLogger


class GoldScalpingBot:
    def __init__(self, config_path="config.json"):
        # Load config
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # Initialize components
        self.broker = MT5Broker(self.config)
        self.logger = TradeLogger()
        
        # Trading state
        self.running = False
        self.trades_today = 0
        self.consecutive_losses = 0
        self.daily_profit = 0.0
        
        print("🤖 Gold Scalping Bot initialized")
        print(f"   Symbol: {self.config['strategy']['symbol']}")
        print(f"   Risk: {self.config['strategy']['risk_percent']}% per trade")
        print(f"   TP/SL: {self.config['strategy']['take_profit_pips']}/{self.config['strategy']['stop_loss_pips']} pips")
    
    def start(self):
        """Start the trading bot"""
        # Connect to broker
        if not self.broker.connect():
            print("❌ Cannot connect to MT5. Exiting.")
            return
        
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
        
        # Get market data
        symbol = self.config['strategy']['symbol']
        timeframe = self.config['strategy']['timeframe']
        data = self.broker.get_data(symbol, timeframe, bars=100)
        
        if data is None or len(data) == 0:
            print("⚠️  No data received")
            return
        
        # Generate signals
        data = generate_signals(data, self.config)
        latest = data.iloc[-1]
        signal = latest['signal']
        
        # Check for existing positions
        positions = self.broker.get_open_positions(symbol)
        
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
        
        # Calculate lot size
        lot_size = self.broker.calculate_lot_size(symbol, risk_percent, sl_pips)
        
        # Place order
        result = self.broker.place_order(symbol, order_type, lot_size, sl_pips, tp_pips, 
                                         comment=f"Scalp_{order_type}")
        
        if result:
            self.trades_today += 1
            
            # Log trade
            self.logger.log_trade({
                'timestamp': datetime.now().isoformat(),
                'symbol': symbol,
                'type': order_type,
                'lot_size': lot_size,
                'entry_price': result.price,
                'sl': result.request.sl,
                'tp': result.request.tp,
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
        """Manage open position (trailing stop, emergency exit)"""
        # Emergency exit on RSI reversal
        if position.type == 0:  # BUY position
            if market_data['rsi'] > 70:  # Overbought
                self.broker.close_position(position)
                print("🚨 Emergency close (RSI overbought)")
                self._log_closed_trade(position, "EMERGENCY_EXIT")
        else:  # SELL position
            if market_data['rsi'] < 30:  # Oversold
                self.broker.close_position(position)
                print("🚨 Emergency close (RSI oversold)")
                self._log_closed_trade(position, "EMERGENCY_EXIT")
        
        # TODO: Implement trailing stop logic
    
    def _log_closed_trade(self, position, reason=""):
        """Log closed trade result"""
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
        self.broker.disconnect()
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
