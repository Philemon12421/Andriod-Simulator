import React, { useState } from 'react';
import {
  Check,
  Code,
  Copy,
  Download,
  Info,
  Play,
  Radio,
  RotateCw,
  Send,
  Smartphone,
  Terminal,
  Trash2,
  Wifi,
  Zap,
} from 'lucide-react';
import { AdbEngine } from '../lib/adbEngine';
import { AndroidDevice, ApkPackage } from '../types';

interface AdbCenterProps {
  devices: AndroidDevice[];
  apks: ApkPackage[];
}

export const AdbCenter: React.FC<AdbCenterProps> = ({ devices, apks }) => {
  const [commandInput, setCommandInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Android Debug Bridge version 1.0.41 (NanoDroid Embedded daemon)',
    '* daemon started successfully at tcp:5037 *',
    'Type "help" or click quick action buttons below to run commands.',
  ]);
  const [targetDeviceId, setTargetDeviceId] = useState<string>(
    devices.find((d) => d.status === 'running')?.id || devices[0]?.id || ''
  );
  const [commandHistory, setCommandHistory] = useState<string[]>([
    'adb devices',
    'adb shell getprop',
    'adb logcat',
  ]);

  const handleRunCommand = (cmdStr: string) => {
    if (!cmdStr.trim()) return;

    const res = AdbEngine.executeCommand(cmdStr, devices, apks, targetDeviceId);

    if (res.output === '__CLEAR__') {
      setTerminalOutput([]);
    } else {
      setTerminalOutput((prev) => [
        ...prev,
        `$ ${cmdStr}`,
        res.output,
        '----------------------------------------',
      ]);
    }

    if (!commandHistory.includes(cmdStr)) {
      setCommandHistory((prev) => [cmdStr, ...prev.slice(0, 9)]);
    }
    setCommandInput('');
  };

  const handleQuickScript = (script: string) => {
    setCommandInput(script);
    handleRunCommand(script);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-emerald-500" />
            <span>ADB Terminal & Bridge Center</span>
          </h1>
          <p className="text-xs text-zinc-500">
            Execute shell commands, stream logcats, and route TCP ports wirelessly
          </p>
        </div>

        {/* Wireless Status Pill */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
          <Wifi className="w-4 h-4" />
          <span>Wireless ADB: 127.0.0.1:5555</span>
        </div>
      </div>

      {/* Target Device & Quick Scripts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Device Target Selector */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Active Device Target
          </label>
          <select
            value={targetDeviceId}
            onChange={(e) => setTargetDeviceId(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.status})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Scripts */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Quick Script Snippets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickScript('adb devices')}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500 border border-zinc-200 dark:border-zinc-700 text-xs font-mono transition-colors"
            >
              adb devices
            </button>

            <button
              onClick={() => handleQuickScript('adb shell getprop')}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500 border border-zinc-200 dark:border-zinc-700 text-xs font-mono transition-colors"
            >
              adb shell getprop
            </button>

            <button
              onClick={() => handleQuickScript('adb logcat')}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500 border border-zinc-200 dark:border-zinc-700 text-xs font-mono transition-colors"
            >
              adb logcat
            </button>

            <button
              onClick={() => handleQuickScript('adb reverse tcp:8081 tcp:8081')}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500 border border-zinc-200 dark:border-zinc-700 text-xs font-mono transition-colors"
            >
              adb reverse tcp:8081 (Metro)
            </button>

            <button
              onClick={() => handleQuickScript('adb reboot')}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-red-500/10 hover:text-red-500 border border-zinc-200 dark:border-zinc-700 text-xs font-mono transition-colors"
            >
              adb reboot
            </button>

            <button
              onClick={() => handleQuickScript('clear')}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-500"
            >
              clear
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Display Canvas */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[480px]">
        {/* Terminal Header */}
        <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-semibold text-zinc-200">
              nanodroid-adb-shell ~ bash
            </span>
          </div>

          <button
            onClick={() => setTerminalOutput([])}
            className="p-1 hover:text-zinc-200 rounded"
            title="Clear Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Console Log Buffer */}
        <div className="flex-1 p-4 font-mono text-xs text-emerald-400 overflow-y-auto space-y-1 scrollbar-thin select-text">
          {terminalOutput.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {line}
            </div>
          ))}
        </div>

        {/* Input Command Line */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunCommand(commandInput);
          }}
          className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-3"
        >
          <span className="text-emerald-500 font-mono font-bold text-sm">$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type ADB command e.g. adb devices or adb install app.apk..."
            className="flex-1 bg-transparent text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
