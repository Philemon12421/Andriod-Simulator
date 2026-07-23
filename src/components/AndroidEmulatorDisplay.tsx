import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Battery,
  Camera,
  Check,
  ChevronRight,
  Circle,
  Cloud,
  Code,
  Compass,
  Download,
  FolderOpen,
  Gamepad,
  Globe,
  HardDrive,
  Home,
  Info,
  Maximize2,
  Minus,
  Moon,
  Package,
  Plus,
  Power,
  RotateCw,
  Search,
  Settings,
  Share2,
  Shield,
  Smartphone,
  Sun,
  Square,
  Terminal,
  Trash2,
  Tv,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  Zap,
} from 'lucide-react';
import { AndroidDevice, ApkPackage } from '../types';

interface AndroidEmulatorDisplayProps {
  device: AndroidDevice;
  apks: ApkPackage[];
  onTakeScreenshot: (deviceName: string) => void;
  onUpdateDeviceStatus: (id: string, updates: Partial<AndroidDevice>) => void;
  isCompact?: boolean;
}

type ActiveAppType = 'launcher' | 'settings' | 'browser' | 'files' | 'app_detail';

export const AndroidEmulatorDisplay: React.FC<AndroidEmulatorDisplayProps> = ({
  device,
  apks,
  onTakeScreenshot,
  onUpdateDeviceStatus,
  isCompact = false,
}) => {
  const [screenOn, setScreenOn] = useState(true);
  const [activeApp, setActiveApp] = useState<ActiveAppType>('launcher');
  const [selectedApkId, setSelectedApkId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(device.orientation);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState('11:36');

  // Interactive app internal states
  const [notes, setNotes] = useState<string[]>([
    'Welcome to NanoDroid Notes!',
    'Tested with React Native SQLite storage.',
  ]);
  const [newNote, setNewNote] = useState('');
  const [browserUrl, setBrowserUrl] = useState('https://aosp.nanodroid.dev');
  const [scanOutput, setScanOutput] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Clock interval
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Screen recording timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const installedApkList = apks.filter(
    (a) => a.installedDeviceIds.includes(device.id) || device.installedAppIds.includes(a.id)
  );

  const handleLaunchApk = (apkId: string) => {
    setSelectedApkId(apkId);
    setActiveApp('app_detail');
  };

  const handleRunSecurityScan = () => {
    setIsScanning(true);
    setScanOutput(['[+] Initializing DroidScan socket engine...']);
    setTimeout(() => {
      setScanOutput((prev) => [...prev, '[+] Scanning localhost:5555 (ADB Interface)...']);
    }, 600);
    setTimeout(() => {
      setScanOutput((prev) => [
        ...prev,
        '[+] Port 5555 OPEN (ADB Wireless Debugging)',
        '[+] Memory Heap Audit: No cleartext secrets exposed in RAM.',
        '[✔] Scan Complete: 0 High Vulnerabilities Found.',
      ]);
      setIsScanning(false);
    }, 1500);
  };

  const currentApk = apks.find((a) => a.id === selectedApkId);

  const isLandscape = orientation === 'landscape';

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-2 select-none max-w-full">
      {/* Side Hardware Controls Panel */}
      <div className="flex lg:flex-col items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl shadow-xs">
        {/* Power Toggle */}
        <button
          onClick={() => setScreenOn(!screenOn)}
          className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
            screenOn
              ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
              : 'bg-emerald-500 text-white shadow-xs'
          }`}
          title="Toggle Power Screen"
        >
          <Power className="w-4 h-4" />
        </button>

        {/* Volume Up */}
        <button
          onClick={() => setVolume((v) => Math.min(100, v + 10))}
          className="p-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          title="Volume Up"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Volume Down */}
        <button
          onClick={() => setVolume((v) => Math.max(0, v - 10))}
          className="p-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          title="Volume Down"
        >
          <VolumeX className="w-4 h-4" />
        </button>

        {/* Rotate Screen */}
        <button
          onClick={() => {
            const next = orientation === 'portrait' ? 'landscape' : 'portrait';
            setOrientation(next);
            onUpdateDeviceStatus(device.id, { orientation: next });
          }}
          className="p-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          title="Rotate Display"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Screenshot Tool */}
        <button
          onClick={() => onTakeScreenshot(device.name)}
          className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
          title="Take Screenshot"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Record Video */}
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
          }`}
          title="Record Screen Video/GIF"
        >
          <Video className="w-4 h-4" />
        </button>
      </div>

      {/* DEVICE FRAME & DISPLAY SCREEN */}
      <div
        className={`relative transition-all duration-300 rounded-[2.5rem] bg-zinc-950 p-3 shadow-2xl border-4 border-zinc-800 ${
          isLandscape ? 'w-[640px] h-[380px]' : isCompact ? 'w-[300px] h-[580px]' : 'w-[360px] h-[680px]'
        }`}
      >
        {/* Screen Recording Indicator Badge */}
        {isRecording && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 bg-red-600/90 text-white text-[10px] font-mono px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>REC 00:0{recordSeconds}</span>
          </div>
        )}

        {/* SCREEN CANVAS AREA */}
        <div className="w-full h-full rounded-[2rem] bg-slate-900 overflow-hidden flex flex-col relative text-white select-none">
          {/* OFF SCREEN STATE */}
          {!screenOn ? (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center text-zinc-600">
              <Power className="w-8 h-8 mb-2" />
              <p className="text-xs font-mono">Screen Powered Off</p>
              <button
                onClick={() => setScreenOn(true)}
                className="mt-4 px-3 py-1 rounded bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700"
              >
                Wake Display
              </button>
            </div>
          ) : (
            <>
              {/* ANDROID STATUS BAR */}
              <div className="h-7 bg-black/40 backdrop-blur-xs px-4 flex items-center justify-between text-[11px] font-mono z-30 shrink-0">
                <span>{currentTime}</span>

                {/* Speaker Notch Mock */}
                <div className="w-16 h-3 rounded-full bg-black/80 flex items-center justify-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>

                <div className="flex items-center space-x-2 text-zinc-300">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px]">{device.batteryLevel}%</span>
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* ACTIVE APP CONTENT AREA */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-4 space-y-4">
                {/* 1. LAUNCHER HOME SCREEN */}
                {activeApp === 'launcher' && (
                  <div className="space-y-6">
                    {/* Clock & Weather Widget */}
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-1">
                      <div className="text-3xl font-light tracking-tight">{currentTime}</div>
                      <div className="text-xs text-zinc-300 flex items-center justify-center space-x-1.5">
                        <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                        <span>San Francisco • 21°C Sunny</span>
                      </div>
                    </div>

                    {/* App Grid */}
                    <div className="grid grid-cols-4 gap-4 pt-2">
                      {/* System Apps */}
                      <button
                        onClick={() => setActiveApp('settings')}
                        className="flex flex-col items-center space-y-1.5 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-zinc-700">
                          <Settings className="w-6 h-6 text-zinc-200" />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-200">Settings</span>
                      </button>

                      <button
                        onClick={() => setActiveApp('browser')}
                        className="flex flex-col items-center space-y-1.5 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-blue-400/30">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-200">Browser</span>
                      </button>

                      <button
                        onClick={() => setActiveApp('files')}
                        className="flex flex-col items-center space-y-1.5 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-amber-400/30">
                          <FolderOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-200">Files</span>
                      </button>

                      {/* Installed Custom APKs */}
                      {installedApkList.map((apk) => (
                        <button
                          key={apk.id}
                          onClick={() => handleLaunchApk(apk.id)}
                          className="flex flex-col items-center space-y-1.5 group"
                        >
                          <div
                            className={`w-12 h-12 rounded-2xl ${apk.iconBg} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-white/20`}
                          >
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-[10px] font-medium text-zinc-200 truncate max-w-[60px]">
                            {apk.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. SETTINGS APP */}
                {activeApp === 'settings' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                      <Settings className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-sm">Android Settings</h3>
                    </div>

                    <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Device Name</span>
                        <span className="font-semibold">{device.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Android Release</span>
                        <span className="font-semibold text-emerald-400">
                          Android {device.androidVersion}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Build Number</span>
                        <span className="font-mono text-[10px]">AOSP-UltraLite-2026.07</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">RAM Allocated</span>
                        <span className="font-mono">{device.ramMb} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">SU Root Access</span>
                        <span
                          className={`font-semibold ${
                            device.isRooted ? 'text-emerald-400' : 'text-zinc-500'
                          }`}
                        >
                          {device.isRooted ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. BROWSER APP */}
                {activeApp === 'browser' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-xl border border-white/15">
                      <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                      <input
                        type="text"
                        value={browserUrl}
                        onChange={(e) => setBrowserUrl(e.target.value)}
                        className="bg-transparent text-white font-mono text-[11px] w-full focus:outline-none"
                      />
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                      <h4 className="font-bold text-sm text-cyan-400">
                        Welcome to AOSP Web View
                      </h4>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        NanoDroid HTML5 Chromium engine initialized with hardware GPU acceleration.
                      </p>
                      <div className="p-2 rounded bg-black/40 text-[10px] font-mono text-emerald-400">
                        Status: 200 OK • Latency: 12ms
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. FILES APP */}
                {activeApp === 'files' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold">Internal Storage (/sdcard)</h3>
                      </div>
                      <span className="text-[10px] text-zinc-400">{device.usedStorageGb}GB Used</span>
                    </div>

                    <div className="space-y-2">
                      {['Download', 'Documents', 'Pictures', 'Movies'].map((folder) => (
                        <div
                          key={folder}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            <FolderOpen className="w-4 h-4 text-amber-400" />
                            <span>{folder}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. INSTALLED APK LAUNCHED SCREEN */}
                {activeApp === 'app_detail' && currentApk && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 border border-white/15">
                      <div className={`p-2.5 rounded-xl ${currentApk.iconBg} text-white`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{currentApk.name}</h3>
                        <p className="text-[10px] font-mono text-zinc-400">
                          {currentApk.packageName}
                        </p>
                      </div>
                    </div>

                    {/* CUSTOM APK DEMO LOGIC */}
                    {currentApk.id === 'apk-rn-notes' && (
                      <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/10">
                        <h4 className="font-semibold text-emerald-400">React Native Notes App</h4>
                        <div className="space-y-1.5">
                          {notes.map((n, idx) => (
                            <div key={idx} className="p-2 rounded bg-black/40 text-[11px]">
                              • {n}
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-2 pt-1">
                          <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add markdown note..."
                            className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white flex-1 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              if (newNote.trim()) {
                                setNotes([...notes, newNote]);
                                setNewNote('');
                              }
                            }}
                            className="px-3 py-1 bg-emerald-600 rounded text-xs font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}

                    {currentApk.id === 'apk-cyber-sec' && (
                      <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/10">
                        <h4 className="font-semibold text-emerald-400">DroidScan Security Tool</h4>
                        <button
                          onClick={handleRunSecurityScan}
                          disabled={isScanning}
                          className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs transition-colors"
                        >
                          {isScanning ? 'Scanning RAM & Network...' : 'Run Vulnerability Scan'}
                        </button>

                        <div className="p-2.5 rounded bg-black/60 font-mono text-[10px] space-y-1 max-h-32 overflow-y-auto text-emerald-400">
                          {scanOutput.length === 0 ? (
                            <span className="text-zinc-500">Ready to scan guest instance.</span>
                          ) : (
                            scanOutput.map((l, i) => <div key={i}>{l}</div>)
                          )}
                        </div>
                      </div>
                    )}

                    {currentApk.id !== 'apk-rn-notes' && currentApk.id !== 'apk-cyber-sec' && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                        <p className="text-zinc-300">{currentApk.description}</p>
                        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                          App running smoothly at 60 FPS in AOSP container
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ANDROID BOTTOM NAVIGATION BAR */}
              <div className="h-10 bg-black/80 backdrop-blur-md flex items-center justify-around px-8 z-30 shrink-0 border-t border-white/10">
                {/* BACK KEY */}
                <button
                  onClick={() => setActiveApp('launcher')}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* HOME KEY */}
                <button
                  onClick={() => setActiveApp('launcher')}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                  title="Home"
                >
                  <Circle className="w-4 h-4 fill-current" />
                </button>

                {/* RECENTS KEY */}
                <button
                  onClick={() => setActiveApp('settings')}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                  title="Recents App Cards"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
