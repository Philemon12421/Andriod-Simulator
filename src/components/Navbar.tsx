import React from 'react';
import {
  Bell,
  Cpu,
  Download,
  Moon,
  Plus,
  Search,
  Shield,
  Smartphone,
  Sun,
  Zap,
} from 'lucide-react';
import { HostVirtualizationEngine, PerformanceMode, SystemNotification } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCommandPalette: () => void;
  onOpenNewDeviceModal: () => void;
  onOpenInstallApkModal: () => void;
  performanceMode: PerformanceMode;
  onChangePerformanceMode: (mode: PerformanceMode) => void;
  virtualizationEngine: HostVirtualizationEngine;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  notifications: SystemNotification[];
  onOpenNotifications: () => void;
  runningDevicesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCommandPalette,
  onOpenNewDeviceModal,
  onOpenInstallApkModal,
  performanceMode,
  onChangePerformanceMode,
  virtualizationEngine,
  theme,
  onToggleTheme,
  notifications,
  onOpenNotifications,
  runningDevicesCount,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Branding & Quick Status */}
      <div className="flex items-center space-x-3">
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current stroke-none" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                NanoDroid
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40 dark:border-emerald-800/50">
                v1.5
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 -mt-0.5 hidden sm:block">
              Lightweight Android Runtime
            </p>
          </div>
        </div>

        {/* Engine Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300">
          <Cpu className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium text-[11px]">{virtualizationEngine} Active</span>
        </div>
      </div>

      {/* Center: Command Palette Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-all shadow-inner group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors" />
            <span className="truncate">Search devices, APKs, ADB, settings...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions & Controls */}
      <div className="flex items-center space-x-2">
        {/* Quick Action: New Device */}
        <button
          onClick={onOpenNewDeviceModal}
          className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Device</span>
        </button>

        {/* Quick Action: Install APK */}
        <button
          onClick={onOpenInstallApkModal}
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-medium transition-colors border border-zinc-200/80 dark:border-zinc-700/60"
          title="Install APK"
        >
          <Download className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden md:inline">Install APK</span>
        </button>

        {/* Active Instances Shortcut */}
        <button
          onClick={() => onSelectTab('running')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors border ${
            runningDevicesCount > 0
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
              : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 border-zinc-200 dark:border-zinc-700'
          }`}
          title="Running Devices"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{runningDevicesCount} Running</span>
        </button>

        {/* Performance Mode Selector */}
        <div className="relative hidden xl:block">
          <select
            value={performanceMode}
            onChange={(e) => onChangePerformanceMode(e.target.value as PerformanceMode)}
            className="appearance-none bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-200 text-xs rounded-md pl-2.5 pr-6 py-1.5 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ultra_lite">⚡ Ultra Lite (380MB RAM)</option>
            <option value="balanced">⚖️ Balanced</option>
            <option value="performance">🔥 High Performance</option>
            <option value="developer">🛠️ Dev Mode (Verbose)</option>
            <option value="battery_saver">🔋 Battery Saver</option>
          </select>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 relative transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
        </button>
      </div>
    </header>
  );
};
