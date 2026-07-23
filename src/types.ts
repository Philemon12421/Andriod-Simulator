export type AndroidVersion = '10' | '11' | '12' | '13' | '14' | '15';

export type DeviceFormFactor = 'phone' | 'tablet' | 'foldable' | 'tv' | 'wear';

export type GpuMode = 'host' | 'swiftshader' | 'software';

export type PerformanceMode = 'ultra_lite' | 'balanced' | 'performance' | 'developer' | 'battery_saver';

export type HostVirtualizationEngine = 'KVM' | 'Hyper-V' | 'Apple Hypervisor' | 'QEMU' | 'AOSP Web Container';

export interface DeviceProfile {
  id: string;
  name: string;
  brand: string;
  formFactor: DeviceFormFactor;
  screenResolution: string;
  width: number;
  height: number;
  dpi: number;
  ramMb: number;
  storageGb: number;
  cpuCores: number;
  defaultAndroidVersion: AndroidVersion;
  iconName: string;
}

export interface AndroidDevice {
  id: string;
  name: string;
  profileId: string;
  androidVersion: AndroidVersion;
  formFactor: DeviceFormFactor;
  ramMb: number;
  storageGb: number;
  usedStorageGb: number;
  cpuCores: number;
  dpi: number;
  resolution: string;
  width: number;
  height: number;
  gpuMode: GpuMode;
  orientation: 'portrait' | 'landscape';
  isRooted: boolean;
  hasPlayServices: boolean;
  status: 'stopped' | 'booting' | 'running' | 'paused';
  uptimeSeconds: number;
  ipAddress: string;
  adbPort: number;
  cpuUsagePct: number;
  ramUsageMb: number;
  fps: number;
  installedAppIds: string[];
  batteryLevel: number;
  isCharging: boolean;
  wifiConnected: boolean;
  activeAppId?: string;
  lastSnapshotDate?: string;
}

export interface ApkPackage {
  id: string;
  name: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  sizeMb: number;
  minSdk: number;
  targetSdk: number;
  architecture: 'arm64-v8a' | 'x86_64' | 'universal';
  permissions: string[];
  securityRisk: 'Low' | 'Medium' | 'High';
  certificateSha256: string;
  category: string;
  iconBg: string;
  iconSymbol: string;
  description: string;
  installedDeviceIds: string[];
}

export interface AdbLog {
  id: string;
  timestamp: string;
  level: 'V' | 'D' | 'I' | 'W' | 'E';
  tag: string;
  pid: number;
  tid: number;
  message: string;
  deviceId?: string;
}

export interface Snapshot {
  id: string;
  deviceId: string;
  deviceName: string;
  name: string;
  description: string;
  createdAt: string;
  sizeMb: number;
  androidVersion: AndroidVersion;
  ramMbAtSnapshot: number;
  previewColor: string;
}

export interface GuestFile {
  id: string;
  name: string;
  path: string;
  sizeBytes: number;
  type: 'folder' | 'apk' | 'image' | 'video' | 'document' | 'audio' | 'code' | 'other';
  modifiedDate: string;
  isSystem: boolean;
}

export interface SensorState {
  gps: {
    lat: number;
    lng: number;
    altitude: number;
    speed: number;
    locationName: string;
  };
  battery: {
    level: number;
    isCharging: boolean;
    temperatureC: number;
    health: 'Good' | 'Overheat' | 'Dead';
  };
  orientation: {
    pitch: number;
    roll: number;
    yaw: number;
  };
  network: {
    type: '5G' | '4G' | '3G' | '2G' | 'WiFi' | 'Offline';
    latencyMs: number;
  };
  sensorsEnabled: {
    biometrics: boolean;
    accelerometer: boolean;
    lightSensor: boolean;
    nfc: boolean;
    camera: boolean;
    microphone: boolean;
  };
}

export interface PluginItem {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: 'Framework' | 'Profiler' | 'Security' | 'Automation' | 'UI';
  icon: string;
  isInstalled: boolean;
  downloads: number;
  rating: number;
}

export interface SystemSettings {
  theme: 'dark' | 'light' | 'system';
  performanceMode: PerformanceMode;
  maxActiveDevices: number;
  maxFpsCap: number;
  autoSuspendTimeoutMinutes: number;
  virtualizationEngine: HostVirtualizationEngine;
  adbPortRangeStart: number;
  autoSnapshotOnClose: boolean;
  defaultRamMb: number;
  defaultStorageGb: number;
  telemetryEnabled: boolean;
  customAdbPath: string;
  hotkeys: {
    commandPalette: string;
    newDevice: string;
    installApk: string;
    toggleAdb: string;
    screenshot: string;
  };
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}
