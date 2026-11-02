import React, { useState } from 'react';
import {
  Sliders,
  Settings2,
  Image as ImageIcon,
  Replace,
  Type,
  Palette,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { DetectedImage, NewsletterBlock, NewsletterMetadata } from '../types/newsletter';

interface InspectorPanelProps {
  selectedBlock: NewsletterBlock | null;
  onUpdateBlock: (updated: NewsletterBlock) => void;
  metadata: NewsletterMetadata;
  onUpdateMetadata: (updated: NewsletterMetadata) => void;
  onOpenImageReplacer: (img: DetectedImage) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  metadata,
  onUpdateMetadata,
  onOpenImageReplacer,
}) => {
  const [activeTab, setActiveTab] = useState<'block' | 'metadata'>('block');

  return (
    <aside className="w-80 border-l border-neutral-800 bg-neutral-950 flex flex-col shrink-0 overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex items-center border-b border-neutral-800 p-2 bg-neutral-900/60">
        <button
          onClick={() => setActiveTab('block')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'block'
              ? 'bg-neutral-800 text-neutral-100 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Block Content</span>
        </button>

        <button
          onClick={() => setActiveTab('metadata')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'metadata'
              ? 'bg-neutral-800 text-neutral-100 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Email Meta</span>
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {activeTab === 'block' && (
          <>
            {!selectedBlock ? (
              <div className="text-center py-16 text-neutral-500 text-xs">
                <Sliders className="w-6 h-6 mx-auto mb-2 opacity-40" />
                Select any section in the preview or sidebar to edit its properties, text, and images.
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="font-semibold text-neutral-200 uppercase tracking-wider text-[11px]">
                    {selectedBlock.type} Block
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">{selectedBlock.id}</span>
                </div>

                {/* Render Block-Specific Form Controls */}
                {renderBlockControls(selectedBlock, onUpdateBlock, onOpenImageReplacer)}
              </div>
            )}
          </>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4 text-xs">
            <div className="pb-2 border-b border-neutral-800 font-semibold text-neutral-200 uppercase tracking-wider text-[11px]">
              Global Email Settings
            </div>

            {/* Email Subject */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Inbox Subject Line</label>
              <input
                type="text"
                value={metadata.subject}
                onChange={(e) => onUpdateMetadata({ ...metadata, subject: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Displayed in recipient inboxes (Gmail, Apple Mail)</p>
            </div>

            {/* Preheader Snippet */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Preheader Preview Snippet</label>
              <textarea
                rows={2}
                value={metadata.preheader}
                onChange={(e) => onUpdateMetadata({ ...metadata, preheader: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Teaser text shown right beside the subject line</p>
            </div>

            {/* Sender Name & Email */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Sender Name</label>
                <input
                  type="text"
                  value={metadata.senderName}
                  onChange={(e) => onUpdateMetadata({ ...metadata, senderName: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Sender Email</label>
                <input
                  type="email"
                  value={metadata.senderEmail}
                  onChange={(e) => onUpdateMetadata({ ...metadata, senderEmail: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium flex items-center justify-between">
                <span>Theme Accent Color</span>
                <span className="font-mono text-[11px] text-neutral-300">{metadata.accentColor}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={metadata.accentColor}
                  onChange={(e) => onUpdateMetadata({ ...metadata, accentColor: e.target.value })}
                  className="w-8 h-8 rounded border border-neutral-700 bg-neutral-900 cursor-pointer p-0.5"
                />
                <div className="flex items-center gap-1.5 flex-1">
                  {['#934b35', '#2563eb', '#059669', '#d97706', '#1c1917'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onUpdateMetadata({ ...metadata, accentColor: c })}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded border transition-transform ${
                        metadata.accentColor === c ? 'scale-110 border-white' : 'border-neutral-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Typography Persona</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateMetadata({ ...metadata, fontFamily: 'serif' })}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    metadata.fontFamily === 'serif'
                      ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <div className="font-serif-editorial text-sm font-semibold text-neutral-200">Editorial Serif</div>
                  <div className="text-[10px] text-neutral-400">Luxury, Architectural, Classic</div>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateMetadata({ ...metadata, fontFamily: 'sans' })}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    metadata.fontFamily === 'sans'
                      ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <div className="font-sans text-sm font-semibold text-neutral-200">Modern Sans</div>
                  <div className="text-[10px] text-neutral-400">Clean, Tech, Corporate</div>
                </button>
              </div>
            </div>

            {/* Container Max Width */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium flex items-center justify-between">
                <span>Container Width</span>
                <span className="font-mono text-neutral-300">{metadata.maxWidth}px</span>
              </label>
              <input
                type="range"
                min={580}
                max={740}
                step={20}
                value={metadata.maxWidth}
                onChange={(e) => onUpdateMetadata({ ...metadata, maxWidth: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>580px (Standard)</span>
                <span>680px (Vianaar Standard)</span>
                <span>740px (Wide)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

function renderBlockControls(
  block: NewsletterBlock,
  onUpdate: (b: NewsletterBlock) => void,
  onOpenImageReplacer: (img: DetectedImage) => void
) {
  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-3">
          <div>
            <label className="text-neutral-400 block mb-1">Brand Wordmark</label>
            <input
              type="text"
              value={block.brandName}
              onChange={(e) => onUpdate({ ...block, brandName: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Sub-Header</label>
            <input
              type="text"
              value={block.subHeader}
              onChange={(e) => onUpdate({ ...block, subHeader: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Edition / Issue Badge</label>
            <input
              type="text"
              value={block.editionNo}
              onChange={(e) => onUpdate({ ...block, editionNo: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Website URL</label>
            <input
              type="url"
              value={block.websiteUrl || ''}
              onChange={(e) => onUpdate({ ...block, websiteUrl: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      );

    case 'hero':
      return (
        <div className="space-y-3">
          {/* Image Replace Card */}
          <div className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Hero Image</span>
              <button
                type="button"
                onClick={() =>
                  onOpenImageReplacer({
                    id: `${block.id}-hero`,
                    blockId: block.id,
                    blockTitle: block.headline || 'Hero Section',
                    blockType: block.type,
                    fieldKey: 'imageUrl',
                    url: block.imageUrl,
                    alt: block.imageAlt,
                    caption: block.imageCaption,
                  })
                }
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30"
              >
                <Replace className="w-3 h-3" /> Replace
              </button>
            </div>
            {block.imageUrl && (
              <div className="w-full aspect-video rounded overflow-hidden bg-neutral-950 border border-neutral-800">
                <img src={block.imageUrl} alt={block.imageAlt} className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="text"
              placeholder="Image caption (optional)"
              value={block.imageCaption || ''}
              onChange={(e) => onUpdate({ ...block, imageCaption: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-[11px] text-neutral-200"
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Section Kicker</label>
            <input
              type="text"
              value={block.kicker}
              onChange={(e) => onUpdate({ ...block, kicker: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Headline</label>
            <input
              type="text"
              value={block.headline}
              onChange={(e) => onUpdate({ ...block, headline: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Subtitle / Summary</label>
            <textarea
              rows={3}
              value={block.subtitle}
              onChange={(e) => onUpdate({ ...block, subtitle: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-neutral-400 block mb-1">CTA Button Text</label>
              <input
                type="text"
                value={block.ctaText || ''}
                onChange={(e) => onUpdate({ ...block, ctaText: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-100"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">CTA Link URL</label>
              <input
                type="text"
                value={block.ctaUrl || ''}
                onChange={(e) => onUpdate({ ...block, ctaUrl: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-100"
              />
            </div>
          </div>
        </div>
      );

    case 'letter':
      return (
        <div className="space-y-3">
          <div>
            <label className="text-neutral-400 block mb-1">Kicker</label>
            <input
              type="text"
              value={block.kicker}
              onChange={(e) => onUpdate({ ...block, kicker: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Headline</label>
            <input
              type="text"
              value={block.headline}
              onChange={(e) => onUpdate({ ...block, headline: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-neutral-400 block mb-1">Author Name</label>
              <input
                type="text"
                value={block.authorName}
                onChange={(e) => onUpdate({ ...block, authorName: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Author Title</label>
              <input
                type="text"
                value={block.authorTitle}
                onChange={(e) => onUpdate({ ...block, authorTitle: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
              />
            </div>
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Paragraph 1</label>
            <textarea
              rows={3}
              value={block.paragraphs[0] || ''}
              onChange={(e) => {
                const next = [...block.paragraphs];
                next[0] = e.target.value;
                onUpdate({ ...block, paragraphs: next });
              }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Paragraph 2</label>
            <textarea
              rows={3}
              value={block.paragraphs[1] || ''}
              onChange={(e) => {
                const next = [...block.paragraphs];
                next[1] = e.target.value;
                onUpdate({ ...block, paragraphs: next });
              }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>
        </div>
      );

    case 'two-column':
      return (
        <div className="space-y-3">
          {/* Image Replace */}
          <div className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Feature Image</span>
              <button
                type="button"
                onClick={() =>
                  onOpenImageReplacer({
                    id: `${block.id}-img`,
                    blockId: block.id,
                    blockTitle: block.headline || '2-Column Feature',
                    blockType: block.type,
                    fieldKey: 'imageUrl',
                    url: block.imageUrl,
                    alt: block.imageAlt,
                    caption: block.imageCaption,
                  })
                }
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30"
              >
                <Replace className="w-3 h-3" /> Replace
              </button>
            </div>
            {block.imageUrl && (
              <div className="w-full aspect-video rounded overflow-hidden bg-neutral-950 border border-neutral-800">
                <img src={block.imageUrl} alt={block.imageAlt} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Headline</label>
            <input
              type="text"
              value={block.headline}
              onChange={(e) => onUpdate({ ...block, headline: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Description</label>
            <textarea
              rows={3}
              value={block.description}
              onChange={(e) => onUpdate({ ...block, description: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Image Alignment</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ ...block, imageSide: 'left' })}
                className={`py-1 text-xs rounded border ${
                  block.imageSide === 'left'
                    ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                Image Left
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ ...block, imageSide: 'right' })}
                className={`py-1 text-xs rounded border ${
                  block.imageSide === 'right'
                    ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                Image Right
              </button>
            </div>
          </div>
        </div>
      );

    case 'three-column':
      return (
        <div className="space-y-3">
          <div>
            <label className="text-neutral-400 block mb-1">Section Headline</label>
            <input
              type="text"
              value={block.headline}
              onChange={(e) => onUpdate({ ...block, headline: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="text-neutral-400 font-medium block">Columns ({block.items.length})</span>
            {block.items.map((item, idx) => (
              <div key={item.id} className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-300">Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenImageReplacer({
                        id: `${block.id}-item-${idx}`,
                        blockId: block.id,
                        blockTitle: item.title || `Item ${idx + 1}`,
                        blockType: block.type,
                        fieldKey: 'items',
                        index: idx,
                        url: item.imageUrl,
                        alt: item.imageAlt,
                      })
                    }
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-amber-400 bg-amber-500/10 rounded border border-amber-500/30"
                  >
                    <Replace className="w-3 h-3" /> Image
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const next = [...block.items];
                    next[idx] = { ...item, title: e.target.value };
                    onUpdate({ ...block, items: next });
                  }}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-100"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case 'button-block':
      return (
        <div className="space-y-3">
          <div>
            <label className="text-neutral-400 block mb-1">Button Label</label>
            <input
              type="text"
              value={block.buttonText}
              onChange={(e) => onUpdate({ ...block, buttonText: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Link URL or Anchor</label>
            <input
              type="text"
              value={block.buttonUrl}
              onChange={(e) => onUpdate({ ...block, buttonUrl: e.target.value })}
              placeholder="https://... or #section-id"
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-neutral-400 block mb-1">Button Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={block.buttonBg || '#f59e0b'}
                  onChange={(e) => onUpdate({ ...block, buttonBg: e.target.value })}
                  className="w-7 h-7 rounded border border-neutral-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={block.buttonBg || '#f59e0b'}
                  onChange={(e) => onUpdate({ ...block, buttonBg: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Alignment</label>
              <select
                value={block.align || 'center'}
                onChange={(e) => onUpdate({ ...block, align: e.target.value as any })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-200"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="full">Full Width</option>
              </select>
            </div>
          </div>
        </div>
      );

    case 'image-block':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-neutral-400">Image Source</label>
            <button
              type="button"
              onClick={() =>
                onOpenImageReplacer({
                  id: `${block.id}-img`,
                  blockId: block.id,
                  blockTitle: block.title || 'Image Banner',
                  blockType: block.type,
                  fieldKey: 'imageUrl',
                  url: block.imageUrl,
                  alt: block.imageAlt,
                  caption: block.caption,
                })
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded shadow"
            >
              <Replace className="w-3.5 h-3.5" /> Replace Photo
            </button>
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Alt Text</label>
            <input
              type="text"
              value={block.imageAlt}
              onChange={(e) => onUpdate({ ...block, imageAlt: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Optional Caption</label>
            <input
              type="text"
              value={block.caption || ''}
              onChange={(e) => onUpdate({ ...block, caption: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Clickable Link URL</label>
            <input
              type="text"
              value={block.linkUrl || ''}
              onChange={(e) => onUpdate({ ...block, linkUrl: e.target.value })}
              placeholder="https://... or #section-id"
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 font-mono"
            />
          </div>
        </div>
      );

    case 'spacer-block':
      return (
        <div className="space-y-3">
          <div>
            <label className="text-neutral-400 block mb-1">
              Spacer Height: {block.height || 30}px
            </label>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={block.height || 30}
              onChange={(e) => onUpdate({ ...block, height: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
          <div className="flex gap-1.5">
            {[10, 20, 30, 40, 60, 80].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => onUpdate({ ...block, height: h })}
                className={`flex-1 py-1 text-xs rounded border font-mono ${
                  (block.height || 30) === h
                    ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                }`}
              >
                {h}px
              </button>
            ))}
          </div>
        </div>
      );

    case 'divider-block':
      return (
        <div className="space-y-3">
          <div>
            <label className="text-neutral-400 block mb-1">Line Style</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['solid', 'dashed', 'dotted', 'double'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdate({ ...block, dividerStyle: st })}
                  className={`py-1 text-xs capitalize rounded border font-medium ${
                    (block.dividerStyle || 'solid') === st
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-neutral-400 block mb-1">Width (%)</label>
              <input
                type="number"
                min="10"
                max="100"
                step="10"
                value={block.widthPercent || 100}
                onChange={(e) => onUpdate({ ...block, widthPercent: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-100"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Thickness (px)</label>
              <input
                type="number"
                min="1"
                max="6"
                value={block.thickness || 1}
                onChange={(e) => onUpdate({ ...block, thickness: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-100"
              />
            </div>
          </div>
        </div>
      );

    case 'callout-block':
      return (
        <div className="space-y-3">
          <div>
            <label className="text-neutral-400 block mb-1">Title</label>
            <input
              type="text"
              value={block.calloutTitle || ''}
              onChange={(e) => onUpdate({ ...block, calloutTitle: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Content</label>
            <textarea
              rows={4}
              value={block.content}
              onChange={(e) => onUpdate({ ...block, content: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-xs text-neutral-100"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ivory', name: 'Warm Ivory' },
                { id: 'amber', name: 'Amber' },
                { id: 'slate', name: 'Slate' },
                { id: 'dark', name: 'Dark Luxe' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onUpdate({ ...block, theme: t.id as any })}
                  className={`py-1.5 px-2 rounded border text-xs text-left ${
                    (block.theme || 'ivory') === t.id
                      ? 'bg-neutral-800 border-amber-500 text-amber-300'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case 'custom-html':
      return (
        <div className="space-y-3">
          <label className="text-neutral-400 block mb-1">Direct HTML Code</label>
          <textarea
            rows={8}
            value={block.htmlContent}
            onChange={(e) => onUpdate({ ...block, htmlContent: e.target.value })}
            className="w-full font-mono text-xs bg-neutral-900 border border-neutral-700 rounded p-2.5 text-neutral-200"
          />
        </div>
      );

    default:
      return <div className="text-neutral-500 text-xs">Section controls active. Click any text to edit directly.</div>;
  }
}
