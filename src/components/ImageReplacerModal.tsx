import React, { useState } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Check,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { DetectedImage } from '../types/newsletter';
import { PRESET_IMAGES } from '../utils/svgAssets';

interface ImageReplacerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetImage: DetectedImage | null;
  onSave: (
    targetImage: DetectedImage,
    newUrl: string,
    newAlt?: string,
    newAlign?: 'left' | 'center' | 'right'
  ) => void;
}

export const ImageReplacerModal: React.FC<ImageReplacerModalProps> = ({
  isOpen,
  onClose,
  targetImage,
  onSave,
}) => {
  if (!isOpen || !targetImage) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageUrl, setImageUrl] = useState<string>(targetImage.url);
  const [altText, setAltText] = useState<string>(targetImage.alt || '');
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageUrl(result);
        if (!altText) {
          setAltText(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageUrl(result);
        if (!altText) {
          setAltText(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (imageUrl) {
      onSave(targetImage, imageUrl, altText, align);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              Replace Newsletter Image
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Editing: <span className="text-neutral-300 font-medium">{targetImage.blockTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-800 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Paste Image URL
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Curated Presets ({PRESET_IMAGES.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Tab 1: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-xl p-8 text-center bg-neutral-950/40 transition-colors group cursor-pointer relative"
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-full bg-neutral-800 group-hover:bg-amber-500/20 text-neutral-300 group-hover:text-amber-400 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-neutral-200">
                  Drag and drop a new image here, or <span className="text-amber-400 underline">browse</span>
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Supports JPG, PNG, WEBP, or SVG. Embeds as base64 for seamless email export.
                </p>
                {fileName && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300">
                    <Check className="w-3.5 h-3.5" />
                    <span>{fileName}</span>
                    <span className="text-neutral-400">({fileSize})</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Direct Image URL</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com/images/villa-pool.jpg"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1.5">
                  Paste any public HTTPS image link. Ensure CORS or email client access is permitted.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Curated Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">
                Select high-definition architectural and editorial artwork inspired by luxury estates:
              </p>
              <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected = imageUrl === preset.dataUri;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.dataUri);
                        setAltText(preset.name);
                      }}
                      className={`text-left p-2.5 rounded-lg border transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                      }`}
                    >
                      <div className="aspect-video w-full rounded overflow-hidden bg-neutral-900 mb-2 border border-neutral-800">
                        <img
                          src={preset.dataUri}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-xs font-semibold text-neutral-200 truncate">{preset.name}</div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1">{preset.description}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 text-neutral-900 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Common Image Properties */}
          <div className="border-t border-neutral-800 pt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Alt Text (Accessibility & SEO)</label>
              <input
                type="text"
                placeholder="Description of the image for screen readers"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Image Alignment Buttons */}
            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1 flex items-center justify-between">
                <span>Image Alignment</span>
                <span className="text-[10px] text-amber-400 capitalize">{align}</span>
              </label>
              <div className="flex rounded-lg border border-neutral-800 bg-neutral-950 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setAlign('left')}
                  className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 text-xs rounded-md transition-all font-medium ${
                    align === 'left'
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Left</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAlign('center')}
                  className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 text-xs rounded-md transition-all font-medium ${
                    align === 'center'
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                  <span>Center</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAlign('right')}
                  className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 text-xs rounded-md transition-all font-medium ${
                    align === 'right'
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                  <span>Right</span>
                </button>
              </div>
            </div>

            {/* Live Preview Thumbnail */}
            {imageUrl && (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Selected Image Preview</label>
                <div
                  className="w-full max-h-48 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 flex p-2"
                  style={{
                    justifyContent:
                      align === 'center'
                        ? 'center'
                        : align === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                  }}
                >
                  <img src={imageUrl} alt={altText || 'Preview'} className="max-h-44 max-w-full object-contain rounded" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!imageUrl}
            className="px-5 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
          >
            Apply Image Replacement
          </button>
        </div>
      </div>
    </div>
  );
};
