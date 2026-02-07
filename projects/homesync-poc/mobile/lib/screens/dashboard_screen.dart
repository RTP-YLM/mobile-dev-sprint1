import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/readings_bloc.dart';
import '../blocs/readings_event_state.dart';
import '../blocs/relay_bloc.dart';
import '../widgets/power_card.dart';
import '../widgets/relay_control.dart';
import '../widgets/status_bar.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🏠 HomeSync POC'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<ReadingsBloc>().add(const StartReadingStream());
            },
          ),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            context.read<ReadingsBloc>().add(const StartReadingStream());
            await Future.delayed(const Duration(seconds: 1));
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Status Bar
                const StatusBar(),
                const SizedBox(height: 20),
                
                // Power Card
                BlocBuilder<ReadingsBloc, ReadingsState>(
                  builder: (context, state) {
                    return PowerCard(
                      power: state is ReadingsLoaded ? state.power : null,
                      voltage: state is ReadingsLoaded ? state.voltage : null,
                      current: state is ReadingsLoaded ? state.current : null,
                      isLoading: state is ReadingsLoading || state is ReadingsInitial,
                    );
                  },
                ),
                const SizedBox(height: 20),
                
                // Relay Control
                BlocBuilder<ReadingsBloc, ReadingsState>(
                  builder: (context, readingsState) {
                    final relayState = readingsState is ReadingsLoaded 
                      ? readingsState.relayState 
                      : false;
                    
                    return BlocBuilder<RelayBloc, RelayState>(
                      builder: (context, relayStateFromBloc) {
                        final isOn = relayStateFromBloc is RelayOn || 
                                     (relayStateFromBloc is! RelayOff && relayState);
                        final isLoading = relayStateFromBloc is RelayLoading;
                        
                        return RelayControl(
                          isOn: isOn,
                          isLoading: isLoading,
                          onToggle: (value) {
                            context.read<RelayBloc>().add(ToggleRelay(value));
                          },
                        );
                      },
                    );
                  },
                ),
                const SizedBox(height: 20),
                
                // Last Update Info
                BlocBuilder<ReadingsBloc, ReadingsState>(
                  builder: (context, state) {
                    if (state is ReadingsLoaded && state.lastUpdate != null) {
                      return Text(
                        'อัพเดทล่าสุด: ${_formatTime(state.lastUpdate!)}',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.grey,
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final diff = now.difference(time);
    
    if (diff.inSeconds < 60) {
      return '${diff.inSeconds} วินาทีที่แล้ว';
    } else if (diff.inMinutes < 60) {
      return '${diff.inMinutes} นาทีที่แล้ว';
    } else {
      return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
    }
  }
}
