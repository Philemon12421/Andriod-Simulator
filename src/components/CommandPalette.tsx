import React, { useEffect, useState } from 'react';
import {
  Code,
  Compass,
  Download,
  FileText,
  FolderOpen,
  Gauge,
  HelpCircle,
  PackageCheck,
  Plus,
  Radio,
  Search,
  Settings,
  Smartphone,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import { AndroidDevice, ApkPackage } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  devices: AndroidDevice[];
  apks: ApkPackage[];
  onStartDevice: (id: string) => void;
  onOpenNewDeviceModal: () => void;
  onOpenInstallApkModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  devices,
  apks,
  onStartDevice,
  onOpenNewDeviceModal,
  onOpenInstallApkModal,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'act-new-dev',
      label: 'Create New Android Virtual Device',
      group: 'Actions',
      icon: Plus,
      run: () => {
        onOpenNewDeviceModal();
        onClose();
      },
    },
    {
      id: 'act-inst-apk',
      label: 'Install APK Package File',
      group: 'Actions',
      icon: Download,
      run: () => {
        onOpenInstallApkModal();
        onClose();
      },
    },
    {
      id: 'act-adb-term',
      label: 'Open Interactive ADB Terminal',
      group: 'Navigation',
      icon: Terminal,
      run: () => {
        onSelectTab('adb');
        onClose();
      },
    },
    {
      id: 'act-run-inst',
      label: 'View Live Emulator Screen (Running Devices)',
      group: 'Navigation',
      icon: Radio,
      run: () => {
        onSelectTab('running');
        onClose();
      },
    },
    {
      id: 'act-perf',
      label: 'Performance & Memory Scheduler',
      group: 'Navigation',
      icon: Gauge,
      run: () => {
        onSelectTab('performance');
        onClose();
      },
    },
  ];

  // Map devices
  const deviceCommands = devices.map((dev) => ({
    id: `dev-${dev.id}`,
    label: `Launch Device: ${dev.name} (Android ${dev.androidVersion})`,
    group: 'Devices',
    icon: Smartphone,
    run: () => {
      onStartDevice(dev.id);
      onSelectTab('running');
      onClose();
    },
  }));

  // Map APKs
  const apkCommands = apks.map((apk) => ({
    id: `apk-${apk.id}`,
    label: `Inspect APK: ${apk.name} (${apk.packageName})`,
    group: 'APKs',
    icon: PackageCheck,
    run: () => {
      onSelectTab('apks');
      onClose();
    },
  }));

  const allItems = [...actions, ...deviceCommands, ...apkCommands];

  const filtered = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search devices, APKs..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No matching commands or devices found for "{query}".
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.run}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    {item.group}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-emerald-500 font-mono font-semibold">NanoDroid Raycast Search</span>
        </div>
      </div>
    </div>
  );
};
