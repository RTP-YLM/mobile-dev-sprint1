"""
Broker Module
Handle MT5 connection and order execution
"""
import MetaTrader5 as mt5
import pandas as pd
from datetime import datetime
import time


class MT5Broker:
    def __init__(self, config):
        self.config = config
        self.connected = False
        
    def connect(self):
        """Connect to MT5"""
        if not mt5.initialize(
            path=self.config['mt5'].get('path', ''),
            login=self.config['mt5']['login'],
            password=self.config['mt5']['password'],
            server=self.config['mt5']['server']
        ):
            print(f"❌ MT5 connection failed: {mt5.last_error()}")
            return False
        
        self.connected = True
        account_info = mt5.account_info()
        if account_info:
            print(f"✅ Connected to MT5")
            print(f"   Account: {account_info.login}")
            print(f"   Balance: ${account_info.balance:.2f}")
            print(f"   Server: {account_info.server}")
        return True
    
    def disconnect(self):
        """Disconnect from MT5"""
        mt5.shutdown()
        self.connected = False
        print("🔌 Disconnected from MT5")
    
    def get_data(self, symbol, timeframe, bars=100):
        """Get historical data"""
        if not self.connected:
            return None
        
        # Convert timeframe string to MT5 constant
        tf_map = {
            'M1': mt5.TIMEFRAME_M1,
            'M5': mt5.TIMEFRAME_M5,
            'M15': mt5.TIMEFRAME_M15,
            'M30': mt5.TIMEFRAME_M30,
            'H1': mt5.TIMEFRAME_H1,
            'H4': mt5.TIMEFRAME_H4,
            'D1': mt5.TIMEFRAME_D1
        }
        
        rates = mt5.copy_rates_from_pos(symbol, tf_map.get(timeframe, mt5.TIMEFRAME_M5), 0, bars)
        if rates is None:
            return None
        
        df = pd.DataFrame(rates)
        df['time'] = pd.to_datetime(df['time'], unit='s')
        return df
    
    def get_account_balance(self):
        """Get current account balance"""
        if not self.connected:
            return None
        account_info = mt5.account_info()
        return account_info.balance if account_info else None
    
    def calculate_lot_size(self, symbol, risk_percent, stop_loss_pips):
        """Calculate lot size based on risk management"""
        balance = self.get_account_balance()
        if not balance:
            return 0.01  # Minimum lot
        
        risk_amount = balance * (risk_percent / 100)
        
        # Get symbol info for pip value calculation
        symbol_info = mt5.symbol_info(symbol)
        if not symbol_info:
            return 0.01
        
        # For XAUUSD: 1 pip = $0.01 per 0.01 lot
        pip_value = 0.01  # per 0.01 lot
        lot_size = (risk_amount / stop_loss_pips) / pip_value
        
        # Round to MT5 lot step (usually 0.01)
        lot_size = round(lot_size / symbol_info.volume_step) * symbol_info.volume_step
        
        # Ensure within min/max limits
        lot_size = max(symbol_info.volume_min, min(lot_size, symbol_info.volume_max))
        
        return lot_size
    
    def place_order(self, symbol, order_type, lot_size, sl_pips, tp_pips, comment=""):
        """Place market order"""
        if not self.connected:
            return None
        
        # Get current price
        tick = mt5.symbol_info_tick(symbol)
        if not tick:
            return None
        
        point = mt5.symbol_info(symbol).point
        
        if order_type == "BUY":
            price = tick.ask
            sl = price - sl_pips * point * 10  # XAUUSD: 1 pip = 10 points
            tp = price + tp_pips * point * 10
            order_type_mt5 = mt5.ORDER_TYPE_BUY
        else:  # SELL
            price = tick.bid
            sl = price + sl_pips * point * 10
            tp = price - tp_pips * point * 10
            order_type_mt5 = mt5.ORDER_TYPE_SELL
        
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": symbol,
            "volume": lot_size,
            "type": order_type_mt5,
            "price": price,
            "sl": sl,
            "tp": tp,
            "deviation": 10,
            "magic": 234000,
            "comment": comment,
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        
        result = mt5.order_send(request)
        
        if result.retcode != mt5.TRADE_RETCODE_DONE:
            print(f"❌ Order failed: {result.comment}")
            return None
        
        print(f"✅ {order_type} order placed: {lot_size} lots @ {price:.2f}")
        print(f"   SL: {sl:.2f} | TP: {tp:.2f}")
        return result
    
    def get_open_positions(self, symbol=None):
        """Get all open positions"""
        if not self.connected:
            return []
        
        if symbol:
            positions = mt5.positions_get(symbol=symbol)
        else:
            positions = mt5.positions_get()
        
        return list(positions) if positions else []
    
    def close_position(self, position):
        """Close a specific position"""
        if not self.connected:
            return None
        
        tick = mt5.symbol_info_tick(position.symbol)
        if not tick:
            return None
        
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": position.symbol,
            "volume": position.volume,
            "type": mt5.ORDER_TYPE_SELL if position.type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY,
            "position": position.ticket,
            "price": tick.bid if position.type == mt5.ORDER_TYPE_BUY else tick.ask,
            "deviation": 10,
            "magic": 234000,
            "comment": "Close by bot",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        
        result = mt5.order_send(request)
        if result.retcode != mt5.TRADE_RETCODE_DONE:
            print(f"❌ Close failed: {result.comment}")
            return None
        
        print(f"🔒 Position closed: {position.ticket}")
        return result
