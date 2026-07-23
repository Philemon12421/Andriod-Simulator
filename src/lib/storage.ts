import {
  DEFAULT_DEVICE_PROFILES,
  DEFAULT_SENSOR_STATE,
  DEFAULT_SYSTEM_SETTINGS,
  INITIAL_APKS,
  INITIAL_DEVICES,
  INITIAL_GUEST_FILES,
  INITIAL_PLUGINS,
  INITIAL_SNAPSHOTS,
} from '../data/mockInitialData';
import {
  AdbLog,
  AndroidDevice,
  ApkPackage,
  DeviceProfile,
  GuestFile,
  PluginItem,
  SensorState,
  Snapshot,
  SystemNotification,
  SystemSettings,
} from '../types';

const STORAGE_KEYS = {
  DEVICES: 'nanodroid_devices',
  PROFILES: 'nanodroid_profiles',
  APKS: 'nanodroid_apks',
  SNAPSHOTS: 'nanodroid_snapshots',
  FILES: 'nanodroid_files',
  SETTINGS: 'nanodroid_settings',
  SENSORS: 'nanodroid_sensors',
  PLUGINS: 'nanodroid_plugins',
  NOTIFICATIONS: 'nanodroid_notifications',
  LOGS: 'nanodroid_adb_logs',
};

export class NanoStorage {
  private static get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Storage load failed for ${key}, using fallback:`, e);
      return fallback;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Storage save failed for ${key}:`, e);
    }
  }

  // Devices
  static getDevices(): AndroidDevice[] {
    return this.get<AndroidDevice[]>(STORAGE_KEYS.DEVICES, INITIAL_DEVICES);
  }

  static saveDevices(devices: AndroidDevice[]): void {
    this.set(STORAGE_KEYS.DEVICES, devices);
  }

  // Profiles
  static getProfiles(): DeviceProfile[] {
    return this.get<DeviceProfile[]>(STORAGE_KEYS.PROFILES, DEFAULT_DEVICE_PROFILES);
  }

  static saveProfiles(profiles: DeviceProfile[]): void {
    this.set(STORAGE_KEYS.PROFILES, profiles);
  }

  // APKs
  static getApks(): ApkPackage[] {
    return this.get<ApkPackage[]>(STORAGE_KEYS.APKS, INITIAL_APKS);
  }

  static saveApks(apks: ApkPackage[]): void {
    this.set(STORAGE_KEYS.APKS, apks);
  }

  // Snapshots
  static getSnapshots(): Snapshot[] {
    return this.get<Snapshot[]>(STORAGE_KEYS.SNAPSHOTS, INITIAL_SNAPSHOTS);
  }

  static saveSnapshots(snapshots: Snapshot[]): void {
    this.set(STORAGE_KEYS.SNAPSHOTS, snapshots);
  }

  // Files
  static getFiles(): GuestFile[] {
    return this.get<GuestFile[]>(STORAGE_KEYS.FILES, INITIAL_GUEST_FILES);
  }

  static saveFiles(files: GuestFile[]): void {
    this.set(STORAGE_KEYS.FILES, files);
  }

  // Settings
  static getSettings(): SystemSettings {
    return this.get<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SYSTEM_SETTINGS);
  }

  static saveSettings(settings: SystemSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Sensors
  static getSensors(): SensorState {
    return this.get<SensorState>(STORAGE_KEYS.SENSORS, DEFAULT_SENSOR_STATE);
  }

  static saveSensors(sensors: SensorState): void {
    this.set(STORAGE_KEYS.SENSORS, sensors);
  }

  // Plugins
  static getPlugins(): PluginItem[] {
    return this.get<PluginItem[]>(STORAGE_KEYS.PLUGINS, INITIAL_PLUGINS);
  }

  static savePlugins(plugins: PluginItem[]): void {
    this.set(STORAGE_KEYS.PLUGINS, plugins);
  }

  // Notifications
  static getNotifications(): SystemNotification[] {
    return this.get<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        title: 'Virtualization Acceleration Active',
        message: 'KVM hypervisor engine enabled with zero CPU overhead.',
        time: 'Just now',
        type: 'success',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Ultra Lite Mode Engaged',
        message: 'Idle memory footprint limited to 380MB RAM.',
        time: '5m ago',
        type: 'info',
        read: false,
      },
    ]);
  }

  static saveNotifications(notifications: SystemNotification[]): void {
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // ADB Logs
  static getAdbLogs(): AdbLog[] {
    const defaultLogs: AdbLog[] = [
      { id: 'l1', timestamp: '09:15:02.102', level: 'I', tag: 'ActivityManager', pid: 1420, tid: 1420, message: 'Start proc 3810:com.nanodroid.notes/u0a102 for activity' },
      { id: 'l2', timestamp: '09:15:02.340', level: 'D', tag: 'NanoRuntime', pid: 1420, tid: 1422, message: 'GPU Acceleration: EGL Context created using Host OpenGL 4.6' },
      { id: 'l3', timestamp: '09:15:02.510', level: 'I', tag: 'SystemUI', pid: 1840, tid: 1840, message: 'StatusBar state updated: Signal=WiFi 5GHz, Battery=88%' },
      { id: 'l4', timestamp: '09:15:03.011', level: 'W', tag: 'InputMethodManager', pid: 2100, tid: 2105, message: 'Soft keyboard animation frame dropped by 2ms (Ultra Lite limit)' },
      { id: 'l5', timestamp: '09:15:04.119', level: 'D', tag: 'AdbDaemon', pid: 500, tid: 500, message: 'Client connection accepted on localhost:5555' },
    ];
    return this.get<AdbLog[]>(STORAGE_KEYS.LOGS, defaultLogs);
  }

  static saveAdbLogs(logs: AdbLog[]): void {
    this.set(STORAGE_KEYS.LOGS, logs);
  }

  // Reset to Defaults
  static resetAll(): void {
    localStorage.clear();
  }
}
