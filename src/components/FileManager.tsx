import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  FolderArchive,
  FolderOpen,
  Image,
  Plus,
  Search,
  Smartphone,
  Trash2,
  Upload,
} from 'lucide-react';
import { GuestFile } from '../types';

interface FileManagerProps {
  files: GuestFile[];
  onAddFile: (file: Partial<GuestFile>) => void;
  onDeleteFile: (id: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onAddFile,
  onDeleteFile,
}) => {
  const [currentPath, setCurrentPath] = useState('/sdcard');
  const [search, setSearch] = useState('');

  const filteredFiles = files.filter(
    (f) =>
      f.path.startsWith(currentPath) &&
      f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulatedFileUpload = () => {
    onAddFile({
      name: 'new_host_transfer.json',
      path: `${currentPath}/new_host_transfer.json`,
      sizeBytes: 4096,
      type: 'code',
      modifiedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isSystem: false,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-amber-500" />
            <span>Android Filesystem Bridge</span>
          </h1>
          <p className="text-xs text-zinc-500">
            Browse guest files (/sdcard/), transfer host assets, and manage app storage
          </p>
        </div>

        <button
          onClick={handleSimulatedFileUpload}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Push Host File to Device</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Breadcrumb Path Bar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 text-xs font-mono">
          <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span className="font-bold">{currentPath}</span>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-8 pr-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />
          </div>
        </div>

        {/* File Table */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {filteredFiles.map((f) => (
            <div
              key={f.id}
              className="p-3.5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors text-xs"
            >
              <div className="flex items-center space-x-3">
                {f.type === 'folder' && <FolderOpen className="w-4 h-4 text-amber-500" />}
                {f.type === 'image' && <Image className="w-4 h-4 text-blue-500" />}
                {f.type === 'code' && <FileCode className="w-4 h-4 text-purple-500" />}
                {f.type === 'apk' && <FolderArchive className="w-4 h-4 text-emerald-500" />}
                {f.type !== 'folder' && f.type !== 'image' && f.type !== 'code' && f.type !== 'apk' && (
                  <FileText className="w-4 h-4 text-zinc-400" />
                )}

                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{f.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono">{f.path}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-[11px] font-mono text-zinc-500">
                  {f.sizeBytes ? `${(f.sizeBytes / 1024).toFixed(1)} KB` : 'Folder'}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">{f.modifiedDate}</span>

                {!f.isSystem && (
                  <button
                    onClick={() => onDeleteFile(f.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 rounded"
                    title="Delete File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
