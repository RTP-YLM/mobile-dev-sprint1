import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:logger/logger.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';

class WebSocketService {
  final Logger _logger = Logger();
  WebSocketChannel? _channel;
  final _messageController = StreamController<Map<String, dynamic>>.broadcast();
  Timer? _reconnectTimer;
  Timer? _pingTimer;
  
  // ⚠️ แก้ไข IP นี้ให้ตรงกับ Backend Server
  static const String wsUrl = 'ws://192.168.1.100:3000';
  
  Stream<Map<String, dynamic>> get messageStream => _messageController.stream;
  
  bool get isConnected => _channel != null;
  
  void connect() {
    _logger.i('🔌 Connecting to WebSocket: $wsUrl');
    
    try {
      _channel = IOWebSocketChannel.connect(
        wsUrl,
        pingInterval: const Duration(seconds: 30),
      );
      
      _channel!.stream.listen(
        (message) {
          _logger.i('📨 WS Received: $message');
          try {
            final data = jsonDecode(message);
            _messageController.add(data);
          } catch (e) {
            _logger.e('Failed to parse WS message: $e');
          }
        },
        onError: (error) {
          _logger.e('❌ WebSocket error: $error');
          _scheduleReconnect();
        },
        onDone: () {
          _logger.w('⚠️ WebSocket closed');
          _scheduleReconnect();
        },
      );
      
      // Send initial ping
      send({'type': 'ping'});
      
    } catch (e) {
      _logger.e('Failed to connect WebSocket: $e');
      _scheduleReconnect();
    }
  }
  
  void send(Map<String, dynamic> message) {
    if (_channel != null) {
      final json = jsonEncode(message);
      _logger.i('📤 WS Send: $json');
      _channel!.sink.add(json);
    }
  }
  
  void _scheduleReconnect() {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 5), () {
      _logger.i('🔄 Attempting to reconnect...');
      connect();
    });
  }
  
  void disconnect() {
    _reconnectTimer?.cancel();
    _pingTimer?.cancel();
    _channel?.sink.close();
    _channel = null;
    _logger.i('👋 WebSocket disconnected');
  }
  
  void dispose() {
    disconnect();
    _messageController.close();
  }
}
