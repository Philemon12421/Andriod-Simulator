import React from 'react';
import {
  Activity,
  Box,
  ChevronLeft,
  ChevronRight,
  Code,
  Compass,
  Cpu,
  Download,
  FileText,
  FolderArchive,
  FolderOpen,
  Gauge,
  HelpCircle,
  Home,
  Layers,
  List,
  PackageCheck,
  Radio,
  Settings,
  Shield,
  Smartphone,
  Terminal,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  runningCount: number;
  devicesCount: number;
  apksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapsed,
  runningCount,
  devicesCount,
  apksCount,
}) => {
  const sections = [
    {
      group: 'Core Runtime',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'devices', label: 'My Devices', icon: Smartphone, badge: devicesCount },
        { id: 'running', label: 'Running Instances', icon: Radio, badge: runningCount, highlight: runningCount > 0 },
        { id: 'apks', label: 'APK Manager', icon: PackageCheck, badge: apksCount },
        { id: 'adb', label: 'ADB Center', icon: Terminal },
        { id: 'snapshots', label: 'Snapshots', icon: FolderArchive },
        { id: 'files', label: 'Files Explorer', icon: FolderOpen },
      ],
    },
    {
      group: 'Tools & Diagnostics',
      items: [
        { id: 'debug', label: 'Logs & Logcat', icon: FileText },
        { id: 'performance', label: 'Performance', icon: Gauge },
        { id: 'sensors', label: 'Sensors Simulator', icon: Activity },
      ],
    },
    {
      group: 'Ecosystem',
      items: [
        { id: 'plugins', label: 'Plugins SDK', icon: Code },
        { id: 'marketplace', label: 'Marketplace', icon: Compass },
      ],
    },
    {
      group: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help & Docs', icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside
      className={`h-[calc(100vh-3.5rem-1.75rem)] bg-zinc-50/90 dark:bg-zinc-900/90 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-200 flex flex-col justify-between select-none z-20 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-thin">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed && (
              <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                {section.group}
              </h4>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400 dark:text-white' : ''}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                        item.highlight
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        {!collapsed && (
          <div className="flex items-center space-x-2 px-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-mono">AOSP Sandbox</span>
          </div>
        )}
        <button
          onClick={onToggleCollapsed}
          className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
