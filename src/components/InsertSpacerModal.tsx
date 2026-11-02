import React, { useState } from 'react';
import { X, Check, Space, Minus, Sparkles } from 'lucide-react';

export interface InsertSpacerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (spacerHtml: string) => void;
}

export const InsertSpacerModal: React.FC<InsertSpacerModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'spacer' | 'divider'>('spacer');

  // Spacer options
  const [spacerHeight, setSpacerHeight] = useState<number>(30);
  const [spacerBg, setSpacerBg] = useState<'transparent' | '#ffffff' | '#faf5ee' | '#f4f4f5' | '#171717'>('transparent');

  // Divider options
  const [dividerStyle, setDividerStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double'>('solid');
  const [dividerThickness, setDividerThickness] = useState<number>(1);
  const [dividerColor, setDividerColor] = useState<string>('#e5e7eb');
  const [dividerWidth, setDividerWidth] = useState<number>(100);
  const [dividerMargin, setDividerMargin] = useState<number>(20);

  const HEIGHT_PRESETS = [10, 20, 30, 40, 60, 80];
  const COLOR_PRESETS = [
    { label: 'Subtle Gray', value: '#e5e7eb' },
    { label: 'Medium Gray', value: '#9ca3af' },
    { label: 'Luxury Gold', value: '#f59e0b' },
    { label: 'Terracotta', value: '#934b35' },
    { label: 'Dark Charcoal', value: '#262626' },
    { label: 'Pure Black', value: '#000000' },
  ];

  const handleApply = () => {
    let generatedHtml = '';

    if (mode === 'spacer') {
      // Email-safe bulletproof spacer
      const bgCss = spacerBg !== 'transparent' ? `background-color: ${spacerBg};` : '';
      generatedHtml = `
<!-- Brevo-style Email Spacer -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="${bgCss}">
  <tr>
    <td height="${spacerHeight}" style="font-size: 1px; line-height: ${spacerHeight}px; height: ${spacerHeight}px; mso-line-height-rule: exactly; ${bgCss}">
      &nbsp;
    </td>
  </tr>
</table>
`.trim();
    } else {
      // Email-safe bulletproof divider line
      generatedHtml = `
<!-- Brevo-style Email Divider -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: ${dividerMargin}px 0;">
  <tr>
    <td align="center">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${dividerWidth}%" style="width: ${dividerWidth}%;">
        <tr>
          <td style="border-top: ${dividerThickness}px ${dividerStyle} ${dividerColor}; font-size: 1px; line-height: 1px; height: 1px;">
            &nbsp;
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
    }

    onInsert(generatedHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              {mode === 'spacer' ? <Space className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Add Space or Divider Line</h3>
              <p className="text-[11px] text-neutral-400">
                Brevo-compatible spacing elements to organize newsletter sections
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

        {/* Mode Switcher */}
        <div className="px-6 pt-4 border-b border-neutral-800">
          <div className="grid grid-cols-2 gap-2 pb-4">
            <button
              type="button"
              onClick={() => setMode('spacer')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border transition-all ${
                mode === 'spacer'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Space className="w-3.5 h-3.5" />
              <span>Empty Spacer</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('divider')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border transition-all ${
                mode === 'divider'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Divider Line</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Live Preview Box */}
          <div className="p-4 rounded-lg bg-stone-100 border border-stone-300 text-center">
            <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 font-medium">
              Live Preview
            </div>
            <div className="w-full bg-white rounded border border-dashed border-stone-300 p-2 overflow-hidden flex flex-col justify-center">
              {mode === 'spacer' ? (
                <div
                  style={{
                    height: `${spacerHeight}px`,
                    backgroundColor: spacerBg === 'transparent' ? '#f4efe9' : spacerBg,
                  }}
                  className="w-full flex items-center justify-center text-[10px] text-stone-400 font-mono transition-all"
                >
                  {spacerHeight}px vertical space
                </div>
              ) : (
                <div style={{ padding: `${dividerMargin / 2}px 0` }}>
                  <div
                    style={{
                      width: `${dividerWidth}%`,
                      margin: '0 auto',
                      borderTop: `${dividerThickness}px ${dividerStyle} ${dividerColor}`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {mode === 'spacer' ? (
            /* Spacer Controls */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Spacer Height: {spacerHeight}px
                </label>
                <div className="grid grid-cols-6 gap-1.5 mb-2">
                  {HEIGHT_PRESETS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSpacerHeight(h)}
                      className={`py-1.5 text-xs rounded border font-mono font-medium transition-colors ${
                        spacerHeight === h
                          ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      {h}px
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={spacerHeight}
                  onChange={(e) => setSpacerHeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Background Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Transparent', val: 'transparent' },
                    { label: 'White', val: '#ffffff' },
                    { label: 'Cream', val: '#faf5ee' },
                    { label: 'Soft Gray', val: '#f4f4f5' },
                    { label: 'Dark', val: '#171717' },
                  ].map((bg) => (
                    <button
                      key={bg.val}
                      type="button"
                      onClick={() => setSpacerBg(bg.val as any)}
                      className={`p-2 rounded-lg border text-center text-xs transition-colors ${
                        spacerBg === bg.val
                          ? 'bg-neutral-800 border-amber-500 text-neutral-100 ring-1 ring-amber-500/40'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div
                        style={{ backgroundColor: bg.val === 'transparent' ? '#333' : bg.val }}
                        className="w-full h-4 rounded mb-1 border border-neutral-700 mx-auto"
                      />
                      <span className="text-[10px] block truncate">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Divider Controls */
            <div className="space-y-4">
              {/* Line Style */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Line Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['solid', 'dashed', 'dotted', 'double'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDividerStyle(st)}
                      className={`py-1.5 text-xs capitalize rounded border font-medium transition-colors ${
                        dividerStyle === st
                          ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Color Presets */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Line Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setDividerColor(c.value)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-colors ${
                        dividerColor === c.value
                          ? 'bg-neutral-800 border-amber-500 text-neutral-100 ring-1 ring-amber-500/40'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: c.value }}
                        className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0"
                      />
                      <span className="text-[11px] truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Width & Spacing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Width: {dividerWidth}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="10"
                    value={dividerWidth}
                    onChange={(e) => setDividerWidth(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Thickness: {dividerThickness}px
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((th) => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setDividerThickness(th)}
                        className={`flex-1 py-1 text-xs rounded border font-mono ${
                          dividerThickness === th
                            ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                        }`}
                      >
                        {th}px
                      </button>
                    ))}
                  </div>
                </div>
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
            className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Insert {mode === 'spacer' ? 'Space' : 'Divider'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
