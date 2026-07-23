import React from 'react';
import {
  Cpu,
  Download,
  HardDrive,
  Key,
  Moon,
  RotateCcw,
  Settings as SettingsIcon,
  Shield,
  Sun,
  Terminal,
  Trash2,
  Zap,
} from 'lucide-react';
import { HostVirtualizationEngine, SystemSettings } from '../types';

interface SettingsProps {
  settings: SystemSettings;
  onUpdateSettings: (updates: Partial<SystemSettings>) => void;
  onResetAllData: () => void;
  onExportBackup: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onExportBackup,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-emerald-500" />
          <span>System & Preferences</span>
        </h1>
        <p className="text-xs text-zinc-500">
          Configure hypervisor engine, keyboard shortcuts, ADB daemon paths, and offline storage backups
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance & Hypervisor */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>Virtualization Hypervisor Backend</span>
          </h3>

          <div className="space-y-2 text-xs">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Host Engine Engine Driver
            </label>
            <select
              value={settings.virtualizationEngine}
              onChange={(e) =>
                onUpdateSettings({
                  virtualizationEngine: e.target.value as HostVirtualizationEngine,
                })
              }
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="KVM">Linux KVM Kernel Driver (Ultra Low Overhead)</option>
              <option value="Hyper-V">Windows Hyper-V Platform Engine</option>
              <option value="Apple Hypervisor">macOS Apple Hypervisor Framework</option>
              <option value="QEMU">QEMU Embedded Emulator Backend</option>
              <option value="AOSP Web Container">AOSP WebAssembly Container</option>
            </select>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                Appearance Theme Mode
              </span>
              <span className="text-[11px] text-zinc-500">
                Currently using {theme === 'dark' ? 'Obsidian Dark' : 'Clean Light'} Mode
              </span>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center space-x-1.5"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>Toggle Mode</span>
            </button>
          </div>
        </div>

        {/* ADB & Storage Backup */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-500" />
            <span>ADB Path & Local Offline Storage</span>
          </h3>

          <div className="space-y-1 text-xs">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Custom ADB Executable Path
            </label>
            <input
              type="text"
              value={settings.customAdbPath}
              onChange={(e) => onUpdateSettings({ customAdbPath: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onExportBackup}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={onResetAllData}
              className="py-2 px-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Factory State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
