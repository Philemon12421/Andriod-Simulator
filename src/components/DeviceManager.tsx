import React, { useState } from 'react';
import {
  Copy,
  Cpu,
  Download,
  FolderArchive,
  HardDrive,
  Layers,
  MoreVertical,
  Play,
  Plus,
  Power,
  RotateCw,
  Search,
  ShieldCheck,
  ShieldOff,
  Smartphone,
  Tablet,
  Trash2,
  Tv,
  Watch,
  X,
  Zap,
} from 'lucide-react';
import { DEFAULT_DEVICE_PROFILES } from '../data/mockInitialData';
import {
  AndroidDevice,
  AndroidVersion,
  DeviceFormFactor,
  DeviceProfile,
  GpuMode,
} from '../types';

interface DeviceManagerProps {
  devices: AndroidDevice[];
  profiles: DeviceProfile[];
  onStartDevice: (id: string) => void;
  onPauseDevice: (id: string) => void;
  onStopDevice: (id: string) => void;
  onDeleteDevice: (id: string) => void;
  onCreateDevice: (newDev: Partial<AndroidDevice>) => void;
  onCloneDevice: (id: string) => void;
  onWipeData: (id: string) => void;
  onSelectTab: (tab: string) => void;
  isOpenCreateModal: boolean;
  onCloseCreateModal: () => void;
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({
  devices,
  profiles,
  onStartDevice,
  onPauseDevice,
  onStopDevice,
  onDeleteDevice,
  onCreateDevice,
  onCloneDevice,
  onWipeData,
  onSelectTab,
  isOpenCreateModal,
  onCloseCreateModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterVersion, setFilterVersion] = useState<string>('all');
  const [filterFormFactor, setFilterFormFactor] = useState<string>('all');

  // Wizard State
  const [selectedProfile, setSelectedProfile] = useState<DeviceProfile>(DEFAULT_DEVICE_PROFILES[0]);
  const [customName, setCustomName] = useState(DEFAULT_DEVICE_PROFILES[0].name + ' Instance');
  const [androidVer, setAndroidVer] = useState<AndroidVersion>('14');
  const [ramMb, setRamMb] = useState<number>(1024);
  const [storageGb, setStorageGb] = useState<number>(32);
  const [cpuCores, setCpuCores] = useState<number>(2);
  const [gpuMode, setGpuMode] = useState<GpuMode>('host');
  const [isRooted, setIsRooted] = useState<boolean>(true);
  const [hasPlayServices, setHasPlayServices] = useState<boolean>(true);

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.profileId.toLowerCase().includes(search.toLowerCase());
    const matchesVersion = filterVersion === 'all' || d.androidVersion === filterVersion;
    const matchesFactor = filterFormFactor === 'all' || d.formFactor === filterFormFactor;
    return matchesSearch && matchesVersion && matchesFactor;
  });

  const handleSelectProfile = (p: DeviceProfile) => {
    setSelectedProfile(p);
    setCustomName(`${p.name} Dev Instance`);
    setAndroidVer(p.defaultAndroidVersion);
    setRamMb(p.ramMb);
    setStorageGb(p.storageGb);
    setCpuCores(p.cpuCores);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateDevice({
      name: customName || selectedProfile.name,
      profileId: selectedProfile.id,
      androidVersion: androidVer,
      formFactor: selectedProfile.formFactor,
      ramMb,
      storageGb,
      cpuCores,
      resolution: selectedProfile.screenResolution,
      dpi: selectedProfile.dpi,
      width: selectedProfile.width,
      height: selectedProfile.height,
      gpuMode,
      isRooted,
      hasPlayServices,
      usedStorageGb: 1.8,
      status: 'stopped',
      batteryLevel: 100,
      isCharging: false,
      wifiConnected: true,
      installedAppIds: [],
    });
    onCloseCreateModal();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-emerald-500" />
            <span>Android Device Manager</span>
          </h1>
          <p className="text-xs text-zinc-500">
            Create, configure, and manage lightweight AOSP runtime instances
          </p>
        </div>

        <button
          onClick={() => {
            handleSelectProfile(DEFAULT_DEVICE_PROFILES[0]);
            // Open modal logic handled by parent or prop
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Virtual Device</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search devices by name, version, specs..."
            className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Version Filter */}
          <select
            value={filterVersion}
            onChange={(e) => setFilterVersion(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Android Versions</option>
            <option value="15">Android 15 (Vanilla)</option>
            <option value="14">Android 14 (AOSP)</option>
            <option value="13">Android 13</option>
            <option value="12">Android 12</option>
            <option value="11">Android 11 (Lite)</option>
            <option value="10">Android 10</option>
          </select>

          {/* Form Factor Filter */}
          <select
            value={filterFormFactor}
            onChange={(e) => setFilterFormFactor(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Form Factors</option>
            <option value="phone">Phones</option>
            <option value="tablet">Tablets</option>
            <option value="foldable">Foldables</option>
            <option value="tv">Android TV</option>
            <option value="wear">Wear OS</option>
          </select>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDevices.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-2">
            <Smartphone className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
              No Devices Match Filter
            </h3>
            <p className="text-xs text-zinc-500">
              Try adjusting your search query or create a new Android device profile.
            </p>
          </div>
        ) : (
          filteredDevices.map((dev) => {
            const isRunning = dev.status === 'running';

            return (
              <div
                key={dev.id}
                className={`p-5 rounded-xl bg-white dark:bg-zinc-900 border transition-all flex flex-col justify-between space-y-4 ${
                  isRunning
                    ? 'border-emerald-500/60 dark:border-emerald-500/50 shadow-md shadow-emerald-500/5'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isRunning
                            ? 'bg-emerald-500 text-zinc-950'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                        }`}
                      >
                        {dev.formFactor === 'tablet' && <Tablet className="w-5 h-5" />}
                        {dev.formFactor === 'tv' && <Tv className="w-5 h-5" />}
                        {dev.formFactor === 'wear' && <Watch className="w-5 h-5" />}
                        {dev.formFactor === 'foldable' && <Layers className="w-5 h-5" />}
                        {dev.formFactor === 'phone' && <Smartphone className="w-5 h-5" />}
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                          {dev.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-500">
                          <span>Android {dev.androidVersion}</span>
                          <span>•</span>
                          <span className="capitalize">{dev.formFactor}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        isRunning
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {dev.status}
                    </span>
                  </div>

                  {/* Badges & Root Indicator */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      RAM: {dev.ramMb}MB
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      Res: {dev.resolution} ({dev.dpi} DPI)
                    </span>
                    {dev.isRooted && (
                      <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Rooted SU</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 flex-1">
                    {isRunning ? (
                      <>
                        <button
                          onClick={() => onPauseDevice(dev.id)}
                          className="flex-1 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-800/40 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => onStopDevice(dev.id)}
                          className="py-1.5 px-2.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                          title="Power Off"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          onStartDevice(dev.id);
                          onSelectTab('running');
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Boot Device</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onCloneDevice(dev.id)}
                      className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Clone Instance"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onWipeData(dev.id)}
                      className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Wipe User Data"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteDevice(dev.id)}
                      className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors"
                      title="Delete Instance"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>

      {/* CREATE DEVICE MODAL / WIZARD */}
      {isOpenCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Create Android Virtual Instance
                </h3>
              </div>
              <button
                onClick={onCloseCreateModal}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
              {/* Profile Preset Carousel */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  1. Choose Hardware Profile Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {profiles.map((p) => {
                    const isSelected = p.id === selectedProfile.id;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => handleSelectProfile(p)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-zinc-900 dark:text-zinc-100 ring-1 ring-emerald-500'
                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                        }`}
                      >
                        <div className="text-xs font-semibold truncate">{p.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {p.ramMb}MB RAM
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Configuration Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Instance Display Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Android OS Release
                  </label>
                  <select
                    value={androidVer}
                    onChange={(e) => setAndroidVer(e.target.value as AndroidVersion)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="15">Android 15 (Vanilla Vanilla)</option>
                    <option value="14">Android 14 (AOSP Stable)</option>
                    <option value="13">Android 13 (Tiramisu)</option>
                    <option value="12">Android 12 (Snow Cone)</option>
                    <option value="11">Android 11 (Red Velvet Cake - Ultra Lite)</option>
                    <option value="10">Android 10 (Q)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Allocated RAM ({ramMb} MB)
                  </label>
                  <input
                    type="range"
                    min="512"
                    max="4096"
                    step="256"
                    value={ramMb}
                    onChange={(e) => setRamMb(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>512MB (Ultra Lite)</span>
                    <span>2048MB (Balanced)</span>
                    <span>4096MB</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Storage Capacity ({storageGb} GB)
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    step="8"
                    value={storageGb}
                    onChange={(e) => setStorageGb(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    CPU Cores
                  </label>
                  <select
                    value={cpuCores}
                    onChange={(e) => setCpuCores(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value={1}>1 Core (Extreme Economy)</option>
                    <option value={2}>2 Cores (Recommended)</option>
                    <option value={4}>4 Cores (Smooth Performance)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    GPU Renderer Engine
                  </label>
                  <select
                    value={gpuMode}
                    onChange={(e) => setGpuMode(e.target.value as GpuMode)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="host">Host Hardware GPU (Fastest)</option>
                    <option value="swiftshader">SwiftShader (CPU Fallback)</option>
                    <option value="software">Pure Software Render</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRooted}
                    onChange={(e) => setIsRooted(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Enable SU Root Binary</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPlayServices}
                    onChange={(e) => setHasPlayServices(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Google Play Services / MicroG</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  Create & Launch Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
