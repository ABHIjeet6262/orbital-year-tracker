import React from 'react';
import { Monitor, Terminal, X, Check, ArrowRight } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstall?: () => void;
  canDirectInstall?: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstall,
  canDirectInstall,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyCommand = () => {
    navigator.clipboard.writeText('npm run electron:preview');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 text-stone-900 dark:text-stone-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <Monitor size={22} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              Install Desktop App
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Run offline on Windows without browser tabs
            </p>
          </div>
        </div>

        {/* Direct browser install button (if supported) */}
        {canDirectInstall && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                1-Click Browser Install Ready
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                Install directly to your desktop and start menu.
              </div>
            </div>
            <button
              onClick={() => {
                if (onTriggerInstall) onTriggerInstall();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Install</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Manual Browser Step Guide */}
        <div className="space-y-3.5 mb-5">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
            <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[11px] font-bold">1</span>
              <span>In Google Chrome / Brave:</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed pl-7">
              Click the <strong className="text-stone-800 dark:text-stone-200">three dots menu (⋮)</strong> at the top-right of your browser &rarr; <strong className="text-stone-800 dark:text-stone-200">Cast, save, and share</strong> &rarr; <strong className="text-stone-800 dark:text-stone-200">Install page as app...</strong> (or <em>Create shortcut &rarr; Open as window</em>).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
            <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[11px] font-bold">2</span>
              <span>In Microsoft Edge:</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed pl-7">
              Click <strong className="text-stone-800 dark:text-stone-200">...</strong> &rarr; <strong className="text-stone-800 dark:text-stone-200">Apps</strong> &rarr; <strong className="text-stone-800 dark:text-stone-200">Install Orbital Year</strong>.
            </p>
          </div>

          {/* Standalone Native Command */}
          <div className="p-3.5 rounded-2xl bg-stone-900 text-stone-100 dark:bg-black/80 border border-stone-800">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2 mb-1.5">
              <Terminal size={14} />
              <span>Or run Native Offline Window:</span>
            </div>
            <div className="flex items-center justify-between bg-stone-800/80 dark:bg-stone-900 px-3 py-2 rounded-xl text-xs font-mono text-emerald-300">
              <code>npm run electron:preview</code>
              <button
                onClick={copyCommand}
                className="ml-2 px-2 py-1 rounded-md bg-stone-700 hover:bg-stone-600 text-[10px] text-stone-200 transition-colors cursor-pointer"
              >
                {copied ? <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={11} /> Copied</span> : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
