import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Unlink,
  BookmarkPlus,
  Strikethrough,
  RemoveFormatting,
  ExternalLink,
  Eye,
  Check,
} from 'lucide-react';
import { DocumentSectionTarget } from '../utils/sectionLinks';

export interface TextFormatToolbarProps {
  onOpenLinkModal: (selectedText: string, currentHref?: string) => void;
  onAddSectionAnchor: () => void;
  availableSections: DocumentSectionTarget[];
  onTestJump?: (targetId: string) => void;
  isFloating?: boolean;
}

export const TextFormatToolbar: React.FC<TextFormatToolbarProps> = ({
  onOpenLinkModal,
  onAddSectionAnchor,
  availableSections,
  onTestJump,
  isFloating = false,
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [currentLinkHref, setCurrentLinkHref] = useState<string | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Update button active states based on current selection
  const updateFormatStates = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setHasSelection(false);
      setSelectedText('');
      setCurrentLinkHref(null);
      return;
    }

    const text = selection.toString();
    setSelectedText(text);
    setHasSelection(text.length > 0);

    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsStrikethrough(document.queryCommandState('strikeThrough'));

      // Check if cursor/selection is inside an <a> tag
      let node: Node | null = selection.anchorNode;
      let foundLink: HTMLAnchorElement | null = null;
      while (node && node !== document.body) {
        if (node.nodeName === 'A') {
          foundLink = node as HTMLAnchorElement;
          break;
        }
        node = node.parentNode;
      }
      setCurrentLinkHref(foundLink ? foundLink.getAttribute('href') : null);
    } catch {
      // QueryCommandState may throw in restricted contexts
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', updateFormatStates);
    return () => {
      document.removeEventListener('selectionchange', updateFormatStates);
    };
  }, [updateFormatStates]);

  // Execute formatting while preventing loss of focus on contentEditable
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    updateFormatStates();
  };

  const handleLinkClick = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString() : '';
    onOpenLinkModal(text, currentLinkHref || undefined);
  };

  const handleUnlink = () => {
    executeCommand('unlink');
    setCurrentLinkHref(null);
  };

  const handleClearFormat = () => {
    executeCommand('removeFormat');
  };

  return (
    <div
      className={`flex items-center flex-wrap gap-1 p-1 bg-neutral-900 border border-neutral-700/80 rounded-lg shadow-lg text-neutral-200 select-none ${
        isFloating ? 'backdrop-blur-md bg-neutral-900/95 ring-1 ring-amber-500/20' : ''
      }`}
    >
      {/* 1. Bold Button */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          executeCommand('bold');
        }}
        title="Bold (Ctrl+B)"
        className={`p-1.5 rounded transition-colors text-xs font-bold flex items-center justify-center ${
          isBold
            ? 'bg-amber-500 text-neutral-950 font-extrabold shadow-sm'
            : 'hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300'
        }`}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* 2. Italic Button */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          executeCommand('italic');
        }}
        title="Italics (Ctrl+I)"
        className={`p-1.5 rounded transition-colors text-xs italic flex items-center justify-center ${
          isItalic
            ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
            : 'hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300'
        }`}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      {/* 3. Underline Button */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          executeCommand('underline');
        }}
        title="Underline (Ctrl+U)"
        className={`p-1.5 rounded transition-colors text-xs underline flex items-center justify-center ${
          isUnderline
            ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
            : 'hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300'
        }`}
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      {/* 4. Strikethrough */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          executeCommand('strikeThrough');
        }}
        title="Strikethrough"
        className={`p-1.5 rounded transition-colors text-xs flex items-center justify-center ${
          isStrikethrough
            ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
            : 'hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300'
        }`}
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-px bg-neutral-700 mx-0.5" />

      {/* 5. Hyperlink to Section or External URL */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleLinkClick();
        }}
        title="Add/Edit Hyperlink (Link to Section or Web)"
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors font-medium ${
          currentLinkHref
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300'
        }`}
      >
        <Link2 className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] font-medium hidden sm:inline">
          {currentLinkHref ? 'Edit Link' : 'Hyperlink'}
        </span>
      </button>

      {/* Unlink if link is currently active */}
      {currentLinkHref && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleUnlink();
          }}
          title="Remove Hyperlink"
          className="p-1.5 rounded hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors"
        >
          <Unlink className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Quick Jump Test if active link is an internal section anchor (#...) */}
      {currentLinkHref && currentLinkHref.startsWith('#') && onTestJump && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onTestJump(currentLinkHref);
          }}
          title={`Test Jump to ${currentLinkHref}`}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded border border-amber-500/30"
        >
          <Eye className="w-3 h-3" />
          <span>Jump</span>
        </button>
      )}

      <div className="h-4 w-px bg-neutral-700 mx-0.5" />

      {/* 6. Bookmark / Add Section Anchor Target */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onAddSectionAnchor();
        }}
        title="Create Section Anchor (Bookmark so links can jump here)"
        className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300 transition-colors"
      >
        <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[11px] hidden md:inline">Bookmark Section</span>
      </button>

      {/* 7. Clear Formatting */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleClearFormat();
        }}
        title="Remove Formatting"
        className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
