import React, { useState } from 'react';
import { X, ExternalLink, Bookmark, Check, MousePointerClick, Palette } from 'lucide-react';
import { DocumentSectionTarget } from '../utils/sectionLinks';

export interface InsertButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (buttonHtml: string) => void;
  availableSections: DocumentSectionTarget[];
}

export const InsertButtonModal: React.FC<InsertButtonModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  availableSections,
}) => {
  if (!isOpen) return null;

  const [text, setText] = useState('Explore Now');
  const [linkType, setLinkType] = useState<'url' | 'anchor'>('url');
  const [url, setUrl] = useState('https://');
  const [selectedAnchor, setSelectedAnchor] = useState<string>(
    availableSections[0] ? `#${availableSections[0].id}` : '#'
  );

  // Button styling
  const [theme, setTheme] = useState<'gold' | 'black' | 'terracotta' | 'emerald' | 'navy' | 'outline'>('gold');
  const [customBg, setCustomBg] = useState('#f59e0b');
  const [customText, setCustomText] = useState('#171717');
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [radius, setRadius] = useState<'pill' | 'rounded' | 'square'>('rounded');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [align, setAlign] = useState<'left' | 'center' | 'right' | 'full'>('center');

  const THEMES = [
    { id: 'gold', name: 'Luxury Amber', bg: '#f59e0b', text: '#171717', border: '#f59e0b' },
    { id: 'black', name: 'Obsidian Black', bg: '#171717', text: '#ffffff', border: '#171717' },
    { id: 'terracotta', name: 'Terracotta', bg: '#934b35', text: '#ffffff', border: '#934b35' },
    { id: 'emerald', name: 'Forest Emerald', bg: '#065f46', text: '#ffffff', border: '#065f46' },
    { id: 'navy', name: 'Royal Navy', bg: '#1e3a8a', text: '#ffffff', border: '#1e3a8a' },
    { id: 'outline', name: 'Ghost Outline', bg: '#ffffff', text: '#171717', border: '#737373' },
  ];

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];
  const activeBg = useCustomColors ? customBg : currentTheme.bg;
  const activeText = useCustomColors ? customText : currentTheme.text;
  const activeBorder = useCustomColors ? customBg : currentTheme.border;

  const radiusCss = radius === 'pill' ? '9999px' : radius === 'square' ? '0px' : '6px';
  const paddingCss =
    size === 'sm' ? '8px 18px' : size === 'lg' ? '16px 36px' : '12px 28px';
  const fontSizeCss = size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px';

  const targetHref = linkType === 'anchor' ? selectedAnchor : url || '#';

  const handleApply = () => {
    // Generate email-client bulletproof table button for 100% email client compatibility
    const alignAttr = align === 'full' ? 'center' : align;
    const tableWidth = align === 'full' ? 'width="100%"' : '';
    const tableMargin =
      align === 'center'
        ? 'margin: 20px auto;'
        : align === 'right'
        ? 'margin: 20px 0 20px auto;'
        : 'margin: 20px 0;';

    const buttonHtml = `
<!-- Brevo-style Call-to-Action Button -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" ${tableWidth} style="${tableMargin} border-collapse: separate;">
  <tr>
    <td align="${alignAttr}" style="border-radius: ${radiusCss}; background-color: ${activeBg};">
      <a href="${targetHref}" target="_blank" rel="noopener noreferrer" style="display: ${align === 'full' ? 'block' : 'inline-block'}; padding: ${paddingCss}; font-size: ${fontSizeCss}; color: ${activeText}; background-color: ${activeBg}; font-weight: 600; text-decoration: none; text-align: center; border-radius: ${radiusCss}; border: 1px solid ${activeBorder}; letter-spacing: 0.05em; text-transform: uppercase;">
        ${text || 'Click Here'}
      </a>
    </td>
  </tr>
</table>
`.trim();

    onInsert(buttonHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Add Call-to-Action Button</h3>
              <p className="text-[11px] text-neutral-400">
                Brevo-compatible bulletproof email button for links or section jumps
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Live Preview Box */}
          <div className="p-6 rounded-lg bg-stone-100 border border-stone-300 text-center flex flex-col items-center justify-center min-h-[100px]">
            <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 font-medium">
              Live Button Preview
            </div>
            <div className="w-full flex justify-center" style={{ textAlign: align === 'full' ? 'center' : align }}>
              <span
                style={{
                  backgroundColor: activeBg,
                  color: activeText,
                  borderRadius: radiusCss,
                  padding: paddingCss,
                  fontSize: fontSizeCss,
                  border: `1px solid ${activeBorder}`,
                  width: align === 'full' ? '100%' : 'auto',
                  display: align === 'full' ? 'block' : 'inline-block',
                }}
                className="font-semibold uppercase tracking-wider shadow-sm transition-all"
              >
                {text || 'Button Label'}
              </span>
            </div>
          </div>

          {/* 1. Button Label */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Button Text / Label
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Read Full Story, Explore Now, Book a Visit"
              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* 2. Destination (URL or Anchor Jump) */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Click Destination
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setLinkType('url')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  linkType === 'url'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Web URL</span>
              </button>
              <button
                type="button"
                onClick={() => setLinkType('anchor')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  linkType === 'anchor'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Jump to Section</span>
              </button>
            </div>

            {linkType === 'url' ? (
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/newsletter/article"
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
              />
            ) : (
              <select
                value={selectedAnchor}
                onChange={(e) => setSelectedAnchor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {availableSections.length === 0 ? (
                  <option value="#newsletter-top">Top of Newsletter (#newsletter-top)</option>
                ) : (
                  availableSections.map((sec) => (
                    <option key={sec.id} value={`#${sec.id}`}>
                      #{sec.id} — {sec.title}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          {/* 3. Color Theme Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-300">
                Color Palette Presets
              </label>
              <button
                type="button"
                onClick={() => setUseCustomColors(!useCustomColors)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <Palette className="w-3 h-3" />
                {useCustomColors ? 'Use Presets' : 'Custom Colors'}
              </button>
            </div>

            {!useCustomColors ? (
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id as any)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-colors ${
                      theme === t.id
                        ? 'bg-neutral-800 border-amber-500 text-neutral-100 ring-1 ring-amber-500/40'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: t.bg, borderColor: t.border }}
                      className="w-4 h-4 rounded-full border shrink-0"
                    />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customBg}
                      onChange={(e) => setCustomBg(e.target.value)}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customBg}
                      onChange={(e) => setCustomBg(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-neutral-100 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-neutral-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Shape, Size, and Alignment */}
          <div className="grid grid-cols-3 gap-3">
            {/* Shape */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Corner Radius</label>
              <div className="flex rounded-lg border border-neutral-800 bg-neutral-950 p-0.5">
                {(['rounded', 'pill', 'square'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    className={`flex-1 py-1 text-[11px] capitalize rounded font-medium transition-colors ${
                      radius === r
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Button Size</label>
              <div className="flex rounded-lg border border-neutral-800 bg-neutral-950 p-0.5">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-1 text-[11px] uppercase rounded font-medium transition-colors ${
                      size === s
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Alignment */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Alignment</label>
              <div className="flex rounded-lg border border-neutral-800 bg-neutral-950 p-0.5">
                {(['left', 'center', 'right', 'full'] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAlign(a)}
                    className={`flex-1 py-1 text-[11px] capitalize rounded font-medium transition-colors ${
                      align === a
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {a === 'full' ? 'Full' : a[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
            className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Insert Button</span>
          </button>
        </div>
      </div>
    </div>
  );
};
