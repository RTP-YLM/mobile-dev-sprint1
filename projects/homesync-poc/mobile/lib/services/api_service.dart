import 'package:dio/dio.dart';
import 'package:logger/logger.dart';

class ApiService {
  late final Dio _dio;
  final Logger _logger = Logger();
  
  // ⚠️ แก้ไข IP นี้ให้ตรงกับ Backend Server
  // ถ้ารันบน emulator: use 10.0.2.2 (Android) หรือ localhost (iOS)
  // ถ้ารันบน device จริง: use IP ของเครื่องที่รัน backend
  static const String baseUrl = 'http://192.168.1.100:3000';
  
  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 5),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
    
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        _logger.i('🚀 REQUEST: ${options.method} ${options.path}');
        return handler.next(options);
      },
      onResponse: (response, handler) {
        _logger.i('✅ RESPONSE: ${response.statusCode} ${response.data}');
        return handler.next(response);
      },
      onError: (error, handler) {
        _logger.e('❌ ERROR: ${error.message}');
        return handler.next(error);
      },
    ));
  }
  
  /// ดึงค่าอ่านล่าสุดจาก backend
  Future<Map<String, dynamic>> getReadings() async {
    try {
      final response = await _dio.get('/api/poc/readings');
      
      if (response.data['success'] == true) {
        return response.data['data'];
      } else {
        throw Exception(response.data['error'] ?? 'Unknown error');
      }
    } catch (e) {
      _logger.e('Failed to get readings: $e');
      rethrow;
    }
  }
  
  /// สั่ง ON/OFF relay
  Future<bool> setRelayState(bool state) async {
    try {
      final response = await _dio.post(
        '/api/poc/relay',
        data: {'state': state},
      );
      
      if (response.data['success'] == true) {
        return response.data['state'];
      } else {
        throw Exception(response.data['error'] ?? 'Unknown error');
      }
    } catch (e) {
      _logger.e('Failed to set relay state: $e');
      rethrow;
    }
  }
  
  /// Health check
  Future<bool> checkHealth() async {
    try {
      final response = await _dio.get('/health');
      return response.data['status'] == 'healthy';
    } catch (e) {
      return false;
    }
  }
}
