import React from 'react';
import { Activity, Cpu, HardDrive, Terminal, Zap } from 'lucide-react';
import { HostVirtualizationEngine, PerformanceMode } from '../types';

interface StatusBarProps {
  runningCount: number;
  totalRamUsedMb: number;
  cpuUsagePct: number;
  performanceMode: PerformanceMode;
  virtualizationEngine: HostVirtualizationEngine;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  runningCount,
  totalRamUsedMb,
  cpuUsagePct,
  performanceMode,
  virtualizationEngine,
}) => {
  return (
    <footer className="h-7 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 select-none z-20">
      {/* Left System Info */}
      <div className="flex items-center space-x-4">
        {/* Active Engine */}
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{virtualizationEngine}</span>
          <span className="text-zinc-400">Hypervisor</span>
        </div>

        {/* ADB Daemon Status */}
        <div className="hidden sm:flex items-center space-x-1">
          <Terminal className="w-3 h-3 text-emerald-500" />
          <span>ADB Online (127.0.0.1:5555)</span>
        </div>

        {/* Running Devices */}
        <div className="flex items-center space-x-1">
          <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{runningCount}</span>
          <span>instances active</span>
        </div>
      </div>

      {/* Right Resource Counters */}
      <div className="flex items-center space-x-4">
        {/* RAM Usage */}
        <div className="flex items-center space-x-1.5">
          <HardDrive className="w-3 h-3 text-blue-500" />
          <span>RAM:</span>
          <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
            {totalRamUsedMb} MB
          </span>
          <span className="text-zinc-400 text-[10px]">
            ({performanceMode === 'ultra_lite' ? 'Ultra Lite' : performanceMode})
          </span>
        </div>

        {/* CPU % */}
        <div className="hidden md:flex items-center space-x-1.5">
          <Cpu className="w-3 h-3 text-purple-500" />
          <span>CPU:</span>
          <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
            {cpuUsagePct.toFixed(1)}%
          </span>
        </div>

        {/* Quick Shortcut Hint */}
        <div className="hidden lg:flex items-center space-x-1 text-zinc-400">
          <span>Press</span>
          <kbd className="px-1 py-0.2 bg-zinc-200 dark:bg-zinc-800 rounded text-[9px] font-mono border border-zinc-300 dark:border-zinc-700">
            ⌘K
          </kbd>
          <span>for commands</span>
        </div>
      </div>
    </footer>
  );
};
