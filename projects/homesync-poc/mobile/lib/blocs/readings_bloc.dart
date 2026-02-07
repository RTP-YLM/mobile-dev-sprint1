import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';
import 'readings_event_state.dart';

class ReadingsBloc extends Bloc<ReadingsEvent, ReadingsState> {
  final ApiService _apiService;
  final WebSocketService _wsService;
  Timer? _pollingTimer;
  StreamSubscription? _wsSubscription;
  
  ReadingsBloc({
    required ApiService apiService,
    required WebSocketService wsService,
  }) : _apiService = apiService,
       _wsService = wsService,
       super(ReadingsInitial()) {
    
    on<StartReadingStream>(_onStartReadingStream);
    on<ReadingsUpdated>(_onReadingsUpdated);
    on<ReadingsError>(_onReadingsError);
  }
  
  Future<void> _onStartReadingStream(
    StartReadingStream event,
    Emitter<ReadingsState> emit,
  ) async {
    emit(ReadingsLoading());
    
    // Initial fetch
    try {
      final data = await _apiService.getReadings();
      emit(ReadingsLoaded(
        power: _toDouble(data['power']),
        voltage: _toDouble(data['voltage']),
        current: _toDouble(data['current']),
        relayState: data['relayState'] ?? false,
        lastUpdate: data['lastUpdate'] != null 
          ? DateTime.tryParse(data['lastUpdate'])
          : null,
      ));
    } catch (e) {
      emit(ReadingsLoadError(e.toString()));
    }
    
    // Connect WebSocket for real-time updates
    _wsService.connect();
    _wsSubscription = _wsService.messageStream.listen((message) {
      _handleWebSocketMessage(message);
    });
    
    // Fallback polling every 5 seconds
    _pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) async {
      try {
        final data = await _apiService.getReadings();
        add(ReadingsUpdated(data));
      } catch (e) {
        add(ReadingsError(e.toString()));
      }
    });
  }
  
  void _handleWebSocketMessage(Map<String, dynamic> message) {
    if (message['type'] == 'telemetry') {
      final data = message['data'] as Map<String, dynamic>;
      final currentState = state;
      
      if (currentState is ReadingsLoaded) {
        final updatedState = currentState.copyWith(
          power: data['type'] == 'power' ? _toDouble(data['value']) : currentState.power,
          voltage: data['type'] == 'voltage' ? _toDouble(data['value']) : currentState.voltage,
          current: data['type'] == 'current' ? _toDouble(data['value']) : currentState.current,
          lastUpdate: DateTime.now(),
        );
        add(ReadingsUpdated({
          'power': updatedState.power,
          'voltage': updatedState.voltage,
          'current': updatedState.current,
          'relayState': updatedState.relayState,
          'lastUpdate': DateTime.now().toIso8601String(),
        }));
      }
    } else if (message['type'] == 'relay_state') {
      final currentState = state;
      if (currentState is ReadingsLoaded) {
        add(ReadingsUpdated({
          'power': currentState.power,
          'voltage': currentState.voltage,
          'current': currentState.current,
          'relayState': message['state'] ?? false,
          'lastUpdate': DateTime.now().toIso8601String(),
        }));
      }
    }
  }
  
  void _onReadingsUpdated(ReadingsUpdated event, Emitter<ReadingsState> emit) {
    emit(ReadingsLoaded(
      power: _toDouble(event.readings['power']),
      voltage: _toDouble(event.readings['voltage']),
      current: _toDouble(event.readings['current']),
      relayState: event.readings['relayState'] ?? false,
      lastUpdate: event.readings['lastUpdate'] != null 
        ? DateTime.tryParse(event.readings['lastUpdate'])
        : DateTime.now(),
    ));
  }
  
  void _onReadingsError(ReadingsError event, Emitter<ReadingsState> emit) {
    // Keep previous state but log error
    if (state is! ReadingsLoaded) {
      emit(ReadingsLoadError(event.message));
    }
  }
  
  double? _toDouble(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }
  
  @override
  Future<void> close() {
    _pollingTimer?.cancel();
    _wsSubscription?.cancel();
    _wsService.dispose();
    return super.close();
  }
}
