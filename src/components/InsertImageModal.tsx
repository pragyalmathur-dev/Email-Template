import React, { useState } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Bookmark,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { PRESET_IMAGES } from '../utils/svgAssets';
import { DocumentSectionTarget } from '../utils/sectionLinks';

export interface InsertImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageHtml: string) => void;
  availableSections: DocumentSectionTarget[];
}

export const InsertImageModal: React.FC<InsertImageModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  availableSections,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES[0]?.dataUri || '');
  const [altText, setAltText] = useState<string>('Newsletter photography');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  // Link
  const [hasLink, setHasLink] = useState(false);
  const [linkType, setLinkType] = useState<'url' | 'anchor'>('url');
  const [linkUrl, setLinkUrl] = useState('https://');
  const [selectedAnchor, setSelectedAnchor] = useState<string>(
    availableSections[0] ? `#${availableSections[0].id}` : '#'
  );

  // Layout & Alignment
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [widthMode, setWidthMode] = useState<'100%' | '80%' | '480px' | '280px'>('100%');
  const [radius, setRadius] = useState<'0px' | '4px' | '8px' | '16px'>('4px');

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
        if (!altText || altText === 'Newsletter photography') {
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
        if (!altText || altText === 'Newsletter photography') {
          setAltText(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!imageUrl) return;

    const targetLink = hasLink
      ? linkType === 'anchor'
        ? selectedAnchor
        : linkUrl
      : null;

    const marginCss =
      align === 'center'
        ? '0 auto'
        : align === 'right'
        ? '0 0 0 auto'
        : '0 auto 0 0';

    const imgTag = `<img src="${imageUrl}" alt="${altText || 'Newsletter Image'}" style="display: block; width: ${widthMode}; max-width: 100%; height: auto; border: 0; outline: none; border-radius: ${radius}; margin: ${marginCss}; cursor: pointer;" title="Click to replace this image" />`;

    const contentInsideTd = targetLink
      ? `<a href="${targetLink}" target="_blank" rel="noopener noreferrer" style="display: block; text-decoration: none; border: 0;">${imgTag}</a>`
      : imgTag;

    const emailSafeHtml = `
<!-- Brevo-style Newsletter Image Block -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 18px 0; border-collapse: collapse;">
  <tr>
    <td align="${align}" style="padding: 0;">
      ${contentInsideTd}
    </td>
  </tr>
</table>
`.trim();

    onInsert(emailSafeHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Add Image</h3>
              <p className="text-[11px] text-neutral-400">
                Insert a responsive email-ready image with upload, presets, or URL
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Device File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Direct Web URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'presets'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Presets</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tab 1: Upload */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-xl p-6 text-center bg-neutral-950/50 hover:bg-neutral-900/40 transition-colors flex flex-col items-center justify-center cursor-pointer relative"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-neutral-200">
                Click to browse photo or drag & drop here
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Supports PNG, JPEG, SVG, WebP (Automatically embedded for emails)
              </p>
              {fileName && (
                <div className="mt-3 px-3 py-1 bg-neutral-800 rounded-full text-xs text-amber-300 font-mono flex items-center gap-2">
                  <span>{fileName}</span>
                  <span className="text-[10px] text-neutral-400">({fileSize})</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: URL */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-300">
                Image Source URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-3 gap-3">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.dataUri);
                    setAltText(preset.name);
                  }}
                  className={`group relative rounded-lg overflow-hidden border text-left transition-all aspect-[4/3] ${
                    imageUrl === preset.dataUri
                      ? 'border-amber-500 ring-2 ring-amber-500/50'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={preset.dataUri}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] font-medium text-white truncate">
                      {preset.name}
                    </span>
                  </div>
                  {imageUrl === preset.dataUri && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Preview & Layout Options */}
          {imageUrl && (
            <div className="space-y-4 pt-2 border-t border-neutral-800">
              {/* Preview Thumbnail */}
              <div className="p-3 bg-stone-100 rounded-lg border border-stone-300">
                <div className="text-[10px] uppercase font-semibold text-stone-500 mb-1.5">
                  Image Preview
                </div>
                <div className="w-full flex justify-center" style={{ textAlign: align }}>
                  <img
                    src={imageUrl}
                    alt={altText}
                    style={{
                      width: widthMode,
                      borderRadius: radius,
                    }}
                    className="max-h-48 object-cover shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Alt Text (Screen Readers & Fallback)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image content..."
                  className="w-full px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Layout: Width, Alignment, Corner Radius */}
              <div className="grid grid-cols-3 gap-3">
                {/* Width */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Width</label>
                  <div className="grid grid-cols-2 gap-1">
                    {(['100%', '80%', '480px', '280px'] as const).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWidthMode(w)}
                        className={`py-1 text-[11px] rounded border font-mono font-medium ${
                          widthMode === w
                            ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Alignment Buttons */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1 flex items-center justify-between">
                    <span>Alignment</span>
                    <span className="text-[10px] text-amber-400 capitalize">{align}</span>
                  </label>
                  <div className="flex rounded-lg border border-neutral-800 bg-neutral-950 p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setAlign('left')}
                      className={`flex-1 py-1.5 px-1.5 flex items-center justify-center gap-1 text-xs rounded-md transition-all font-medium ${
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
                      className={`flex-1 py-1.5 px-1.5 flex items-center justify-center gap-1 text-xs rounded-md transition-all font-medium ${
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
                      className={`flex-1 py-1.5 px-1.5 flex items-center justify-center gap-1 text-xs rounded-md transition-all font-medium ${
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

                {/* Corner Radius */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Corners</label>
                  <div className="grid grid-cols-2 gap-1">
                    {(['0px', '4px', '8px', '16px'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRadius(r)}
                        className={`py-1 text-[11px] rounded border font-mono font-medium ${
                          radius === r
                            ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clickable Link (optional) */}
              <div className="pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasLink}
                      onChange={(e) => setHasLink(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Make Image Clickable (Attach Hyperlink)</span>
                  </label>
                </div>

                {hasLink && (
                  <div className="space-y-2 pl-5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLinkType('url')}
                        className={`px-3 py-1 text-xs rounded border ${
                          linkType === 'url'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        Web Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkType('anchor')}
                        className={`px-3 py-1 text-xs rounded border ${
                          linkType === 'anchor'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        Jump to Section
                      </button>
                    </div>

                    {linkType === 'url' ? (
                      <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono"
                      />
                    ) : (
                      <select
                        value={selectedAnchor}
                        onChange={(e) => setSelectedAnchor(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100"
                      >
                        {availableSections.map((s) => (
                          <option key={s.id} value={`#${s.id}`}>
                            #{s.id} — {s.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-900/90">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!imageUrl}
            className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Insert Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
