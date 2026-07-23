import React from 'react';
import { Code, Download, Package, Shield, Star, Zap } from 'lucide-react';
import { PluginItem } from '../types';

interface PluginsProps {
  plugins: PluginItem[];
  onToggleInstallPlugin: (id: string) => void;
}

export const Plugins: React.FC<PluginsProps> = ({ plugins, onToggleInstallPlugin }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <Code className="w-5 h-5 text-emerald-500" />
          <span>NanoDroid Plugin SDK & Extensions</span>
        </h1>
        <p className="text-xs text-zinc-500">
          Extend NanoDroid runtime with framework bridges (Flutter, React Native, Expo, Unity)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono">
                  {plugin.category}
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{plugin.rating}</span>
                </span>
              </div>

              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">
                {plugin.name}
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                v{plugin.version} • By {plugin.author}
              </p>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                {plugin.description}
              </p>
            </div>

            <button
              onClick={() => onToggleInstallPlugin(plugin.id)}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                plugin.isInstalled
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
              }`}
            >
              {plugin.isInstalled ? 'Installed (Click to Disable)' : 'Install Extension'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
