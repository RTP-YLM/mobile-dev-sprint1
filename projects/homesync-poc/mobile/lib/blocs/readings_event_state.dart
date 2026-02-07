import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Events
abstract class ReadingsEvent extends Equatable {
  const ReadingsEvent();
  
  @override
  List<Object?> get props => [];
}

class StartReadingStream extends ReadingsEvent {
  const StartReadingStream();
}

class ReadingsUpdated extends ReadingsEvent {
  final Map<String, dynamic> readings;
  
  const ReadingsUpdated(this.readings);
  
  @override
  List<Object?> get props => [readings];
}

class ReadingsError extends ReadingsEvent {
  final String message;
  
  const ReadingsError(this.message);
  
  @override
  List<Object?> get props => [message];
}

// States
abstract class ReadingsState extends Equatable {
  const ReadingsState();
  
  @override
  List<Object?> get props => [];
}

class ReadingsInitial extends ReadingsState {}

class ReadingsLoading extends ReadingsState {}

class ReadingsLoaded extends ReadingsState {
  final double? power;
  final double? voltage;
  final double? current;
  final bool relayState;
  final DateTime? lastUpdate;
  
  const ReadingsLoaded({
    this.power,
    this.voltage,
    this.current,
    this.relayState = false,
    this.lastUpdate,
  });
  
  ReadingsLoaded copyWith({
    double? power,
    double? voltage,
    double? current,
    bool? relayState,
    DateTime? lastUpdate,
  }) {
    return ReadingsLoaded(
      power: power ?? this.power,
      voltage: voltage ?? this.voltage,
      current: current ?? this.current,
      relayState: relayState ?? this.relayState,
      lastUpdate: lastUpdate ?? this.lastUpdate,
    );
  }
  
  @override
  List<Object?> get props => [power, voltage, current, relayState, lastUpdate];
}

class ReadingsLoadError extends ReadingsState {
  final String message;
  
  const ReadingsLoadError(this.message);
  
  @override
  List<Object?> get props => [message];
}
