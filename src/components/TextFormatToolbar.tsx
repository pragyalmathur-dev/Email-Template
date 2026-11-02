import React, { useState, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  Unlink,
  BookmarkPlus,
  RemoveFormatting,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Plus,
  MousePointerClick,
  Image as ImageIcon,
  Space,
  MessageSquareQuote,
} from 'lucide-react';
import { DocumentSectionTarget } from '../utils/sectionLinks';

export interface TextFormatToolbarProps {
  onOpenLinkModal: (selectedText: string, currentHref?: string) => void;
  onAddSectionAnchor: () => void;
  availableSections: DocumentSectionTarget[];
  onTestJump?: (targetId: string) => void;
  isFloating?: boolean;
  // Brevo-style insertion modals
  onOpenInsertButton?: () => void;
  onOpenInsertImage?: () => void;
  onOpenInsertSpacer?: () => void;
  onOpenInsertCallout?: () => void;
}

export const TextFormatToolbar: React.FC<TextFormatToolbarProps> = ({
  onOpenLinkModal,
  onAddSectionAnchor,
  availableSections,
  onTestJump,
  isFloating = false,
  onOpenInsertButton,
  onOpenInsertImage,
  onOpenInsertSpacer,
  onOpenInsertCallout,
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isAlignLeft, setIsAlignLeft] = useState(false);
  const [isAlignCenter, setIsAlignCenter] = useState(false);
  const [isAlignRight, setIsAlignRight] = useState(false);
  const [isAlignJustify, setIsAlignJustify] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [currentLinkHref, setCurrentLinkHref] = useState<string | null>(null);

  // Update button active states based on current selection
  const updateFormatStates = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setCurrentLinkHref(null);
      return;
    }

    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsStrikethrough(document.queryCommandState('strikeThrough'));
      setIsAlignLeft(document.queryCommandState('justifyLeft'));
      setIsAlignCenter(document.queryCommandState('justifyCenter'));
      setIsAlignRight(document.queryCommandState('justifyRight'));
      setIsAlignJustify(document.queryCommandState('justifyFull'));
      setIsBulletList(document.queryCommandState('insertUnorderedList'));
      setIsNumberedList(document.queryCommandState('insertOrderedList'));

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
      className={`flex items-center flex-wrap gap-1 p-1.5 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-xl text-neutral-200 select-none ${
        isFloating ? 'backdrop-blur-md bg-neutral-900/95 ring-1 ring-amber-500/20' : ''
      }`}
    >
      {/* BREVO INSERTION GROUP */}
      <div className="flex items-center gap-1 bg-neutral-950/70 p-0.5 rounded-lg border border-neutral-800">
        {/* + Button */}
        {onOpenInsertButton && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenInsertButton();
            }}
            title="Add Call-to-Action Button (Brevo-style)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all hover:scale-102"
          >
            <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Button</span>
          </button>
        )}

        {/* + Image */}
        {onOpenInsertImage && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenInsertImage();
            }}
            title="Add Image Block (Upload, Presets, or URL)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-800 hover:text-amber-300 border border-neutral-700 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>+ Image</span>
          </button>
        )}

        {/* + Space / Divider */}
        {onOpenInsertSpacer && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenInsertSpacer();
            }}
            title="Add Vertical Space or Divider Line"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-800 hover:text-amber-300 border border-neutral-700 transition-colors"
          >
            <Space className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Space</span>
          </button>
        )}

        {/* + Callout */}
        {onOpenInsertCallout && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenInsertCallout();
            }}
            title="Add Callout Note / Highlight Box"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 hover:text-amber-300 border border-neutral-700 transition-colors"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">+ Note</span>
          </button>
        )}
      </div>

      <div className="h-4 w-px bg-neutral-700/80 mx-0.5" />

      {/* TEXT FORMATTING GROUP (Bold, Italic, Underline, Strikethrough - strictly NO font dropdown) */}
      <div className="flex items-center gap-0.5">
        {/* Bold */}
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

        {/* Italic */}
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

        {/* Underline */}
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

        {/* Strikethrough */}
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
      </div>

      <div className="h-4 w-px bg-neutral-700/80 mx-0.5" />

      {/* TEXT ALIGNMENT GROUP */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('justifyLeft');
          }}
          title="Align Left"
          className={`p-1.5 rounded transition-colors ${
            isAlignLeft
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('justifyCenter');
          }}
          title="Align Center"
          className={`p-1.5 rounded transition-colors ${
            isAlignCenter
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('justifyRight');
          }}
          title="Align Right"
          className={`p-1.5 rounded transition-colors ${
            isAlignRight
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('justifyFull');
          }}
          title="Justify Text"
          className={`p-1.5 rounded transition-colors ${
            isAlignJustify
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-neutral-700/80 mx-0.5" />

      {/* LISTS GROUP */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('insertUnorderedList');
          }}
          title="Bulleted List"
          className={`p-1.5 rounded transition-colors ${
            isBulletList
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('insertOrderedList');
          }}
          title="Numbered List"
          className={`p-1.5 rounded transition-colors ${
            isNumberedList
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-neutral-700/80 mx-0.5" />

      {/* HYPERLINK & JUMP GROUP */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleLinkClick();
          }}
          title="Add / Edit Hyperlink (Link to Web or Section Jump)"
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors font-medium ${
            currentLinkHref
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300'
          }`}
        >
          <Link2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-medium hidden md:inline">
            {currentLinkHref ? 'Edit Link' : 'Link'}
          </span>
        </button>

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

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onAddSectionAnchor();
          }}
          title="Bookmark Section Anchor (So links can jump here)"
          className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300 transition-colors"
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] hidden lg:inline">Bookmark</span>
        </button>

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
    </div>
  );
};
