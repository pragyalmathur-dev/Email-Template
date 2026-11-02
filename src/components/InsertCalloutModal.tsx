import React, { useState } from 'react';
import { X, Check, MessageSquareQuote, Sparkles } from 'lucide-react';

export interface InsertCalloutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (calloutHtml: string) => void;
}

export const InsertCalloutModal: React.FC<InsertCalloutModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('NOTE FROM THE EDITORS');
  const [content, setContent] = useState(
    'Natural materials and balanced proportions are at the heart of our craft. Every edition explores stories from our community.'
  );
  const [theme, setTheme] = useState<'ivory' | 'amber' | 'slate' | 'dark'>('ivory');

  const THEMES = [
    {
      id: 'ivory',
      name: 'Warm Ivory',
      bg: '#faf5ee',
      border: '#934b35',
      text: '#44403c',
      titleColor: '#934b35',
    },
    {
      id: 'amber',
      name: 'Amber Glow',
      bg: '#fffbeb',
      border: '#f59e0b',
      text: '#78350f',
      titleColor: '#b45309',
    },
    {
      id: 'slate',
      name: 'Subtle Slate',
      bg: '#f8fafc',
      border: '#64748b',
      text: '#334155',
      titleColor: '#0f172a',
    },
    {
      id: 'dark',
      name: 'Luxury Charcoal',
      bg: '#1c1917',
      border: '#f59e0b',
      text: '#e7e5e4',
      titleColor: '#f59e0b',
    },
  ];

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  const handleApply = () => {
    const calloutHtml = `
<!-- Brevo-style Callout Box -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
  <tr>
    <td style="background-color: ${currentTheme.bg}; border-left: 4px solid ${currentTheme.border}; border-radius: 4px; padding: 18px 22px;">
      ${
        title
          ? `<div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; color: ${currentTheme.titleColor}; margin-bottom: 8px;">${title}</div>`
          : ''
      }
      <div style="font-size: 14px; line-height: 1.6; color: ${currentTheme.text};">
        ${content}
      </div>
    </td>
  </tr>
</table>
`.trim();

    onInsert(calloutHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Add Callout / Highlight Box</h3>
              <p className="text-[11px] text-neutral-400">
                Brevo-compatible callout card for editorial notes, quotes, or highlights
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Live Preview */}
          <div className="p-4 bg-stone-100 rounded-lg border border-stone-300">
            <div className="text-[10px] uppercase font-semibold text-stone-500 mb-2">
              Live Preview
            </div>
            <div
              style={{
                backgroundColor: currentTheme.bg,
                borderLeft: `4px solid ${currentTheme.border}`,
              }}
              className="p-4 rounded shadow-sm text-left transition-colors"
            >
              {title && (
                <div
                  style={{ color: currentTheme.titleColor }}
                  className="text-[10px] font-bold tracking-widest uppercase mb-1"
                >
                  {title}
                </div>
              )}
              <div
                style={{ color: currentTheme.text }}
                className="text-xs leading-relaxed font-normal"
              >
                {content || 'Callout content goes here...'}
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Color Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-colors ${
                    theme === t.id
                      ? 'bg-neutral-800 border-amber-500 text-neutral-100 ring-1 ring-amber-500/40'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span
                    style={{ backgroundColor: t.bg, borderColor: t.border }}
                    className="w-4 h-4 rounded border shrink-0"
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Callout Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NOTE FROM THE EDITORS, KEY TAKEAWAY"
              className="w-full px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase tracking-wider"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Message Text</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type callout or highlight content here..."
              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed"
            />
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
            <span>Insert Callout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
