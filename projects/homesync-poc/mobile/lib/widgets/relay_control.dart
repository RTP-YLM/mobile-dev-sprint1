import 'package:flutter/material.dart';
import 'package:flutter_switch/flutter_switch.dart';

class RelayControl extends StatelessWidget {
  final bool isOn;
  final bool isLoading;
  final ValueChanged<bool> onToggle;

  const RelayControl({
    super.key,
    required this.isOn,
    required this.isLoading,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.power_settings_new,
                  color: isOn ? Colors.green : Colors.grey,
                  size: 28,
                ),
                const SizedBox(width: 12),
                Text(
                  '🔌 ควบคุม Relay',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isOn ? 'เปิดอยู่' : 'ปิดอยู่',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: isOn ? Colors.green : Colors.grey,
                      ),
                    ),
                    Text(
                      'กดเพื่อ ${isOn ? 'ปิด' : 'เปิด'}',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
                
                // Toggle Switch
                FlutterSwitch(
                  value: isOn,
                  onToggle: isLoading ? (_) {} : onToggle,
                  width: 80,
                  height: 40,
                  toggleSize: 32,
                  activeColor: Colors.green,
                  inactiveColor: Colors.grey[300]!,
                  activeToggleColor: Colors.white,
                  inactiveToggleColor: Colors.white,
                  activeIcon: const Icon(
                    Icons.power,
                    color: Colors.green,
                  ),
                  inactiveIcon: const Icon(
                    Icons.power_off,
                    color: Colors.grey,
                  ),
                  showOnOff: true,
                  activeText: 'ON',
                  inactiveText: 'OFF',
                  activeTextColor: Colors.white,
                  inactiveTextColor: Colors.grey[600]!,
                ),
              ],
            ),
            
            if (isLoading) ...[
              const SizedBox(height: 12),
              LinearProgressIndicator(
                backgroundColor: Colors.grey[200],
                valueColor: AlwaysStoppedAnimation<Color>(
                  isOn ? Colors.green : Colors.grey,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
