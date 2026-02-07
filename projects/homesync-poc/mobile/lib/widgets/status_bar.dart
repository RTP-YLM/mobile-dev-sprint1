import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/readings_bloc.dart';
import '../blocs/readings_event_state.dart';

class StatusBar extends StatelessWidget {
  const StatusBar({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ReadingsBloc, ReadingsState>(
      builder: (context, state) {
        String status;
        Color statusColor;
        IconData icon;
        
        switch (state) {
          case ReadingsInitial():
            status = 'เริ่มต้น...';
            statusColor = Colors.orange;
            icon = Icons.hourglass_empty;
          case ReadingsLoading():
            status = 'กำลังโหลด...';
            statusColor = Colors.blue;
            icon = Icons.sync;
          case ReadingsLoaded():
            status = 'เชื่อมต่อแล้ว';
            statusColor = Colors.green;
            icon = Icons.check_circle;
          case ReadingsLoadError():
            status = 'ข้อผิดพลาด';
            statusColor = Colors.red;
            icon = Icons.error;
        }
        
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: statusColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: statusColor.withOpacity(0.3),
            ),
          ),
          child: Row(
            children: [
              Icon(icon, color: statusColor, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'สถานะ',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[600],
                      ),
                    ),
                    Text(
                      status,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: statusColor,
                      ),
                    ),
                  ],
                ),
              ),
              if (state is ReadingsLoaded) ...[
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: statusColor,
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
