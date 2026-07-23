import React, { useState } from 'react';
import {
  Grid,
  Layers,
  Layout,
  Maximize2,
  Minus,
  Play,
  Plus,
  Power,
  Radio,
  RotateCw,
  Smartphone,
  Split,
  Tv,
  X,
  Zap,
} from 'lucide-react';
import { AndroidDevice, ApkPackage } from '../types';
import { AndroidEmulatorDisplay } from './AndroidEmulatorDisplay';

interface RunningDevicesProps {
  devices: AndroidDevice[];
  apks: ApkPackage[];
  onStartDevice: (id: string) => void;
  onPauseDevice: (id: string) => void;
  onStopDevice: (id: string) => void;
  onTakeScreenshot: (deviceName: string) => void;
  onUpdateDeviceStatus: (id: string, updates: Partial<AndroidDevice>) => void;
  onOpenNewDeviceModal: () => void;
  onSelectTab: (tab: string) => void;
}

type LayoutMode = 'tabbed' | 'grid' | 'split';

export const RunningDevices: React.FC<RunningDevicesProps> = ({
  devices,
  apks,
  onStartDevice,
  onPauseDevice,
  onStopDevice,
  onTakeScreenshot,
  onUpdateDeviceStatus,
  onOpenNewDeviceModal,
  onSelectTab,
}) => {
  const runningDevices = devices.filter((d) => d.status === 'running' || d.status === 'paused');
  const [activeTabId, setActiveTabId] = useState<string>(
    runningDevices[0]?.id || devices[0]?.id || ''
  );
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('tabbed');

  const selectedDevice = devices.find((d) => d.id === activeTabId) || runningDevices[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Controls & Layout Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-500" />
            <span>Active Emulator Screen</span>
          </h1>
          <p className="text-xs text-zinc-500">
            Interactive multi-instance workspace ({runningDevices.length} / 3 maximum running)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Layout Mode Selector */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
            <button
              onClick={() => setLayoutMode('tabbed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                layoutMode === 'tabbed'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tabbed</span>
            </button>

            <button
              onClick={() => setLayoutMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>

            <button
              onClick={() => setLayoutMode('split')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                layoutMode === 'split'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
          </div>

          <button
            onClick={onOpenNewDeviceModal}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Instance</span>
          </button>
        </div>
      </div>

      {/* NO DEVICES RUNNING STATE */}
      {runningDevices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl space-y-4 max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              No Devices Currently Running
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Select a device from your list to boot it into the ultra-lightweight AOSP runtime.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {devices[0] && (
              <button
                onClick={() => {
                  onStartDevice(devices[0].id);
                  setActiveTabId(devices[0].id);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Boot "{devices[0].name}"
              </button>
            )}
            <button
              onClick={() => onSelectTab('devices')}
              className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Open Device Manager
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* TABBED LAYOUT */}
          {layoutMode === 'tabbed' && (
            <div className="space-y-4">
              {/* Tab Bar */}
              <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto pb-1 scrollbar-thin">
                {runningDevices.map((dev) => {
                  const isActive = dev.id === activeTabId;
                  return (
                    <button
                      key={dev.id}
                      onClick={() => setActiveTabId(dev.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-t-xl text-xs font-semibold transition-all border-t border-x ${
                        isActive
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 border-b-2 border-b-emerald-500'
                          : 'bg-zinc-50/60 dark:bg-zinc-800/40 text-zinc-500 border-transparent hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="truncate max-w-[120px]">{dev.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400">({dev.ramMb}MB)</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Screen */}
              {selectedDevice && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                  <div className="mb-4 flex items-center justify-between w-full max-w-lg border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {selectedDevice.name}
                      </span>
                      <span className="text-xs text-emerald-500 font-mono">
                        Port {selectedDevice.adbPort}
                      </span>
                    </div>

                    <button
                      onClick={() => onStopDevice(selectedDevice.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center space-x-1"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>Stop Instance</span>
                    </button>
                  </div>

                  <AndroidEmulatorDisplay
                    device={selectedDevice}
                    apks={apks}
                    onTakeScreenshot={onTakeScreenshot}
                    onUpdateDeviceStatus={onUpdateDeviceStatus}
                  />
                </div>
              )}
            </div>
          )}

          {/* GRID & SPLIT VIEW LAYOUTS */}
          {(layoutMode === 'grid' || layoutMode === 'split') && (
            <div
              className={`grid gap-6 ${
                layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
              }`}
            >
              {runningDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center shadow-xs"
                >
                  <div className="w-full flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-3">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                      {dev.name}
                    </span>
                    <button
                      onClick={() => onStopDevice(dev.id)}
                      className="text-red-500 hover:text-red-600 p-1 rounded"
                      title="Stop Device"
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <AndroidEmulatorDisplay
                    device={dev}
                    apks={apks}
                    onTakeScreenshot={onTakeScreenshot}
                    onUpdateDeviceStatus={onUpdateDeviceStatus}
                    isCompact
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
