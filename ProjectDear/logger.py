"""
Logger Module
Log all trades to file and database
"""
import sqlite3
import json
from datetime import datetime
import os


class TradeLogger:
    def __init__(self, db_path="trades.db", log_dir="logs"):
        self.db_path = db_path
        self.log_dir = log_dir
        
        # Create logs directory
        os.makedirs(log_dir, exist_ok=True)
        
        # Initialize database
        self._init_db()
    
    def _init_db(self):
        """Create trades table if not exists"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                symbol TEXT,
                type TEXT,
                lot_size REAL,
                entry_price REAL,
                sl REAL,
                tp REAL,
                exit_price REAL,
                profit REAL,
                status TEXT,
                comment TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS daily_stats (
                date TEXT PRIMARY KEY,
                total_trades INTEGER,
                wins INTEGER,
                losses INTEGER,
                total_profit REAL,
                balance REAL
            )
        """)
        
        conn.commit()
        conn.close()
    
    def log_trade(self, trade_data):
        """Log trade to database and file"""
        # Database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO trades (timestamp, symbol, type, lot_size, entry_price, sl, tp, exit_price, profit, status, comment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            trade_data.get('timestamp', datetime.now().isoformat()),
            trade_data.get('symbol'),
            trade_data.get('type'),
            trade_data.get('lot_size'),
            trade_data.get('entry_price'),
            trade_data.get('sl'),
            trade_data.get('tp'),
            trade_data.get('exit_price'),
            trade_data.get('profit'),
            trade_data.get('status'),
            trade_data.get('comment', '')
        ))
        
        conn.commit()
        conn.close()
        
        # File log
        today = datetime.now().strftime("%Y-%m-%d")
        log_file = os.path.join(self.log_dir, f"trades_{today}.log")
        
        with open(log_file, 'a') as f:
            f.write(json.dumps(trade_data, indent=2) + "\n")
    
    def update_daily_stats(self, date, stats):
        """Update daily statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT OR REPLACE INTO daily_stats (date, total_trades, wins, losses, total_profit, balance)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            date,
            stats.get('total_trades', 0),
            stats.get('wins', 0),
            stats.get('losses', 0),
            stats.get('total_profit', 0),
            stats.get('balance', 0)
        ))
        
        conn.commit()
        conn.close()
    
    def get_today_trades(self):
        """Get all trades from today"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().strftime("%Y-%m-%d")
        cursor.execute("""
            SELECT * FROM trades WHERE date(timestamp) = ?
        """, (today,))
        
        trades = cursor.fetchall()
        conn.close()
        
        return trades
    
    def get_stats(self, days=7):
        """Get statistics for last N days"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM daily_stats ORDER BY date DESC LIMIT ?
        """, (days,))
        
        stats = cursor.fetchall()
        conn.close()
        
        return stats
    
    def print_summary(self):
        """Print trading summary"""
        today_trades = self.get_today_trades()
        
        print("\n" + "="*50)
        print("📊 TRADING SUMMARY")
        print("="*50)
        print(f"Today's trades: {len(today_trades)}")
        
        if today_trades:
            wins = sum(1 for t in today_trades if t[9] == 'WIN')  # status column
            losses = sum(1 for t in today_trades if t[9] == 'LOSS')
            total_profit = sum(t[8] or 0 for t in today_trades)  # profit column
            
            print(f"Wins: {wins} | Losses: {losses}")
            print(f"Win rate: {(wins/(wins+losses)*100):.1f}%" if (wins+losses) > 0 else "N/A")
            print(f"Total P/L: ${total_profit:.2f}")
        
        print("="*50 + "\n")
