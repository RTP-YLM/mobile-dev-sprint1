import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../services/api_service.dart';

// Events
abstract class RelayEvent extends Equatable {
  const RelayEvent();
  
  @override
  List<Object?> get props => [];
}

class ToggleRelay extends RelayEvent {
  final bool state;
  
  const ToggleRelay(this.state);
  
  @override
  List<Object?> get props => [state];
}

// States
abstract class RelayState extends Equatable {
  const RelayState();
  
  @override
  List<Object?> get props => [];
}

class RelayInitial extends RelayState {}

class RelayLoading extends RelayState {}

class RelayOn extends RelayState {}

class RelayOff extends RelayState {}

class RelayError extends RelayState {
  final String message;
  
  const RelayError(this.message);
  
  @override
  List<Object?> get props => [message];
}

// Bloc
class RelayBloc extends Bloc<RelayEvent, RelayState> {
  final ApiService _apiService;
  
  RelayBloc({required ApiService apiService})
    : _apiService = apiService,
      super(RelayInitial()) {
    on<ToggleRelay>(_onToggleRelay);
  }
  
  Future<void> _onToggleRelay(
    ToggleRelay event,
    Emitter<RelayState> emit,
  ) async {
    emit(RelayLoading());
    
    try {
      final result = await _apiService.setRelayState(event.state);
      emit(result ? RelayOn() : RelayOff());
    } catch (e) {
      emit(RelayError(e.toString()));
      // Revert to previous state after error
      await Future.delayed(const Duration(seconds: 2));
      emit(event.state ? RelayOff() : RelayOn());
    }
  }
}
