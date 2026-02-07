"""
Indicators Module
Calculate RSI, Bollinger Bands, ATR for trading signals
"""
import pandas as pd
import numpy as np


def calculate_rsi(data, period=14):
    """Calculate RSI (Relative Strength Index)"""
    delta = data['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi


def calculate_bollinger_bands(data, period=20, std=2):
    """Calculate Bollinger Bands"""
    sma = data['close'].rolling(window=period).mean()
    std_dev = data['close'].rolling(window=period).std()
    
    upper_band = sma + (std_dev * std)
    lower_band = sma - (std_dev * std)
    
    return upper_band, sma, lower_band


def calculate_atr(data, period=14):
    """Calculate ATR (Average True Range)"""
    high = data['high']
    low = data['low']
    close = data['close']
    
    tr1 = high - low
    tr2 = abs(high - close.shift())
    tr3 = abs(low - close.shift())
    
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(window=period).mean()
    
    return atr


def calculate_volume_spike(data, period=20):
    """Check if volume is above average"""
    if 'tick_volume' not in data.columns:
        return pd.Series([False] * len(data))
    
    volume_ma = data['tick_volume'].rolling(window=period).mean()
    return data['tick_volume'] > volume_ma


def generate_signals(data, config):
    """
    Generate buy/sell signals based on strategy
    Returns: DataFrame with signal column (-1: sell, 0: hold, 1: buy)
    """
    # Calculate indicators
    data['rsi'] = calculate_rsi(data, config['indicators']['rsi_period'])
    upper_bb, middle_bb, lower_bb = calculate_bollinger_bands(
        data, 
        config['indicators']['bb_period'],
        config['indicators']['bb_std']
    )
    data['bb_upper'] = upper_bb
    data['bb_middle'] = middle_bb
    data['bb_lower'] = lower_bb
    data['atr'] = calculate_atr(data, config['indicators']['atr_period'])
    data['volume_spike'] = calculate_volume_spike(data, config['indicators']['volume_ma_period'])
    
    # Initialize signal
    data['signal'] = 0
    
    # Buy signal conditions
    buy_conditions = (
        (data['close'] < data['bb_lower']) &  # Price below lower BB
        (data['rsi'] > config['indicators']['rsi_oversold']) &  # RSI recovery from oversold
        (data['rsi'] < 50) &
        (data['atr'] > config['indicators']['atr_threshold'])  # High volatility
    )
    
    # Sell signal conditions
    sell_conditions = (
        (data['close'] > data['bb_upper']) &  # Price above upper BB
        (data['rsi'] < config['indicators']['rsi_overbought']) &  # RSI pullback from overbought
        (data['rsi'] > 50) &
        (data['atr'] > config['indicators']['atr_threshold'])
    )
    
    data.loc[buy_conditions, 'signal'] = 1
    data.loc[sell_conditions, 'signal'] = -1
    
    return data
