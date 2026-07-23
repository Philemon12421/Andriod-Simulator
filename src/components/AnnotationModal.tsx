import React, { useState } from 'react';
import {
  Check,
  Copy,
  Crop,
  Download,
  Edit3,
  Image as ImageIcon,
  Square,
  Type,
  X,
} from 'lucide-react';

interface AnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
}

export const AnnotationModal: React.FC<AnnotationModalProps> = ({
  isOpen,
  onClose,
  deviceName,
}) => {
  const [activeTool, setActiveTool] = useState<'crop' | 'draw' | 'text'>('draw');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `NanoDroid_${deviceName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    link.href =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="680"><rect width="100%" height="100%" fill="%230f172a"/><text x="20" y="40" fill="%2310b981" font-family="monospace" font-size="16">NanoDroid Screenshot</text></svg>';
    link.click();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Screenshot Cropper & Annotator ({deviceName})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700/60 flex items-center space-x-2">
          <button
            onClick={() => setActiveTool('crop')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
              activeTool === 'crop'
                ? 'bg-emerald-500 text-white'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Crop</span>
          </button>

          <button
            onClick={() => setActiveTool('draw')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
              activeTool === 'draw'
                ? 'bg-emerald-500 text-white'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Draw</span>
          </button>

          <button
            onClick={() => setActiveTool('text')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
              activeTool === 'text'
                ? 'bg-emerald-500 text-white'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text Note</span>
          </button>
        </div>

        {/* Preview Canvas Box */}
        <div className="p-6 flex items-center justify-center bg-zinc-950">
          <div className="w-[220px] h-[380px] rounded-2xl bg-slate-900 border-2 border-emerald-500 p-4 flex flex-col justify-between text-white relative shadow-lg">
            <div className="text-[10px] font-mono text-emerald-400">
              Captured @ 60 FPS • {deviceName}
            </div>

            <div className="border border-dashed border-emerald-400 p-2 text-center text-xs font-mono text-emerald-300 bg-emerald-500/10 rounded">
              Annotated Frame Preview
            </div>

            <div className="text-[9px] text-zinc-500 text-center font-mono">
              AOSP Screenshot Captured
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Screenshot'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
