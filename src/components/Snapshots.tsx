import React, { useState } from 'react';
import {
  Clock,
  Copy,
  FolderArchive,
  HardDrive,
  Plus,
  RotateCcw,
  Smartphone,
  Trash2,
  Zap,
} from 'lucide-react';
import { AndroidDevice, Snapshot } from '../types';

interface SnapshotsProps {
  snapshots: Snapshot[];
  devices: AndroidDevice[];
  onCreateSnapshot: (newSnap: Partial<Snapshot>) => void;
  onRestoreSnapshot: (id: string) => void;
  onDeleteSnapshot: (id: string) => void;
}

export const Snapshots: React.FC<SnapshotsProps> = ({
  snapshots,
  devices,
  onCreateSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
}) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotDesc, setSnapshotDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dev = devices.find((d) => d.id === selectedDeviceId) || devices[0];
    if (!dev) return;

    onCreateSnapshot({
      deviceId: dev.id,
      deviceName: dev.name,
      name: snapshotName || `State Backup - ${new Date().toLocaleTimeString()}`,
      description: snapshotDesc || 'Instant AOSP memory RAM snapshot.',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sizeMb: Math.round(dev.ramMb * 0.3),
      androidVersion: dev.androidVersion,
      ramMbAtSnapshot: dev.ramMb,
      previewColor: 'from-emerald-600 to-teal-800',
    });

    setSnapshotName('');
    setSnapshotDesc('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <FolderArchive className="w-5 h-5 text-emerald-500" />
          <span>Android Instant State Snapshots</span>
        </h1>
        <p className="text-xs text-zinc-500">
          Save complete memory heap and storage state to restore in under 1.2 seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Snapshot Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>Create New Snapshot</span>
          </h3>

          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Target Device Instance
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} (Android {d.androidVersion})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Snapshot Label
              </label>
              <input
                type="text"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="e.g. Pre-Test Baseline"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Description / Notes
              </label>
              <textarea
                value={snapshotDesc}
                onChange={(e) => setSnapshotDesc(e.target.value)}
                placeholder="Details on installed apps or test state..."
                rows={3}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              Take RAM Snapshot Now
            </button>
          </form>
        </div>

        {/* Snapshot Cards Tree */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
                      Android {snap.androidVersion}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{snap.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">
                    {snap.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                    {snap.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-zinc-400">
                    Size: {snap.sizeMb}MB
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onRestoreSnapshot(snap.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1 transition-colors shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    <button
                      onClick={() => onDeleteSnapshot(snap.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete Snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
