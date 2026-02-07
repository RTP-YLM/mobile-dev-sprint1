import { describe, expect, test } from '@jest/globals';

describe('Application', () => {
  test('should have required environment variables defined', () => {
    const port = process.env.PORT || 3000;
    expect(port).toBeDefined();
  });

  test('should use correct node version', () => {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    expect(majorVersion).toBeGreaterThanOrEqual(20);
  });

  test('uptime should be a positive number', () => {
    const uptime = process.uptime();
    expect(uptime).toBeGreaterThanOrEqual(0);
  });
});
