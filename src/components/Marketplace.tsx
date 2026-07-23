import React from 'react';
import { Compass, Download, Star, Tag, Zap } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const marketItems = [
    {
      title: 'Dark Luxury Raycast Obsidian Theme',
      category: 'UI Theme',
      downloads: '8.4k',
      rating: 4.9,
      desc: 'Obsidian dark palette inspired by Linear and Raycast desktop suites.',
    },
    {
      title: 'Foldable Device Profiles Pack',
      category: 'Hardware Profiles',
      downloads: '12.1k',
      rating: 4.8,
      desc: 'Galaxy Z Fold 5, Pixel Fold, and OnePlus Open screen profile presets.',
    },
    {
      title: 'Android TV 4K Media Tester',
      category: 'Extensions',
      downloads: '6.2k',
      rating: 4.9,
      desc: 'Remote D-Pad simulation overlay for testing smart TV Android apps.',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <Compass className="w-5 h-5 text-emerald-500" />
          <span>NanoDroid Community Marketplace</span>
        </h1>
        <p className="text-xs text-zinc-500">
          Discover community-built device profiles, UI themes, and testing extensions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {marketItems.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold">
                  {item.category}
                </span>
                <span className="text-amber-500 font-bold flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{item.rating}</span>
                </span>
              </div>

              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.desc}</p>
            </div>

            <button className="w-full py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-all">
              Download Profile ({item.downloads})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
