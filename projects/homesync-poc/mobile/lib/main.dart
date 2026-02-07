import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'blocs/readings_bloc.dart';
import 'blocs/relay_bloc.dart';
import 'services/api_service.dart';
import 'services/websocket_service.dart';
import 'screens/dashboard_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const HomeSyncApp());
}

class HomeSyncApp extends StatelessWidget {
  const HomeSyncApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider(create: (_) => ApiService()),
        RepositoryProvider(create: (_) => WebSocketService()),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider(
            create: (context) => ReadingsBloc(
              apiService: context.read<ApiService>(),
              wsService: context.read<WebSocketService>(),
            )..add(const StartReadingStream()),
          ),
          BlocProvider(
            create: (context) => RelayBloc(
              apiService: context.read<ApiService>(),
            ),
          ),
        ],
        child: MaterialApp(
          title: 'HomeSync POC',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(
              seedColor: Colors.blue,
              brightness: Brightness.light,
            ),
            useMaterial3: true,
            cardTheme: CardTheme(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
          darkTheme: ThemeData(
            colorScheme: ColorScheme.fromSeed(
              seedColor: Colors.blue,
              brightness: Brightness.dark,
            ),
            useMaterial3: true,
          ),
          home: const DashboardScreen(),
        ),
      ),
    );
  }
}
