import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle,
  Download,
  FileCode,
  FolderOpen,
  Info,
  Package,
  PackageCheck,
  PackagePlus,
  Play,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { AndroidDevice, ApkPackage } from '../types';

interface ApkManagerProps {
  apks: ApkPackage[];
  devices: AndroidDevice[];
  onInstallApkToDevice: (apkId: string, deviceId: string) => void;
  onAddApk: (newApk: Partial<ApkPackage>) => void;
  onDeleteApk: (apkId: string) => void;
  onSelectTab: (tab: string) => void;
  isOpenInstallModal: boolean;
  onCloseInstallModal: () => void;
}

export const ApkManager: React.FC<ApkManagerProps> = ({
  apks,
  devices,
  onInstallApkToDevice,
  onAddApk,
  onDeleteApk,
  onSelectTab,
  isOpenInstallModal,
  onCloseInstallModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedApk, setSelectedApk] = useState<ApkPackage | null>(apks[0] || null);
  const [targetDeviceId, setTargetDeviceId] = useState<string>(
    devices.find((d) => d.status === 'running')?.id || devices[0]?.id || ''
  );

  // Upload simulation states
  const [dragActive, setDragActive] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadPackageName, setUploadPackageName] = useState('com.custom.app');

  const filteredApks = apks.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.packageName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    const newPackage: Partial<ApkPackage> = {
      name: uploadName,
      packageName: uploadPackageName || `com.example.${uploadName.toLowerCase().replace(/[^a-z]/g, '')}`,
      versionName: '1.0.0',
      versionCode: 1,
      sizeMb: 12.4,
      minSdk: 23,
      targetSdk: 34,
      architecture: 'arm64-v8a',
      permissions: ['android.permission.INTERNET', 'android.permission.ACCESS_NETWORK_STATE'],
      securityRisk: 'Low',
      certificateSha256: '88:AA:BB:CC:DD:EE:11:22:33:44:55:66:77:88:99:00',
      category: 'User Custom APK',
      iconBg: 'bg-emerald-500',
      iconSymbol: 'Package',
      description: 'Custom uploaded Android application package file.',
      installedDeviceIds: [],
    };

    onAddApk(newPackage);
    setUploadName('');
    onCloseInstallModal();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <PackageCheck className="w-5 h-5 text-emerald-500" />
            <span>APK Package Manager</span>
          </h1>
          <p className="text-xs text-zinc-500">
            Analyze manifest permissions, security risk scores, and install APKs to guest devices
          </p>
        </div>

        <button
          onClick={onCloseInstallModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Import APK File</span>
        </button>
      </div>

      {/* Main Split Inspector View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left APK List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packages or APK name..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredApks.map((apk) => {
              const isSelected = selectedApk?.id === apk.id;
              return (
                <div
                  key={apk.id}
                  onClick={() => setSelectedApk(apk)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`p-2.5 rounded-xl ${apk.iconBg} text-white shrink-0`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {apk.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">
                        {apk.packageName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0">
                    {apk.sizeMb}MB
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right APK Inspector & Installer Details */}
        <div className="lg:col-span-2">
          {selectedApk ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xs">
              {/* APK Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className={`p-3.5 rounded-2xl ${selectedApk.iconBg} text-white shadow-md`}>
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedApk.name}
                    </h2>
                    <p className="text-xs font-mono text-zinc-500">
                      {selectedApk.packageName} • v{selectedApk.versionName} ({selectedApk.versionCode})
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onDeleteApk(selectedApk.id)}
                    className="p-2 rounded-xl text-red-500 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition-colors"
                    title="Delete APK"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Install Target Selector */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  <span>Target Device Deployment</span>
                </h4>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select
                    value={targetDeviceId}
                    onChange={(e) => setTargetDeviceId(e.target.value)}
                    className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} (Android {d.androidVersion} • {d.status})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      if (targetDeviceId) {
                        onInstallApkToDevice(selectedApk.id, targetDeviceId);
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Stream Install APK</span>
                  </button>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Min SDK</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    API {selectedApk.minSdk}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Target SDK</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    API {selectedApk.targetSdk}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">ABI Architecture</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {selectedApk.architecture}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Security Rating</span>
                  <span
                    className={`font-bold flex items-center space-x-1 ${
                      selectedApk.securityRisk === 'Low'
                        ? 'text-emerald-500'
                        : selectedApk.securityRisk === 'Medium'
                        ? 'text-amber-500'
                        : 'text-red-500'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{selectedApk.securityRisk} Risk</span>
                  </span>
                </div>
              </div>

              {/* Permissions Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
                  <FileCode className="w-4 h-4 text-purple-500" />
                  <span>Declared Android Manifest Permissions ({selectedApk.permissions.length})</span>
                </h4>

                <div className="flex flex-wrap gap-2">
                  {selectedApk.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-[10px] font-mono text-zinc-700 dark:text-zinc-300"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Signing Certificate */}
              <div className="space-y-1 text-xs">
                <span className="text-zinc-400 text-[10px] block">SHA-256 Signing Fingerprint</span>
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 break-all border border-zinc-200 dark:border-zinc-800">
                  {selectedApk.certificateSha256}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-500">
              Select an APK package on the left to inspect its manifest and permissions.
            </div>
          )}
        </div>
      </div>

      {/* IMPORT APK MODAL */}
      {isOpenInstallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Import APK File
                </h3>
              </div>
              <button
                onClick={onCloseInstallModal}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulatedUpload} className="p-6 space-y-4">
              {/* Drag & Drop Area */}
              <div
                className="p-8 border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/20 text-center space-y-2 cursor-pointer"
                onClick={() => setUploadName('MyAwesomeApp.apk')}
              >
                <Upload className="w-8 h-8 text-emerald-500 mx-auto animate-bounce" />
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Drag & Drop .APK file here or click to browse
                </div>
                <div className="text-[10px] text-zinc-500">
                  Supports ARM64, x86_64, Universal APKs up to 250MB
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  App Name / Title
                </label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Flutter Gallery or My React Native App"
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Package ID
                </label>
                <input
                  type="text"
                  value={uploadPackageName}
                  onChange={(e) => setUploadPackageName(e.target.value)}
                  placeholder="com.mycompany.app"
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onCloseInstallModal}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Parse & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
