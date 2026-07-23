import { AndroidDevice, ApkPackage } from '../types';

export interface AdbCommandResult {
  output: string;
  isError?: boolean;
}

export class AdbEngine {
  static executeCommand(
    commandStr: string,
    devices: AndroidDevice[],
    apks: ApkPackage[],
    targetDeviceId?: string
  ): AdbCommandResult {
    const raw = commandStr.trim();
    if (!raw) return { output: '' };

    const parts = raw.split(/\s+/);
    const base = parts[0].toLowerCase();

    if (base === 'help') {
      return {
        output: `NanoDroid Interactive ADB Terminal (v1.5-UltraLite)
Available Commands:
  adb devices                   - List all connected Android instances
  adb install <apk_name|path>    - Install APK package to active device
  adb shell <command>           - Execute shell command on guest device
  adb logcat [-d]               - Dump Android system event logcat
  adb push <file> <remote_path> - Transfer host file to device /sdcard
  adb pull <remote_path>        - Transfer file from guest to host
  adb reboot                    - Restart active Android emulator instance
  adb tcpip <port>              - Enable wireless ADB on specified TCP port
  adb connect <ip:port>         - Connect to wireless ADB endpoint
  adb reverse tcp:<p1> tcp:<p2> - Forward port from device to host (React/Metro)
  adb kill-server               - Stop background ADB daemon
  adb start-server              - Start background ADB daemon
  clear                         - Clear terminal output`,
      };
    }

    if (base !== 'adb') {
      if (base === 'clear') {
        return { output: '__CLEAR__' };
      }
      return {
        output: `command not found: ${base}. Type "help" or "adb help" for available commands.`,
        isError: true,
      };
    }

    const sub = parts[1] ? parts[1].toLowerCase() : '';

    if (!sub || sub === 'help') {
      return {
        output: `Android Debug Bridge version 1.0.41 (NanoDroid Embedded)
Installed as: /usr/bin/adb

Global Options:
  -s <serial>                   use device with given serial number
  -d                            use USB device
  -e                            use TCP emulator instance

Type "help" for a list of common commands.`,
      };
    }

    // adb devices
    if (sub === 'devices') {
      const running = devices.filter((d) => d.status === 'running');
      if (running.length === 0) {
        return {
          output: `List of devices attached\n\n(No active running devices. Boot an instance from Device Manager or Dashboard)`,
        };
      }
      const lines = running.map(
        (d) => `${d.ipAddress}:${d.adbPort}\tdevice\tproduct:${d.name.replace(/\s+/g, '_')} model:${d.profileId} device:${d.id}`
      );
      return {
        output: `List of devices attached\n${lines.join('\n')}`,
      };
    }

    // adb install
    if (sub === 'install') {
      const apkName = parts[2];
      if (!apkName) {
        return { output: 'adb: install requires an APK file path or package name.', isError: true };
      }
      const activeDev = devices.find((d) => d.id === targetDeviceId || d.status === 'running') || devices[0];
      if (!activeDev || activeDev.status !== 'running') {
        return { output: 'error: no devices/emulators found in running state.', isError: true };
      }
      const matchApk = apks.find(
        (a) => a.name.toLowerCase().includes(apkName.toLowerCase()) || a.packageName.toLowerCase().includes(apkName.toLowerCase())
      );
      if (matchApk) {
        return {
          output: `Performing Streamed Install\nSuccess: Package [${matchApk.packageName}] (${matchApk.versionName}) installed to device [${activeDev.name}]`,
        };
      }
      return {
        output: `Performing Streamed Install\nSuccess: Package [com.example.${apkName.replace(/[^a-zA-Z0-9]/g, '')}] installed to device [${activeDev.name}]`,
      };
    }

    // adb shell
    if (sub === 'shell') {
      const activeDev = devices.find((d) => d.id === targetDeviceId || d.status === 'running') || devices[0];
      if (!activeDev || activeDev.status !== 'running') {
        return { output: 'error: no running device connected.', isError: true };
      }
      const shellCmd = parts.slice(2).join(' ').trim();
      if (!shellCmd) {
        return {
          output: `nanodroid_x86_64:/ $ (Interactive shell shell mode active. Try: adb shell pm list packages, getprop, or uptime)`,
        };
      }

      if (shellCmd.startsWith('getprop')) {
        return {
          output: `[ro.build.version.release]: [${activeDev.androidVersion}]
[ro.product.model]: [${activeDev.name}]
[ro.product.cpu.abi]: [x86_64]
[ro.sf.lcd_density]: [${activeDev.dpi}]
[persist.sys.timezone]: [UTC]
[nanodroid.runtime.engine]: [KVM/AOSP-UltraLite]`,
        };
      }

      if (shellCmd.includes('pm list packages')) {
        return {
          output: `package:com.android.systemui
package:com.android.settings
package:com.android.launcher3
package:io.flutter.demo.gallery
package:com.nanodroid.notes
package:org.sec.droidscan`,
        };
      }

      if (shellCmd === 'uptime') {
        const uptime = activeDev.uptimeSeconds || 360;
        return {
          output: ` 11:36:09 up ${Math.floor(uptime / 60)} min,  1 user,  load average: 0.08, 0.12, 0.09`,
        };
      }

      if (shellCmd.startsWith('su')) {
        if (!activeDev.isRooted) {
          return { output: 'Permission denied: Device is not rooted in settings.', isError: true };
        }
        return { output: 'root@nanodroid_x86_64:/ # Root shell granted.' };
      }

      return {
        output: `nanodroid_x86_64:/ $ ${shellCmd}\nCommand executed successfully with return code 0.`,
      };
    }

    // adb logcat
    if (sub === 'logcat') {
      return {
        output: `--------- beginning of main
09:15:02.102  1420  1420 I ActivityManager: Start proc 3810:com.nanodroid.notes/u0a102 for activity
09:15:02.340  1420  1422 D NanoRuntime: GPU Acceleration: EGL Context created using Host OpenGL 4.6
09:15:02.510  1840  1840 I SystemUI: StatusBar state updated: Signal=WiFi 5GHz, Battery=88%
09:15:03.011  2100  2105 W InputMethodManager: Soft keyboard animation frame dropped by 2ms
09:15:04.119   500   500 D AdbDaemon: Client connection accepted on localhost:5555`,
      };
    }

    // adb reverse
    if (sub === 'reverse') {
      return {
        output: `Host reverse port forwarding rule added: ${parts.slice(2).join(' ')} -> OK`,
      };
    }

    // adb reboot
    if (sub === 'reboot') {
      return {
        output: `Rebooting target Android device... System soft restart complete in 1.4 seconds.`,
      };
    }

    // adb push / pull
    if (sub === 'push' || sub === 'pull') {
      const src = parts[2] || 'file.txt';
      const dest = parts[3] || '/sdcard/Download/';
      return {
        output: `${sub.toUpperCase()}: 1 file pushed. 2.4 MB/s (14208 bytes in 0.005s)`,
      };
    }

    // adb tcpip
    if (sub === 'tcpip') {
      const port = parts[2] || '5555';
      return {
        output: `restarting in TCP mode port: ${port}`,
      };
    }

    // adb kill-server / start-server
    if (sub === 'kill-server') {
      return { output: 'ADB daemon terminated.' };
    }
    if (sub === 'start-server') {
      return { output: '* daemon not running; starting now at tcp:5037\n* daemon started successfully' };
    }

    return {
      output: `adb: unknown command '${sub}'. Type 'adb help' for options.`,
      isError: true,
    };
  }
}
