import React from 'react';
import {
  Activity,
  Battery,
  Compass,
  Globe,
  MapPin,
  Navigation,
  Radio,
  Shield,
  Smartphone,
  Wifi,
} from 'lucide-react';
import { SensorState } from '../types';

interface SensorsProps {
  sensors: SensorState;
  onUpdateSensors: (updates: Partial<SensorState>) => void;
}

export const Sensors: React.FC<SensorsProps> = ({ sensors, onUpdateSensors }) => {
  const handleGpsUpdate = (lat: number, lng: number, name: string) => {
    onUpdateSensors({
      gps: {
        ...sensors.gps,
        lat,
        lng,
        locationName: name,
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <span>Android Hardware Sensors Simulation</span>
        </h1>
        <p className="text-xs text-zinc-500">
          Simulate GPS location coordinates, battery telemetry, 3D tilt, and network speed throttle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. GPS LOCATION PIN DROPPER */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>GPS Location Dropper</span>
          </h3>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-zinc-400">Current Location</span>
              <span className="font-bold text-emerald-500">{sensors.gps.locationName}</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-zinc-400">Coordinates</span>
              <span>
                {sensors.gps.lat.toFixed(4)}, {sensors.gps.lng.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleGpsUpdate(37.7749, -122.4194, 'San Francisco, CA')}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-emerald-500 transition-colors font-semibold text-left"
            >
              🌉 San Francisco
            </button>
            <button
              onClick={() => handleGpsUpdate(40.7128, -74.006, 'New York City, NY')}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-emerald-500 transition-colors font-semibold text-left"
            >
              🗽 New York City
            </button>
            <button
              onClick={() => handleGpsUpdate(51.5074, -0.1278, 'London, UK')}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-emerald-500 transition-colors font-semibold text-left"
            >
              🎡 London, UK
            </button>
            <button
              onClick={() => handleGpsUpdate(35.6762, 139.6503, 'Tokyo, Japan')}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-emerald-500 transition-colors font-semibold text-left"
            >
              🗼 Tokyo, Japan
            </button>
          </div>
        </div>

        {/* 2. BATTERY & POWER TELEMETRY */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Battery className="w-4 h-4 text-emerald-500" />
            <span>Battery State Simulation</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-mono">
                <span>Charge Level</span>
                <span className="font-bold text-emerald-500">{sensors.battery.level}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={sensors.battery.level}
                onChange={(e) =>
                  onUpdateSensors({
                    battery: { ...sensors.battery, level: Number(e.target.value) },
                  })
                }
                className="w-full accent-emerald-500"
              />
            </div>

            <label className="flex items-center space-x-2 font-medium cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={sensors.battery.isCharging}
                onChange={(e) =>
                  onUpdateSensors({
                    battery: { ...sensors.battery, isCharging: e.target.checked },
                  })
                }
                className="rounded text-emerald-500"
              />
              <span>AC Power Charger Plugged In</span>
            </label>
          </div>
        </div>

        {/* 3. NETWORK BANDWIDTH THROTTLE */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-blue-500" />
            <span>Network Throttle & Latency</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {['WiFi', '5G', '4G', '3G', '2G', 'Offline'].map((net) => (
              <button
                key={net}
                onClick={() =>
                  onUpdateSensors({
                    network: {
                      ...sensors.network,
                      type: net as any,
                    },
                  })
                }
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  sensors.network.type === net
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
