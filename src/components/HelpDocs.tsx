import React from 'react';
import {
  BookOpen,
  Code,
  Cpu,
  HelpCircle,
  Shield,
  Smartphone,
  Terminal,
  Zap,
} from 'lucide-react';

export const HelpDocs: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-emerald-500" />
          <span>NanoDroid Architecture & Help Center</span>
        </h1>
        <p className="text-xs text-zinc-500">
          Technical specifications, KVM/Hyper-V setup guides, and ADB command cheat sheet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Architecture Specs */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Lightweight Architecture</span>
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            NanoDroid uses direct host hypervisor virtualization (KVM on Linux, Hyper-V on Windows, Apple Hypervisor on macOS) bypassing standard QEMU GUI wrapper bloat. Idle memory footprint is restricted to ~380MB RAM per instance.
          </p>
        </div>

        {/* ADB Reference Cheat Sheet */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-500" />
            <span>ADB Command Reference</span>
          </h3>
          <div className="space-y-1.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
            <div><code className="text-emerald-500">adb devices</code> - List attached running emulators</div>
            <div><code className="text-emerald-500">adb install &lt;app.apk&gt;</code> - Stream install package</div>
            <div><code className="text-emerald-500">adb logcat -d</code> - Dump logcat buffer</div>
            <div><code className="text-emerald-500">adb reverse tcp:8081 tcp:8081</code> - Forward React Metro port</div>
          </div>
        </div>
      </div>
    </div>
  );
};
