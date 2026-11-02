import React from 'react';
import { X, Image as ImageIcon, Replace, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DetectedImage } from '../types/newsletter';

interface AssetManagerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  images: DetectedImage[];
  onSelectImageToReplace: (img: DetectedImage) => void;
}

export const AssetManagerDrawer: React.FC<AssetManagerDrawerProps> = ({
  isOpen,
  onClose,
  images,
  onSelectImageToReplace,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
        <div>
          <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            Image Assets Directory
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {images.length} {images.length === 1 ? 'image slot' : 'image slots'} in current newsletter
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Info Banner */}
      <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Click <strong>Replace</strong> on any slot to upload your own photos or choose from luxury architectural presets.
        </span>
      </div>

      {/* Image list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {images.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No images currently detected in this newsletter.
          </div>
        ) : (
          images.map((img, idx) => (
            <div
              key={img.id || idx}
              className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 transition-all flex gap-3.5 items-start group"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0 relative">
                <img
                  src={img.url}
                  alt={img.alt || 'Asset'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-neutral-200 truncate">{img.blockTitle}</div>
                <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                  Slot: {img.fieldKey} {img.index !== undefined ? `#${img.index + 1}` : ''}
                </div>
                <div className="text-[11px] text-neutral-400 truncate mt-1">
                  Alt: {img.alt || '<No alt text>'}
                </div>

                <div className="mt-2.5">
                  <button
                    onClick={() => {
                      onSelectImageToReplace(img);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors"
                  >
                    <Replace className="w-3 h-3" />
                    Replace Image
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950 text-center text-xs text-neutral-400">
        All images are optimized for high-DPI displays & email clients.
      </div>
    </div>
  );
};
