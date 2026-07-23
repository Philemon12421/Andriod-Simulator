import React from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle,
  Cpu,
  Download,
  FolderArchive,
  Gauge,
  HardDrive,
  Layers,
  PackageCheck,
  Play,
  Plus,
  Radio,
  Shield,
  Smartphone,
  Terminal,
  Video,
  Zap,
} from 'lucide-react';
import {
  AndroidDevice,
  ApkPackage,
  HostVirtualizationEngine,
  PerformanceMode,
  Snapshot,
} from '../types';

interface DashboardProps {
  devices: AndroidDevice[];
  apks: ApkPackage[];
  snapshots: Snapshot[];
  onSelectTab: (tab: string) => void;
  onStartDevice: (id: string) => void;
  onPauseDevice: (id: string) => void;
  onOpenNewDeviceModal: () => void;
  onOpenInstallApkModal: () => void;
  performanceMode: PerformanceMode;
  virtualizationEngine: HostVirtualizationEngine;
}

export const Dashboard: React.FC<DashboardProps> = ({
  devices,
  apks,
  snapshots,
  onSelectTab,
  onStartDevice,
  onPauseDevice,
  onOpenNewDeviceModal,
  onOpenInstallApkModal,
  performanceMode,
  virtualizationEngine,
}) => {
  const runningDevices = devices.filter((d) => d.status === 'running');
  const totalRamUsed = runningDevices.reduce((acc, d) => acc + d.ramUsageMb, 0) || 380;
  const avgCpu = runningDevices.length
    ? (runningDevices.reduce((acc, d) => acc + d.cpuUsagePct, 0) / runningDevices.length).toFixed(1)
    : '0.8';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-6 sm:p-8 border border-zinc-800 shadow-xl">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Ultra-Lightweight Android Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome to NanoDroid
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The high-performance, low-RAM Android runtime built for developers, QA testers, and low-end hardware. Zero clutter, instant boot times, and complete offline capability.
            </p>

            {/* Hardware detection pill */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-300 font-mono">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-800/80 border border-zinc-700/60">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Host Engine: {virtualizationEngine}</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-800/80 border border-zinc-700/60">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>AOSP Sandbox: Isolated</span>
              </div>
            </div>
          </div>

          {/* Primary Quick Start CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenNewDeviceModal}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Android Device</span>
            </button>
            <button
              onClick={() => onSelectTab('running')}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-all active:scale-95"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Launch Emulator Screen ({runningDevices.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* RAM & Lightness Comparison Widget (Proof of Value) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-emerald-500" />
                <span>RAM Benchmark Comparison</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                NanoDroid vs Traditional Android Studio Emulator
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              85% Less RAM
            </span>
          </div>

          {/* Comparison Progress Bars */}
          <div className="space-y-4 my-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>NanoDroid (Ultra Lite Active Instance)</span>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalRamUsed} MB</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalRamUsed / 4000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono text-zinc-400">
                <span>Android Studio Emulator (Default QEMU)</span>
                <span>~3,850 MB</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5">
                <div className="bg-zinc-400 dark:bg-zinc-600 h-full rounded-full w-[85%]" />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
            <span>Dynamic memory allocation active</span>
            <button
              onClick={() => onSelectTab('performance')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium inline-flex items-center space-x-1"
            >
              <span>Performance Settings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Quick Resource Stats Grid */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500">Active Devices</span>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {runningDevices.length} / {devices.length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500">Host CPU Load</span>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {avgCpu}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500">APKs Installed</span>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {apks.length} Packages
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={onOpenNewDeviceModal}
          className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-zinc-800/80 transition-all flex items-center space-x-3 group text-left"
        >
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Create Device</div>
            <div className="text-[10px] text-zinc-500">Android 10-15</div>
          </div>
        </button>

        <button
          onClick={onOpenInstallApkModal}
          className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-zinc-800/80 transition-all flex items-center space-x-3 group text-left"
        >
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Import APK</div>
            <div className="text-[10px] text-zinc-500">Drag & Drop</div>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('running')}
          className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-zinc-800/80 transition-all flex items-center space-x-3 group text-left"
        >
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Launch Screen</div>
            <div className="text-[10px] text-zinc-500">Multi-Window</div>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('adb')}
          className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-zinc-800/80 transition-all flex items-center space-x-3 group text-left"
        >
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Open ADB</div>
            <div className="text-[10px] text-zinc-500">Wireless & USB</div>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('running')}
          className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-zinc-800/80 transition-all flex items-center space-x-3 group text-left col-span-2 sm:col-span-1"
        >
          <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Record Screen</div>
            <div className="text-[10px] text-zinc-500">MP4 / GIF</div>
          </div>
        </button>
      </div>

      {/* Devices Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Recently Configured Devices
            </h2>
            <p className="text-xs text-zinc-500">
              Manage, boot, or configure your local Android instances
            </p>
          </div>
          <button
            onClick={() => onSelectTab('devices')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>View All Devices ({devices.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => {
            const isRunning = device.status === 'running';

            return (
              <div
                key={device.id}
                className={`p-5 rounded-xl bg-white dark:bg-zinc-900 border transition-all ${
                  isRunning
                    ? 'border-emerald-500/50 dark:border-emerald-500/40 shadow-md shadow-emerald-500/5'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isRunning
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        {device.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-mono">
                        <span>Android {device.androidVersion}</span>
                        <span>•</span>
                        <span>{device.ramMb}MB RAM</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      isRunning
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {device.status}
                  </span>
                </div>

                {/* Specs Pill List */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                  <div>Res: {device.resolution}</div>
                  <div>DPI: {device.dpi}</div>
                  <div>Storage: {device.usedStorageGb}/{device.storageGb}GB</div>
                  <div>GPU: {device.gpuMode}</div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center space-x-2">
                  {isRunning ? (
                    <button
                      onClick={() => onPauseDevice(device.id)}
                      className="flex-1 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/50 dark:border-amber-800/50 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                    >
                      Pause Instance
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onStartDevice(device.id);
                        onSelectTab('running');
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Boot Emulator</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectTab('snapshots')}
                    className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    title="View Snapshots"
                  >
                    <FolderArchive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
