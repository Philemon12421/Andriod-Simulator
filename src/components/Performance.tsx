import React from 'react';
import { Cpu, Gauge, HardDrive, Shield, Zap } from 'lucide-react';
import { PerformanceMode, SystemSettings } from '../types';

interface PerformanceProps {
  settings: SystemSettings;
  onUpdateSettings: (updates: Partial<SystemSettings>) => void;
}

export const Performance: React.FC<PerformanceProps> = ({
  settings,
  onUpdateSettings,
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <Gauge className="w-5 h-5 text-emerald-500" />
          <span>Performance Scheduler & Resource Engine</span>
        </h1>
        <p className="text-xs text-zinc-500">
          Optimize RAM consumption, frame rate caps, and background instance suspension
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Mode Selector */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Active Performance Profile</span>
          </h3>

          <div className="space-y-2">
            {[
              {
                id: 'ultra_lite',
                title: '⚡ Ultra Lite Mode (380MB RAM Limit)',
                desc: 'Maximum RAM efficiency for budget hardware and multi-instance testing.',
              },
              {
                id: 'balanced',
                title: '⚖️ Balanced Profile',
                desc: 'Smooth 60 FPS UI rendering with 1GB default memory allocation.',
              },
              {
                id: 'performance',
                title: '🔥 High Performance Mode',
                desc: 'Uncapped CPU cores and host GPU acceleration for 3D games and heavy frameworks.',
              },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() =>
                  onUpdateSettings({ performanceMode: mode.id as PerformanceMode })
                }
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  settings.performanceMode === mode.id
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-zinc-900 dark:text-zinc-100 ring-1 ring-emerald-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="text-xs font-bold">{mode.title}</div>
                <div className="text-[11px] text-zinc-500 mt-1">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Frame Limiter & Suspend Settings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-500" />
            <span>Frame Limiter & Auto-Suspend</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-zinc-700 dark:text-zinc-300">
                Max FPS Cap ({settings.maxFpsCap} FPS)
              </label>
              <input
                type="range"
                min="30"
                max="120"
                step="30"
                value={settings.maxFpsCap}
                onChange={(e) => onUpdateSettings({ maxFpsCap: Number(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-700 dark:text-zinc-300">
                Auto-Suspend Inactive Instances ({settings.autoSuspendTimeoutMinutes} minutes)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={settings.autoSuspendTimeoutMinutes}
                onChange={(e) =>
                  onUpdateSettings({ autoSuspendTimeoutMinutes: Number(e.target.value) })
                }
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
