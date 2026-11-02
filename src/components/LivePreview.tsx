import React, { useRef } from 'react';
import {
  Replace,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Mail,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { DetectedImage, NewsletterBlock, NewsletterDocument } from '../types/newsletter';
import { ViewportMode } from './Header';

interface LivePreviewProps {
  document: NewsletterDocument;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (updated: NewsletterBlock) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onDuplicateBlock: (index: number) => void;
  onDeleteBlock: (index: number) => void;
  onOpenImageReplacer: (img: DetectedImage) => void;
  viewport: ViewportMode;
  onUpdateRawHtml?: (newHtml: string) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  document,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onOpenImageReplacer,
  viewport,
  onUpdateRawHtml,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const maxWidthClass =
    viewport === 'mobile'
      ? 'w-[375px]'
      : viewport === 'tablet'
      ? 'w-[540px]'
      : 'w-full max-w-[680px]';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center bg-neutral-900/80 text-neutral-100">
      {/* Email Client Simulated Envelope Box */}
      <div className={`${maxWidthClass} transition-all duration-200 mb-4 select-none`}>
        <div className="rounded-t-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs shadow-sm text-neutral-300">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-neutral-100">{document.metadata.senderName}</span>
              <span className="text-[11px] text-neutral-400">&lt;{document.metadata.senderEmail}&gt;</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today, 10:00 AM</span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-neutral-100 truncate">
                {document.metadata.subject || 'No Subject Line'}
              </div>
              <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                {document.metadata.preheader || 'No preheader snippet configured'}
              </div>
            </div>
            <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Signed & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Newsletter Canvas Frame */}
      <div
        ref={containerRef}
        className={`${maxWidthClass} transition-all duration-200 bg-white shadow-2xl rounded-b-xl overflow-hidden border border-neutral-800`}
        style={{
          fontFamily:
            document.metadata.fontFamily === 'serif'
              ? "'Plus Jakarta Sans', Georgia, sans-serif"
              : "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        {document.rawHtmlMode && document.rawHtmlContent ? (
          <RawHtmlRenderer
            html={document.rawHtmlContent}
            onUpdateHtml={(newHtml) => onUpdateRawHtml?.(newHtml)}
            onOpenImageReplacer={onOpenImageReplacer}
          />
        ) : (
          <div>
            {document.blocks.map((block, index) => {
              if (block.hidden) return null;
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onClick={() => onSelectBlock(block.id)}
                  className={`relative group/block transition-all border-2 ${
                    isSelected
                      ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'border-transparent hover:border-amber-400/50'
                  }`}
                >
                  {/* Floating Action Bar on Hover/Selection */}
                  <div
                    className={`absolute top-2 right-2 z-20 flex items-center gap-1 p-1 bg-neutral-900/95 backdrop-blur-md text-neutral-100 rounded-lg shadow-lg border border-neutral-700 transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover/block:opacity-100'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] font-mono text-amber-400 px-1.5 uppercase">
                      {block.type}
                    </span>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMoveBlock(index, 'up')}
                      title="Move Up"
                      className="p-1 hover:text-amber-400 disabled:opacity-30 rounded hover:bg-neutral-800"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === document.blocks.length - 1}
                      onClick={() => onMoveBlock(index, 'down')}
                      title="Move Down"
                      className="p-1 hover:text-amber-400 disabled:opacity-30 rounded hover:bg-neutral-800"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateBlock(index)}
                      title="Duplicate"
                      className="p-1 hover:text-amber-400 rounded hover:bg-neutral-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBlock(index)}
                      title="Delete"
                      className="p-1 hover:text-red-400 rounded hover:bg-neutral-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Render Visual Block */}
                  {renderBlockView(
                    block,
                    document.metadata.accentColor,
                    document.metadata.fontFamily,
                    (updated) => onUpdateBlock(updated),
                    onOpenImageReplacer
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-xs text-neutral-500">
        Click any text to edit inline · Hover over images to replace · Drag sections on the left
      </div>
    </div>
  );
};

// Helper for inline text editing
function EditableText({
  value,
  onChange,
  className = '',
  tag: Tag = 'span',
  placeholder = '',
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  tag?: any;
  placeholder?: string;
}) {
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onInput={(e: React.FormEvent<HTMLElement>) => {
        onChange(e.currentTarget.textContent || '');
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        onChange(e.currentTarget.textContent || '');
      }}
      className={`outline-none hover:ring-1 hover:ring-amber-500/40 rounded px-0.5 focus:ring-2 focus:ring-amber-500 cursor-text transition-shadow ${className}`}
      data-placeholder={placeholder}
    >
      {value}
    </Tag>
  );
}

function renderBlockView(
  block: NewsletterBlock,
  accentColor: string,
  fontFamily: 'serif' | 'sans',
  onUpdate: (b: NewsletterBlock) => void,
  onOpenImageReplacer: (img: DetectedImage) => void
) {
  const isSerif = fontFamily === 'serif';
  const headingFontClass = isSerif ? 'font-serif-editorial' : 'font-sans font-bold';

  switch (block.type) {
    case 'header':
      return (
        <div className="px-8 py-6 border-b border-stone-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-cinzel text-2xl font-bold tracking-[0.2em] text-neutral-900 uppercase">
                <EditableText
                  value={block.brandName}
                  onChange={(v) => onUpdate({ ...block, brandName: v })}
                />
              </div>
              <div className="text-[11px] tracking-[0.15em] text-neutral-500 uppercase mt-0.5 font-medium">
                <EditableText
                  value={block.subHeader}
                  onChange={(v) => onUpdate({ ...block, subHeader: v })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                style={{ borderColor: `${accentColor}40`, color: accentColor }}
                className="text-[11px] tracking-wider uppercase font-semibold px-2.5 py-1 border rounded"
              >
                <EditableText
                  value={block.editionNo}
                  onChange={(v) => onUpdate({ ...block, editionNo: v })}
                />
              </span>
            </div>
          </div>
        </div>
      );

    case 'hero':
      return (
        <div className="bg-white">
          {/* Image with Hover Replace Overlay */}
          {block.imageUrl && (
            <div className="relative group/image overflow-hidden">
              <img
                src={block.imageUrl}
                alt={block.imageAlt}
                className="w-full h-auto max-h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenImageReplacer({
                      id: `${block.id}-hero`,
                      blockId: block.id,
                      blockTitle: block.headline,
                      blockType: block.type,
                      fieldKey: 'imageUrl',
                      url: block.imageUrl,
                      alt: block.imageAlt,
                      caption: block.imageCaption,
                    });
                  }}
                  className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <Replace className="w-4 h-4" />
                  Replace Hero Image
                </button>
              </div>
            </div>
          )}

          {block.imageCaption && (
            <div className="px-8 pt-2 text-[11px] text-neutral-400 italic text-right">
              <EditableText
                value={block.imageCaption}
                onChange={(v) => onUpdate({ ...block, imageCaption: v })}
              />
            </div>
          )}

          <div className="px-8 py-8 space-y-4">
            <div
              style={{ color: accentColor }}
              className="text-[11px] font-semibold tracking-[0.2em] uppercase"
            >
              <EditableText
                value={block.kicker}
                onChange={(v) => onUpdate({ ...block, kicker: v })}
              />
            </div>

            <h1 className={`${headingFontClass} text-3xl md:text-4xl leading-tight font-semibold text-neutral-900`}>
              <EditableText
                value={block.headline}
                onChange={(v) => onUpdate({ ...block, headline: v })}
              />
            </h1>

            <p className="text-base text-neutral-600 leading-relaxed">
              <EditableText
                value={block.subtitle}
                onChange={(v) => onUpdate({ ...block, subtitle: v })}
              />
            </p>

            {block.ctaText && (
              <div className="pt-2">
                <span className="inline-block bg-neutral-900 text-white text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded">
                  <EditableText
                    value={block.ctaText}
                    onChange={(v) => onUpdate({ ...block, ctaText: v })}
                  />
                  <span className="ml-2">&rarr;</span>
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case 'letter':
      return (
        <div className="px-8 py-8 bg-[#faf7f2] border-y border-stone-200">
          <div
            style={{ color: accentColor }}
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-2"
          >
            <EditableText
              value={block.kicker}
              onChange={(v) => onUpdate({ ...block, kicker: v })}
            />
          </div>

          <h2 className={`${headingFontClass} text-2xl font-semibold text-neutral-900 mb-4`}>
            <EditableText
              value={block.headline}
              onChange={(v) => onUpdate({ ...block, headline: v })}
            />
          </h2>

          <div className="space-y-3 text-neutral-700 leading-relaxed text-sm">
            {block.paragraphs.map((p, pIdx) => (
              <p key={pIdx}>
                <EditableText
                  value={p}
                  onChange={(v) => {
                    const next = [...block.paragraphs];
                    next[pIdx] = v;
                    onUpdate({ ...block, paragraphs: next });
                  }}
                />
              </p>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-300/80 flex items-center justify-between">
            <div>
              <div className={`${headingFontClass} text-base font-semibold text-neutral-900`}>
                <EditableText
                  value={block.authorName}
                  onChange={(v) => onUpdate({ ...block, authorName: v })}
                />
              </div>
              <div className="text-xs text-neutral-500">
                <EditableText
                  value={block.authorTitle}
                  onChange={(v) => onUpdate({ ...block, authorTitle: v })}
                />
              </div>
            </div>

            {block.authorAvatarUrl && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenImageReplacer({
                    id: `${block.id}-avatar`,
                    blockId: block.id,
                    blockTitle: block.authorName,
                    blockType: block.type,
                    fieldKey: 'authorAvatarUrl',
                    url: block.authorAvatarUrl || '',
                    alt: block.authorName,
                  });
                }}
                className="w-12 h-12 rounded-full overflow-hidden border border-stone-300 cursor-pointer hover:ring-2 hover:ring-amber-500 relative group/avatar shrink-0"
              >
                <img
                  src={block.authorAvatarUrl}
                  alt={block.authorName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white text-[9px]">
                  Swap
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'two-column':
      return (
        <div className="px-8 py-8 bg-white border-b border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image Column */}
            <div className={`relative group/image rounded overflow-hidden ${block.imageSide === 'right' ? 'md:order-2' : ''}`}>
              <img
                src={block.imageUrl}
                alt={block.imageAlt}
                className="w-full h-56 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenImageReplacer({
                      id: `${block.id}-img`,
                      blockId: block.id,
                      blockTitle: block.headline,
                      blockType: block.type,
                      fieldKey: 'imageUrl',
                      url: block.imageUrl,
                      alt: block.imageAlt,
                    });
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md flex items-center gap-1.5"
                >
                  <Replace className="w-3.5 h-3.5" /> Replace Photo
                </button>
              </div>
            </div>

            {/* Text Column */}
            <div className={`space-y-3 ${block.imageSide === 'right' ? 'md:order-1' : ''}`}>
              <div
                style={{ color: accentColor }}
                className="text-[10px] font-semibold tracking-[0.2em] uppercase"
              >
                <EditableText
                  value={block.kicker}
                  onChange={(v) => onUpdate({ ...block, kicker: v })}
                />
              </div>

              <h2 className={`${headingFontClass} text-2xl font-semibold text-neutral-900 leading-snug`}>
                <EditableText
                  value={block.headline}
                  onChange={(v) => onUpdate({ ...block, headline: v })}
                />
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed">
                <EditableText
                  value={block.description}
                  onChange={(v) => onUpdate({ ...block, description: v })}
                />
              </p>

              {block.specPills && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {block.specPills.map((pill, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-0.5 text-[11px] bg-stone-100 text-stone-700 rounded border border-stone-200"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              )}

              {block.ctaText && (
                <div className="pt-2">
                  <span
                    style={{ backgroundColor: accentColor }}
                    className="inline-block text-white text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded"
                  >
                    <EditableText
                      value={block.ctaText}
                      onChange={(v) => onUpdate({ ...block, ctaText: v })}
                    />
                    <span className="ml-1.5">&rarr;</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'three-column':
      return (
        <div className="px-8 py-8 bg-white border-b border-stone-200 space-y-6">
          <div className="text-center space-y-1">
            <div
              style={{ color: accentColor }}
              className="text-[10px] font-semibold tracking-[0.2em] uppercase"
            >
              <EditableText
                value={block.kicker}
                onChange={(v) => onUpdate({ ...block, kicker: v })}
              />
            </div>
            <h2 className={`${headingFontClass} text-2xl font-semibold text-neutral-900`}>
              <EditableText
                value={block.headline}
                onChange={(v) => onUpdate({ ...block, headline: v })}
              />
            </h2>
            {block.subtitle && (
              <p className="text-xs text-neutral-500">
                <EditableText
                  value={block.subtitle}
                  onChange={(v) => onUpdate({ ...block, subtitle: v })}
                />
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {block.items.map((item, idx) => (
              <div key={item.id} className="space-y-2 group/card">
                {item.imageUrl && (
                  <div className="relative rounded overflow-hidden h-36 bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenImageReplacer({
                            id: `${block.id}-item-${idx}`,
                            blockId: block.id,
                            blockTitle: item.title,
                            blockType: block.type,
                            fieldKey: 'items',
                            index: idx,
                            url: item.imageUrl,
                            alt: item.imageAlt,
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded shadow"
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                )}
                <div
                  style={{ color: accentColor }}
                  className="text-[10px] font-semibold tracking-wider uppercase"
                >
                  <EditableText
                    value={item.tag}
                    onChange={(v) => {
                      const next = [...block.items];
                      next[idx] = { ...item, tag: v };
                      onUpdate({ ...block, items: next });
                    }}
                  />
                </div>
                <h3 className={`${headingFontClass} text-base font-semibold text-neutral-900`}>
                  <EditableText
                    value={item.title}
                    onChange={(v) => {
                      const next = [...block.items];
                      next[idx] = { ...item, title: v };
                      onUpdate({ ...block, items: next });
                    }}
                  />
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  <EditableText
                    value={item.description}
                    onChange={(v) => {
                      const next = [...block.items];
                      next[idx] = { ...item, description: v };
                      onUpdate({ ...block, items: next });
                    }}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div className="px-8 py-8 bg-[#faf7f2] border-b border-stone-200 space-y-4">
          <div className="text-center space-y-1">
            <div
              style={{ color: accentColor }}
              className="text-[10px] font-semibold tracking-[0.2em] uppercase"
            >
              <EditableText
                value={block.kicker}
                onChange={(v) => onUpdate({ ...block, kicker: v })}
              />
            </div>
            <h2 className={`${headingFontClass} text-2xl font-semibold text-neutral-900`}>
              <EditableText
                value={block.headline}
                onChange={(v) => onUpdate({ ...block, headline: v })}
              />
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {block.images.map((img, gIdx) => (
              <div key={img.id} className="relative group/gimg rounded overflow-hidden">
                <img src={img.url} alt={img.alt} className="w-full h-48 object-cover rounded" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/gimg:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenImageReplacer({
                        id: `${block.id}-gallery-${gIdx}`,
                        blockId: block.id,
                        blockTitle: `Gallery Photo #${gIdx + 1}`,
                        blockType: block.type,
                        fieldKey: 'images',
                        index: gIdx,
                        url: img.url,
                        alt: img.alt,
                        caption: img.caption,
                      });
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded shadow"
                  >
                    Replace Photo
                  </button>
                </div>
                {img.caption && (
                  <div className="text-[11px] text-neutral-500 italic mt-1 text-center">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className="px-8 py-10 bg-neutral-900 text-white text-center border-b border-neutral-800 space-y-3">
          <div style={{ color: accentColor }} className="text-3xl font-serif leading-none">
            &ldquo;
          </div>
          <blockquote className={`${headingFontClass} text-xl md:text-2xl font-normal italic leading-relaxed text-stone-100 max-w-lg mx-auto`}>
            <EditableText
              value={block.quoteText}
              onChange={(v) => onUpdate({ ...block, quoteText: v })}
            />
          </blockquote>
          <div className="text-xs font-semibold tracking-wider uppercase text-amber-400 pt-1">
            <EditableText
              value={block.author}
              onChange={(v) => onUpdate({ ...block, author: v })}
            />
          </div>
          <div className="text-[11px] text-stone-400">
            <EditableText
              value={block.authorRole}
              onChange={(v) => onUpdate({ ...block, authorRole: v })}
            />
          </div>
        </div>
      );

    case 'milestones':
      return (
        <div className="px-8 py-8 bg-white border-b border-stone-200">
          <div className="text-center mb-6">
            <div
              style={{ color: accentColor }}
              className="text-[10px] font-semibold tracking-[0.2em] uppercase"
            >
              <EditableText
                value={block.kicker}
                onChange={(v) => onUpdate({ ...block, kicker: v })}
              />
            </div>
            <h2 className={`${headingFontClass} text-2xl font-semibold text-neutral-900`}>
              <EditableText
                value={block.headline}
                onChange={(v) => onUpdate({ ...block, headline: v })}
              />
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {block.milestones.map((m, mIdx) => (
              <div key={m.id} className="p-3 bg-stone-50 rounded border border-stone-200">
                <div
                  style={{ color: accentColor }}
                  className="font-cinzel text-2xl font-bold"
                >
                  <EditableText
                    value={m.metric}
                    onChange={(v) => {
                      const next = [...block.milestones];
                      next[mIdx] = { ...m, metric: v };
                      onUpdate({ ...block, milestones: next });
                    }}
                  />
                </div>
                <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1">
                  <EditableText
                    value={m.label}
                    onChange={(v) => {
                      const next = [...block.milestones];
                      next[mIdx] = { ...m, label: v };
                      onUpdate({ ...block, milestones: next });
                    }}
                  />
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  <EditableText
                    value={m.subtext}
                    onChange={(v) => {
                      const next = [...block.milestones];
                      next[mIdx] = { ...m, subtext: v };
                      onUpdate({ ...block, milestones: next });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cta-banner':
      return (
        <div className="px-8 py-10 bg-neutral-900 text-white text-center space-y-4">
          <div className="text-[10px] tracking-[0.2em] uppercase text-amber-400 font-semibold">
            <EditableText
              value={block.kicker}
              onChange={(v) => onUpdate({ ...block, kicker: v })}
            />
          </div>
          <h2 className={`${headingFontClass} text-2xl md:text-3xl font-semibold max-w-md mx-auto`}>
            <EditableText
              value={block.headline}
              onChange={(v) => onUpdate({ ...block, headline: v })}
            />
          </h2>
          <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
            <EditableText
              value={block.description}
              onChange={(v) => onUpdate({ ...block, description: v })}
            />
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded shadow">
              <EditableText
                value={block.primaryButtonText}
                onChange={(v) => onUpdate({ ...block, primaryButtonText: v })}
              />
              <span className="ml-1.5">&rarr;</span>
            </span>
            {block.secondaryButtonText && (
              <span className="border border-stone-600 text-stone-200 text-xs font-medium uppercase tracking-wider px-5 py-2.5 rounded">
                <EditableText
                  value={block.secondaryButtonText}
                  onChange={(v) => onUpdate({ ...block, secondaryButtonText: v })}
                />
              </span>
            )}
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="px-8 py-8 bg-[#f7f5f0] border-t border-stone-200 text-center space-y-3">
          <div className="font-cinzel text-base font-bold tracking-[0.2em] text-neutral-900 uppercase">
            <EditableText
              value={block.brandName}
              onChange={(v) => onUpdate({ ...block, brandName: v })}
            />
          </div>

          <div className="text-xs text-neutral-600 leading-relaxed">
            {block.addressLines.map((line, lIdx) => (
              <div key={lIdx}>{line}</div>
            ))}
            {block.phone && <div>Tel: {block.phone} · {block.email}</div>}
          </div>

          <div className="text-xs text-neutral-500 max-w-sm mx-auto">
            <EditableText
              value={block.unsubscribeNotice}
              onChange={(v) => onUpdate({ ...block, unsubscribeNotice: v })}
            />
          </div>

          <div className="text-[10px] text-neutral-400 pt-2 border-t border-stone-200">
            <EditableText
              value={block.copyrightText}
              onChange={(v) => onUpdate({ ...block, copyrightText: v })}
            />
          </div>
        </div>
      );

    case 'custom-html':
      return (
        <div
          dangerouslySetInnerHTML={{ __html: block.htmlContent }}
          className="p-4"
        />
      );

    default:
      return null;
  }
}

// Sub-renderer for user-uploaded raw HTML newsletters
function RawHtmlRenderer({
  html,
  onUpdateHtml,
  onOpenImageReplacer,
}: {
  html: string;
  onUpdateHtml: (newHtml: string) => void;
  onOpenImageReplacer: (img: DetectedImage) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);

  // Sync external HTML changes (like Undo/Redo or image replacement) to the DOM
  React.useEffect(() => {
    if (!containerRef.current) return;
    if (!isTypingRef.current && containerRef.current.innerHTML !== html) {
      containerRef.current.innerHTML = html;
    }

    // Attach click and replace handlers to all detected <img> tags
    const images = containerRef.current.querySelectorAll('img');
    images.forEach((img, idx) => {
      img.style.cursor = 'pointer';
      img.style.transition = 'outline 0.15s ease';
      img.title = 'Click to replace this image (Upload, URL, or Presets)';

      img.onmouseenter = () => {
        img.style.outline = '3px solid #f59e0b';
      };
      img.onmouseleave = () => {
        img.style.outline = 'none';
      };

      img.onclick = (e) => {
        e.stopPropagation();
        onOpenImageReplacer({
          id: `raw-img-${idx}`,
          blockId: 'raw-html',
          blockTitle: `Newsletter Image #${idx + 1}`,
          blockType: 'raw-image',
          fieldKey: `img-index-${idx}`,
          index: idx,
          url: img.getAttribute('src') || '',
          alt: img.getAttribute('alt') || '',
        });
      };
    });
  }, [html, onOpenImageReplacer]);

  return (
    <div className="p-2 relative group/raw">
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3.5 py-2 rounded-lg mb-3 flex items-center justify-between">
        <span className="font-medium">
          Uploaded HTML Mode Active: Click any text to edit inline. Click any photo to replace it.
        </span>
        <span className="text-[10px] text-amber-400 font-mono">Auto-saving enabled</span>
      </div>
      <div
        ref={containerRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => {
          isTypingRef.current = true;
        }}
        onInput={(e) => {
          isTypingRef.current = true;
          onUpdateHtml(e.currentTarget.innerHTML);
        }}
        onBlur={(e) => {
          isTypingRef.current = false;
          onUpdateHtml(e.currentTarget.innerHTML);
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        className="outline-none focus:ring-1 focus:ring-amber-500/40 rounded min-h-[300px]"
      />
    </div>
  );
}
