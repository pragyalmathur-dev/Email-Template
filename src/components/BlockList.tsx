import React from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  LayoutTemplate,
  FileText,
  Columns2,
  Columns3,
  Images,
  Quote,
  TrendingUp,
  Megaphone,
  Footprints,
  Code2,
} from 'lucide-react';
import { BlockType, NewsletterBlock } from '../types/newsletter';

interface BlockListProps {
  blocks: NewsletterBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onDuplicateBlock: (index: number) => void;
  onDeleteBlock: (index: number) => void;
  onToggleHideBlock: (index: number) => void;
}

function getBlockIcon(type: BlockType) {
  switch (type) {
    case 'header':
      return LayoutTemplate;
    case 'hero':
      return LayoutTemplate;
    case 'letter':
      return FileText;
    case 'two-column':
      return Columns2;
    case 'three-column':
      return Columns3;
    case 'gallery':
      return Images;
    case 'quote':
      return Quote;
    case 'milestones':
      return TrendingUp;
    case 'cta-banner':
      return Megaphone;
    case 'footer':
      return Footprints;
    case 'custom-html':
      return Code2;
    default:
      return LayoutTemplate;
  }
}

function getBlockLabel(block: NewsletterBlock): string {
  if (block.title) return block.title;
  switch (block.type) {
    case 'header':
      return block.brandName || 'Brand Header';
    case 'hero':
      return block.headline || 'Hero Section';
    case 'letter':
      return `Letter: ${block.authorName || 'Note'}`;
    case 'two-column':
      return block.headline || '2-Column Feature';
    case 'three-column':
      return block.headline || '3-Column Grid';
    case 'gallery':
      return block.headline || 'Gallery';
    case 'quote':
      return `Quote: ${block.author || 'Thought'}`;
    case 'milestones':
      return block.headline || 'Milestones';
    case 'cta-banner':
      return block.headline || 'Call to Action';
    case 'footer':
      return block.brandName || 'Footer';
    case 'custom-html':
      return 'Custom HTML Code';
    default:
      return 'Block';
  }
}

export const BlockList: React.FC<BlockListProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onToggleHideBlock,
}) => {
  return (
    <div className="p-4 space-y-2.5">
      <div className="flex items-center justify-between pb-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Sections Order ({blocks.length})
        </h4>
        <span className="text-[11px] text-neutral-500">Reorder & Edit</span>
      </div>

      <div className="space-y-1.5">
        {blocks.map((block, index) => {
          const Icon = getBlockIcon(block.type);
          const isSelected = selectedBlockId === block.id;
          const isFirst = index === 0;
          const isLast = index === blocks.length - 1;

          return (
            <div
              key={block.id}
              onClick={() => onSelectBlock(block.id)}
              className={`group flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-500/80 bg-neutral-800 text-neutral-100 shadow-sm ring-1 ring-amber-500/30'
                  : 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-neutral-700 text-neutral-300'
              } ${block.hidden ? 'opacity-50' : ''}`}
            >
              {/* Grip / Index */}
              <div className="flex items-center gap-1 text-neutral-500 shrink-0">
                <GripVertical className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-mono tabular-nums w-4 text-center">{index + 1}</span>
              </div>

              {/* Icon & Label */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-amber-400' : 'text-neutral-400 group-hover:text-neutral-200'
                  }`}
                />
                <span className="text-xs font-medium truncate">{getBlockLabel(block)}</span>
              </div>

              {/* Quick Actions (Reorder, Duplicate, Delete) */}
              <div
                className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Move Up */}
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() => onMoveBlock(index, 'up')}
                  title="Move section up"
                  className="p-1 text-neutral-400 hover:text-neutral-100 disabled:opacity-20 rounded hover:bg-neutral-700"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => onMoveBlock(index, 'down')}
                  title="Move section down"
                  className="p-1 text-neutral-400 hover:text-neutral-100 disabled:opacity-20 rounded hover:bg-neutral-700"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Hide / Show */}
                <button
                  type="button"
                  onClick={() => onToggleHideBlock(index)}
                  title={block.hidden ? 'Show section' : 'Hide section'}
                  className="p-1 text-neutral-400 hover:text-neutral-100 rounded hover:bg-neutral-700"
                >
                  {block.hidden ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => onDuplicateBlock(index)}
                  title="Duplicate section"
                  className="p-1 text-neutral-400 hover:text-neutral-100 rounded hover:bg-neutral-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteBlock(index)}
                  title="Delete section"
                  className="p-1 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
