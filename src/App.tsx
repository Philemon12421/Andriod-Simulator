/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AdbCenter } from './components/AdbCenter';
import { AnnotationModal } from './components/AnnotationModal';
import { ApkManager } from './components/ApkManager';
import { CommandPalette } from './components/CommandPalette';
import { Dashboard } from './components/Dashboard';
import { DebugTools } from './components/DebugTools';
import { DeviceManager } from './components/DeviceManager';
import { FileManager } from './components/FileManager';
import { HelpDocs } from './components/HelpDocs';
import { Marketplace } from './components/Marketplace';
import { Navbar } from './components/Navbar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Performance } from './components/Performance';
import { Plugins } from './components/Plugins';
import { RunningDevices } from './components/RunningDevices';
import { Sensors } from './components/Sensors';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import { Snapshots } from './components/Snapshots';
import { StatusBar } from './components/StatusBar';
import { NanoStorage } from './lib/storage';
import {
  AdbLog,
  AndroidDevice,
  ApkPackage,
  DeviceProfile,
  GuestFile,
  PerformanceMode,
  PluginItem,
  SensorState,
  Snapshot,
  SystemNotification,
  SystemSettings,
} from './types';

export default function App() {
  // State Initialization from Persistent Local Storage
  const [devices, setDevices] = useState<AndroidDevice[]>(() => NanoStorage.getDevices());
  const [profiles] = useState<DeviceProfile[]>(() => NanoStorage.getProfiles());
  const [apks, setApks] = useState<ApkPackage[]>(() => NanoStorage.getApks());
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => NanoStorage.getSnapshots());
  const [files, setFiles] = useState<GuestFile[]>(() => NanoStorage.getFiles());
  const [settings, setSettings] = useState<SystemSettings>(() => NanoStorage.getSettings());
  const [sensors, setSensors] = useState<SensorState>(() => NanoStorage.getSensors());
  const [plugins, setPlugins] = useState<PluginItem[]>(() => NanoStorage.getPlugins());
  const [notifications, setNotifications] = useState<SystemNotification[]>(() =>
    NanoStorage.getNotifications()
  );
  const [adbLogs, setAdbLogs] = useState<AdbLog[]>(() => NanoStorage.getAdbLogs());

  // Navigation & Modals State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isNewDeviceModalOpen, setIsNewDeviceModalOpen] = useState<boolean>(false);
  const [isInstallApkModalOpen, setIsInstallApkModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [annotationDeviceName, setAnnotationDeviceName] = useState<string | null>(null);

  // Sync dark class on root document
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Persist handlers
  const updateDevices = (newDevs: AndroidDevice[]) => {
    setDevices(newDevs);
    NanoStorage.saveDevices(newDevs);
  };

  const updateApks = (newApks: ApkPackage[]) => {
    setApks(newApks);
    NanoStorage.saveApks(newApks);
  };

  const updateSnapshots = (newSnaps: Snapshot[]) => {
    setSnapshots(newSnaps);
    NanoStorage.saveSnapshots(newSnaps);
  };

  const updateFiles = (newFiles: GuestFile[]) => {
    setFiles(newFiles);
    NanoStorage.saveFiles(newFiles);
  };

  const updateSettings = (updates: Partial<SystemSettings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    NanoStorage.saveSettings(next);
  };

  const updateSensors = (updates: Partial<SensorState>) => {
    const next = { ...sensors, ...updates };
    setSensors(next);
    NanoStorage.saveSensors(next);
  };

  const updatePlugins = (newPlugins: PluginItem[]) => {
    setPlugins(newPlugins);
    NanoStorage.savePlugins(newPlugins);
  };

  // Device Controls
  const handleStartDevice = (id: string) => {
    const running = devices.filter((d) => d.status === 'running');
    if (running.length >= settings.maxActiveDevices) {
      alert(
        `Maximum ${settings.maxActiveDevices} running devices allowed in current performance mode.`
      );
      return;
    }

    const next = devices.map((d) => (d.id === id ? { ...d, status: 'running' as const } : d));
    updateDevices(next);
  };

  const handlePauseDevice = (id: string) => {
    const next = devices.map((d) => (d.id === id ? { ...d, status: 'paused' as const } : d));
    updateDevices(next);
  };

  const handleStopDevice = (id: string) => {
    const next = devices.map((d) => (d.id === id ? { ...d, status: 'stopped' as const } : d));
    updateDevices(next);
  };

  const handleDeleteDevice = (id: string) => {
    if (confirm('Are you sure you want to delete this Android virtual device instance?')) {
      const next = devices.filter((d) => d.id !== id);
      updateDevices(next);
    }
  };

  const handleCreateDevice = (newDev: Partial<AndroidDevice>) => {
    const created: AndroidDevice = {
      id: `dev-${Date.now()}`,
      name: newDev.name || 'New Virtual Device',
      profileId: newDev.profileId || 'profile-pixel8',
      androidVersion: newDev.androidVersion || '14',
      formFactor: newDev.formFactor || 'phone',
      ramMb: newDev.ramMb || 1024,
      storageGb: newDev.storageGb || 32,
      usedStorageGb: 1.8,
      cpuCores: newDev.cpuCores || 2,
      dpi: newDev.dpi || 480,
      resolution: newDev.resolution || '1080 x 2400',
      width: newDev.width || 390,
      height: newDev.height || 844,
      gpuMode: newDev.gpuMode || 'host',
      orientation: 'portrait',
      isRooted: newDev.isRooted ?? true,
      hasPlayServices: newDev.hasPlayServices ?? true,
      status: 'running', // Boot immediately on create
      uptimeSeconds: 0,
      ipAddress: '127.0.0.1',
      adbPort: 5555 + devices.length * 2,
      cpuUsagePct: 8.2,
      ramUsageMb: Math.round((newDev.ramMb || 1024) * 0.4),
      fps: 60,
      installedAppIds: ['apk-flutter-gallery'],
      batteryLevel: 100,
      isCharging: false,
      wifiConnected: true,
    };

    updateDevices([...devices, created]);
    setCurrentTab('running');
  };

  const handleCloneDevice = (id: string) => {
    const original = devices.find((d) => d.id === id);
    if (!original) return;

    const clone: AndroidDevice = {
      ...original,
      id: `dev-clone-${Date.now()}`,
      name: `${original.name} (Clone)`,
      status: 'stopped',
      adbPort: original.adbPort + 20,
    };

    updateDevices([...devices, clone]);
  };

  const handleWipeData = (id: string) => {
    if (confirm('Wipe user data partitions and reset device to factory state?')) {
      const next = devices.map((d) =>
        d.id === id ? { ...d, usedStorageGb: 1.2, installedAppIds: [] } : d
      );
      updateDevices(next);
    }
  };

  const handleUpdateDeviceStatus = (id: string, updates: Partial<AndroidDevice>) => {
    const next = devices.map((d) => (d.id === id ? { ...d, ...updates } : d));
    updateDevices(next);
  };

  // APK Controls
  const handleInstallApkToDevice = (apkId: string, deviceId: string) => {
    const apk = apks.find((a) => a.id === apkId);
    const dev = devices.find((d) => d.id === deviceId);
    if (!apk || !dev) return;

    if (!dev.installedAppIds.includes(apkId)) {
      const updatedDevs = devices.map((d) =>
        d.id === deviceId ? { ...d, installedAppIds: [...d.installedAppIds, apkId] } : d
      );
      updateDevices(updatedDevs);
    }

    if (!apk.installedDeviceIds.includes(deviceId)) {
      const updatedApks = apks.map((a) =>
        a.id === apkId ? { ...a, installedDeviceIds: [...a.installedDeviceIds, deviceId] } : a
      );
      updateApks(updatedApks);
    }

    // Add Notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'APK Installed Successfully',
      message: `${apk.name} (${apk.packageName}) installed to ${dev.name}.`,
      time: 'Just now',
      type: 'success',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddApk = (newApk: Partial<ApkPackage>) => {
    const created: ApkPackage = {
      id: `apk-${Date.now()}`,
      name: newApk.name || 'Custom App',
      packageName: newApk.packageName || 'com.custom.app',
      versionName: newApk.versionName || '1.0.0',
      versionCode: newApk.versionCode || 1,
      sizeMb: newApk.sizeMb || 12.0,
      minSdk: newApk.minSdk || 21,
      targetSdk: newApk.targetSdk || 34,
      architecture: newApk.architecture || 'arm64-v8a',
      permissions: newApk.permissions || ['android.permission.INTERNET'],
      securityRisk: 'Low',
      certificateSha256: '00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF',
      category: 'Custom Import',
      iconBg: 'bg-emerald-500',
      iconSymbol: 'Package',
      description: newApk.description || 'Imported APK package file.',
      installedDeviceIds: [],
    };
    updateApks([...apks, created]);
  };

  const handleDeleteApk = (apkId: string) => {
    const next = apks.filter((a) => a.id !== apkId);
    updateApks(next);
  };

  // Snapshot Controls
  const handleCreateSnapshot = (newSnap: Partial<Snapshot>) => {
    const created: Snapshot = {
      id: `snap-${Date.now()}`,
      deviceId: newSnap.deviceId || devices[0]?.id || '',
      deviceName: newSnap.deviceName || 'Virtual Device',
      name: newSnap.name || 'RAM Snapshot',
      description: newSnap.description || 'Instant memory state snapshot.',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sizeMb: newSnap.sizeMb || 180,
      androidVersion: newSnap.androidVersion || '14',
      ramMbAtSnapshot: newSnap.ramMbAtSnapshot || 1024,
      previewColor: 'from-blue-600 to-indigo-700',
    };
    updateSnapshots([...snapshots, created]);
  };

  const handleRestoreSnapshot = (id: string) => {
    alert('Restored snapshot memory heap into active device state in 0.9s!');
  };

  const handleDeleteSnapshot = (id: string) => {
    const next = snapshots.filter((s) => s.id !== id);
    updateSnapshots(next);
  };

  // Files Controls
  const handleAddFile = (file: Partial<GuestFile>) => {
    const created: GuestFile = {
      id: `f-${Date.now()}`,
      name: file.name || 'new_file.txt',
      path: file.path || '/sdcard/Download/new_file.txt',
      sizeBytes: file.sizeBytes || 1024,
      type: file.type || 'document',
      modifiedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isSystem: false,
    };
    updateFiles([...files, created]);
  };

  const handleDeleteFile = (id: string) => {
    const next = files.filter((f) => f.id !== id);
    updateFiles(next);
  };

  // Plugins Controls
  const handleToggleInstallPlugin = (id: string) => {
    const next = plugins.map((p) => (p.id === id ? { ...p, isInstalled: !p.isInstalled } : p));
    updatePlugins(next);
  };

  // Notifications
  const handleClearNotifications = () => {
    setNotifications([]);
    NanoStorage.saveNotifications([]);
  };

  const handleMarkNotificationRead = (id: string) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(next);
    NanoStorage.saveNotifications(next);
  };

  // System Backup & Reset
  const handleResetAllData = () => {
    if (confirm('WARNING: Reset all NanoDroid devices, APKs, snapshots, and settings to factory defaults?')) {
      NanoStorage.resetAll();
      window.location.reload();
    }
  };

  const handleExportBackup = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            devices,
            apks,
            snapshots,
            files,
            settings,
            sensors,
            plugins,
          },
          null,
          2
        )
      );
    const link = document.createElement('a');
    link.download = `NanoDroid_Backup_${Date.now()}.json`;
    link.href = dataStr;
    link.click();
  };

  const runningDevicesCount = devices.filter((d) => d.status === 'running').length;
  const totalRamUsedMb = devices
    .filter((d) => d.status === 'running')
    .reduce((acc, d) => acc + d.ramUsageMb, 0) || 380;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Titlebar / Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenNewDeviceModal={() => setIsNewDeviceModalOpen(true)}
        onOpenInstallApkModal={() => setIsInstallApkModalOpen(true)}
        performanceMode={settings.performanceMode}
        onChangePerformanceMode={(mode: PerformanceMode) => updateSettings({ performanceMode: mode })}
        virtualizationEngine={settings.virtualizationEngine}
        theme={settings.theme}
        onToggleTheme={() =>
          updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
        }
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        runningDevicesCount={runningDevicesCount}
      />

      {/* Main Workspace Area (Sidebar + Content View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          runningCount={runningDevicesCount}
          devicesCount={devices.length}
          apksCount={apks.length}
        />

        {/* Dynamic View Canvas Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 scrollbar-thin">
          {currentTab === 'dashboard' && (
            <Dashboard
              devices={devices}
              apks={apks}
              snapshots={snapshots}
              onSelectTab={setCurrentTab}
              onStartDevice={handleStartDevice}
              onPauseDevice={handlePauseDevice}
              onOpenNewDeviceModal={() => setIsNewDeviceModalOpen(true)}
              onOpenInstallApkModal={() => setIsInstallApkModalOpen(true)}
              performanceMode={settings.performanceMode}
              virtualizationEngine={settings.virtualizationEngine}
            />
          )}

          {currentTab === 'devices' && (
            <DeviceManager
              devices={devices}
              profiles={profiles}
              onStartDevice={handleStartDevice}
              onPauseDevice={handlePauseDevice}
              onStopDevice={handleStopDevice}
              onDeleteDevice={handleDeleteDevice}
              onCreateDevice={handleCreateDevice}
              onCloneDevice={handleCloneDevice}
              onWipeData={handleWipeData}
              onSelectTab={setCurrentTab}
              isOpenCreateModal={isNewDeviceModalOpen}
              onCloseCreateModal={() => setIsNewDeviceModalOpen(false)}
            />
          )}

          {currentTab === 'running' && (
            <RunningDevices
              devices={devices}
              apks={apks}
              onStartDevice={handleStartDevice}
              onPauseDevice={handlePauseDevice}
              onStopDevice={handleStopDevice}
              onTakeScreenshot={(name) => setAnnotationDeviceName(name)}
              onUpdateDeviceStatus={handleUpdateDeviceStatus}
              onOpenNewDeviceModal={() => setIsNewDeviceModalOpen(true)}
              onSelectTab={setCurrentTab}
            />
          )}

          {currentTab === 'apks' && (
            <ApkManager
              apks={apks}
              devices={devices}
              onInstallApkToDevice={handleInstallApkToDevice}
              onAddApk={handleAddApk}
              onDeleteApk={handleDeleteApk}
              onSelectTab={setCurrentTab}
              isOpenInstallModal={isInstallApkModalOpen}
              onCloseInstallModal={() => setIsInstallApkModalOpen(false)}
            />
          )}

          {currentTab === 'adb' && <AdbCenter devices={devices} apks={apks} />}

          {currentTab === 'snapshots' && (
            <Snapshots
              snapshots={snapshots}
              devices={devices}
              onCreateSnapshot={handleCreateSnapshot}
              onRestoreSnapshot={handleRestoreSnapshot}
              onDeleteSnapshot={handleDeleteSnapshot}
            />
          )}

          {currentTab === 'files' && (
            <FileManager files={files} onAddFile={handleAddFile} onDeleteFile={handleDeleteFile} />
          )}

          {currentTab === 'debug' && (
            <DebugTools logs={adbLogs} onClearLogs={() => setAdbLogs([])} />
          )}

          {currentTab === 'performance' && (
            <Performance settings={settings} onUpdateSettings={updateSettings} />
          )}

          {currentTab === 'sensors' && (
            <Sensors sensors={sensors} onUpdateSensors={updateSensors} />
          )}

          {currentTab === 'plugins' && (
            <Plugins plugins={plugins} onToggleInstallPlugin={handleToggleInstallPlugin} />
          )}

          {currentTab === 'marketplace' && <Marketplace />}

          {currentTab === 'settings' && (
            <Settings
              settings={settings}
              onUpdateSettings={updateSettings}
              onResetAllData={handleResetAllData}
              onExportBackup={handleExportBackup}
              theme={settings.theme}
              onToggleTheme={() =>
                updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
              }
            />
          )}

          {currentTab === 'help' && <HelpDocs />}
        </main>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        runningCount={runningDevicesCount}
        totalRamUsedMb={totalRamUsedMb}
        cpuUsagePct={8.4}
        performanceMode={settings.performanceMode}
        virtualizationEngine={settings.virtualizationEngine}
      />

      {/* Raycast Style Global Command Palette Overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setCurrentTab}
        devices={devices}
        apks={apks}
        onStartDevice={handleStartDevice}
        onOpenNewDeviceModal={() => setIsNewDeviceModalOpen(true)}
        onOpenInstallApkModal={() => setIsInstallApkModalOpen(true)}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearAll={handleClearNotifications}
        onMarkRead={handleMarkNotificationRead}
      />

      {/* Screenshot Cropper & Annotator Modal */}
      <AnnotationModal
        isOpen={!!annotationDeviceName}
        onClose={() => setAnnotationDeviceName(null)}
        deviceName={annotationDeviceName || 'Device'}
      />
    </div>
  );
}
