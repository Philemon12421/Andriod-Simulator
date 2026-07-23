import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Cpu,
  FileText,
  Filter,
  Gauge,
  HardDrive,
  Layers,
  Search,
  Trash2,
} from 'lucide-react';
import { AdbLog } from '../types';

interface DebugToolsProps {
  logs: AdbLog[];
  onClearLogs: () => void;
}

export const DebugTools: React.FC<DebugToolsProps> = ({ logs, onClearLogs }) => {
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'logcat' | 'profiler' | 'layout'>('logcat');

  const filteredLogs = logs.filter((l) => {
    const matchesLevel = levelFilter === 'ALL' || l.level === levelFilter;
    const matchesSearch =
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.tag.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span>Developer Debug Suite & Logcat</span>
          </h1>
          <p className="text-xs text-zinc-500">
            Real-time system logcat stream, CPU/RAM performance profiler, and View Hierarchy Inspector
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
          <button
            onClick={() => setActiveTab('logcat')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              activeTab === 'logcat'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500'
            }`}
          >
            Logcat Stream
          </button>
          <button
            onClick={() => setActiveTab('profiler')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              activeTab === 'profiler'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500'
            }`}
          >
            CPU/GPU Profiler
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              activeTab === 'layout'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500'
            }`}
          >
            Layout Inspector
          </button>
        </div>
      </div>

      {activeTab === 'logcat' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="ALL">All Levels (V, D, I, W, E)</option>
                <option value="V">Verbose (V)</option>
                <option value="D">Debug (D)</option>
                <option value="I">Info (I)</option>
                <option value="W">Warning (W)</option>
                <option value="E">Error (E)</option>
              </select>

              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by tag or log message..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-8 pr-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={onClearLogs}
              className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-red-500/10 text-red-500 text-xs font-semibold flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log Buffer</span>
            </button>
          </div>

          {/* Logcat Table Canvas */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-xs text-zinc-300 space-y-1.5 h-[480px] overflow-y-auto scrollbar-thin select-text">
            {filteredLogs.map((l) => (
              <div key={l.id} className="flex items-start space-x-3 leading-relaxed">
                <span className="text-zinc-500 shrink-0">{l.timestamp}</span>
                <span
                  className={`px-1 rounded text-[10px] font-bold shrink-0 ${
                    l.level === 'E'
                      ? 'bg-red-500/20 text-red-400'
                      : l.level === 'W'
                      ? 'bg-amber-500/20 text-amber-400'
                      : l.level === 'I'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {l.level}
                </span>
                <span className="text-purple-400 font-semibold shrink-0">{l.tag}:</span>
                <span className="break-all">{l.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profiler' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span>CPU Core Allocation</span>
            </h3>
            <div className="text-2xl font-bold font-mono text-emerald-500">8.4%</div>
            <p className="text-xs text-zinc-500">2 Cores pinned to KVM hypervisor thread</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-blue-500" />
              <span>RAM Memory Heap</span>
            </h3>
            <div className="text-2xl font-bold font-mono text-emerald-500">380 MB</div>
            <p className="text-xs text-zinc-500">Ultra Lite dynamic allocation active</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-emerald-500" />
              <span>GPU Frame Time</span>
            </h3>
            <div className="text-2xl font-bold font-mono text-emerald-500">60.0 FPS</div>
            <p className="text-xs text-zinc-500">Host OpenGL 4.6 context active</p>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-4">
          <Layers className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
            3D View Hierarchy Inspector Active
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            View boundaries, layout paddings, and view contrast scores are automatically highlighted on active running instances.
          </p>
        </div>
      )}
    </div>
  );
};
