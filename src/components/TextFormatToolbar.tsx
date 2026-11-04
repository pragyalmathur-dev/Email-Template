import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  PlusCircle,
  MousePointerClick,
  Image as ImageIcon,
  Space,
  MessageSquareQuote,
  Trash2,
  Highlighter,
  AArrowUp,
  AArrowDown,
  ChevronDown,
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
  onOpenAddSection?: () => void;
  onOpenDeleteSection?: () => void;
}

const FONT_SIZES = [
  { label: '12px (Small)', value: 12 },
  { label: '14px (Body)', value: 14 },
  { label: '16px (Normal)', value: 16 },
  { label: '18px (Large)', value: 18 },
  { label: '20px (Heading 3)', value: 20 },
  { label: '24px (Heading 2)', value: 24 },
  { label: '28px (Heading 1)', value: 28 },
  { label: '32px (Hero)', value: 32 },
];

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#fef08a', border: '#fde047' },
  { name: 'Green', color: '#bbf7d0', border: '#86efac' },
  { name: 'Blue', color: '#bae6fd', border: '#7dd3fc' },
  { name: 'Pink', color: '#fbcfe8', border: '#f472b6' },
  { name: 'Orange', color: '#fed7aa', border: '#fdba74' },
  { name: 'Lavender', color: '#e9d5ff', border: '#c084fc' },
];

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
  onOpenAddSection,
  onOpenDeleteSection,
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

  // Font size & highlight popup states
  const [currentFontSize, setCurrentFontSize] = useState<number>(16);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const fontSizeRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Close popups on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fontSizeRef.current && !fontSizeRef.current.contains(e.target as Node)) {
        setShowFontSizeMenu(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(e.target as Node)) {
        setShowHighlightMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      // Check current font size from computed style of selection parent
      if (selection.anchorNode) {
        const parent = selection.anchorNode.parentElement;
        if (parent) {
          const computedSize = parseInt(window.getComputedStyle(parent).fontSize, 10);
          if (!isNaN(computedSize)) {
            setCurrentFontSize(computedSize);
          }
        }
      }

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

  // Font size change handler using email-safe inline styles
  const applyFontSize = (sizePx: number) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setCurrentFontSize(sizePx);
      setShowFontSizeMenu(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = `${sizePx}px`;
    span.style.lineHeight = '1.35';

    try {
      const extracted = range.extractContents();
      span.appendChild(extracted);
      range.insertNode(span);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    } catch {
      document.execCommand('fontSize', false, '3');
    }
    setCurrentFontSize(sizePx);
    setShowFontSizeMenu(false);
  };

  const handleStepFontSize = (delta: number) => {
    const sorted = [...FONT_SIZES].map((s) => s.value);
    const currentIndex = sorted.findIndex((val) => val === currentFontSize);
    let targetIndex = currentIndex === -1 ? 2 : currentIndex + delta;
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex >= sorted.length) targetIndex = sorted.length - 1;
    applyFontSize(sorted[targetIndex]);
  };

  // Text highlight handler using email-safe inline styles
  const applyHighlight = (color: string | null) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setShowHighlightMenu(false);
      return;
    }

    const range = selection.getRangeAt(0);
    if (!color) {
      document.execCommand('removeFormat');
      setShowHighlightMenu(false);
      return;
    }

    const span = document.createElement('span');
    span.style.backgroundColor = color;
    span.style.padding = '1px 3px';
    span.style.borderRadius = '3px';

    try {
      const extracted = range.extractContents();
      span.appendChild(extracted);
      range.insertNode(span);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    } catch {
      // fallback
    }
    setShowHighlightMenu(false);
  };

  return (
    <div
      className={`flex items-center flex-wrap gap-1 p-1.5 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-xl text-neutral-200 select-none ${
        isFloating ? 'backdrop-blur-md bg-neutral-900/95 ring-1 ring-amber-500/20' : ''
      }`}
    >
      {/* BREVO / MAILCHIMP INSERTION GROUP */}
      <div className="flex items-center gap-1 bg-neutral-950/70 p-0.5 rounded-lg border border-neutral-800">
        {/* + Section */}
        {onOpenAddSection && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenAddSection();
            }}
            title="Add New Newsletter Section (Sudoku, Feature Story, 2-Column, Cards, Banner, etc.)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm transition-all hover:scale-102 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Section</span>
          </button>
        )}

        {/* + Button */}
        {onOpenInsertButton && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenInsertButton();
            }}
            title="Add Call-to-Action Button (Brevo-style)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all hover:scale-102 cursor-pointer"
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-800 hover:text-amber-300 border border-neutral-700 transition-colors cursor-pointer"
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-800 hover:text-amber-300 border border-neutral-700 transition-colors cursor-pointer"
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
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 hover:text-amber-300 border border-neutral-700 transition-colors cursor-pointer"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">+ Note</span>
          </button>
        )}
      </div>

      <div className="h-4 w-px bg-neutral-700/80 mx-0.5" />

      {/* FONT SIZE CONTROLS (Font Size Change without changing font family) */}
      <div className="flex items-center gap-0.5 relative" ref={fontSizeRef}>
        {/* Decrease Font Size */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleStepFontSize(-1);
          }}
          title="Decrease Font Size (A-)"
          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <AArrowDown className="w-3.5 h-3.5" />
        </button>

        {/* Font Size Dropdown Button */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowFontSizeMenu(!showFontSizeMenu);
            setShowHighlightMenu(false);
          }}
          title="Change Font Size"
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 cursor-pointer"
        >
          <span>{currentFontSize}px</span>
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        </button>

        {/* Increase Font Size */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleStepFontSize(1);
          }}
          title="Increase Font Size (A+)"
          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <AArrowUp className="w-3.5 h-3.5" />
        </button>

        {/* Font Size Menu Popover */}
        {showFontSizeMenu && (
          <div className="absolute top-full left-0 mt-1 w-36 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 py-1 overflow-hidden">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
              Font Size
            </div>
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFontSize(size.value);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-500/15 hover:text-amber-300 cursor-pointer ${
                  currentFontSize === size.value
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-neutral-300'
                }`}
              >
                <span>{size.label}</span>
                {currentFontSize === size.value && <span className="text-amber-400 text-xs">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-4 w-px bg-neutral-700/80 mx-0.5" />

      {/* TEXT FORMATTING GROUP (Bold, Italic, Underline, Strikethrough, Highlight) */}
      <div className="flex items-center gap-0.5">
        {/* Bold */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('bold');
          }}
          title="Bold (Ctrl+B)"
          className={`p-1.5 rounded transition-colors text-xs font-bold flex items-center justify-center cursor-pointer ${
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
          className={`p-1.5 rounded transition-colors text-xs italic flex items-center justify-center cursor-pointer ${
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
          className={`p-1.5 rounded transition-colors text-xs underline flex items-center justify-center cursor-pointer ${
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
          className={`p-1.5 rounded transition-colors text-xs flex items-center justify-center cursor-pointer ${
            isStrikethrough
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
              : 'hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300'
          }`}
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        {/* Highlight Text Tool */}
        <div className="relative" ref={highlightRef}>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowHighlightMenu(!showHighlightMenu);
              setShowFontSizeMenu(false);
            }}
            title="Highlight Text with Color"
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-400" />
            <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
          </button>

          {showHighlightMenu && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 min-w-[150px]">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Highlight Color
              </div>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {HIGHLIGHT_COLORS.map((hc) => (
                  <button
                    key={hc.name}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applyHighlight(hc.color);
                    }}
                    title={hc.name}
                    style={{ backgroundColor: hc.color, borderColor: hc.border }}
                    className="w-7 h-7 rounded border hover:scale-110 transition-transform shadow-sm cursor-pointer"
                  />
                ))}
              </div>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyHighlight(null);
                }}
                className="w-full text-center px-2 py-1 text-[11px] text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded cursor-pointer"
              >
                Clear Highlight
              </button>
            </div>
          )}
        </div>
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
          className={`p-1.5 rounded transition-colors cursor-pointer ${
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
          className={`p-1.5 rounded transition-colors cursor-pointer ${
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
          className={`p-1.5 rounded transition-colors cursor-pointer ${
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
          className={`p-1.5 rounded transition-colors cursor-pointer ${
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
          className={`p-1.5 rounded transition-colors cursor-pointer ${
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
          className={`p-1.5 rounded transition-colors cursor-pointer ${
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
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors font-medium cursor-pointer ${
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
            className="p-1.5 rounded hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
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
            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded border border-amber-500/30 cursor-pointer"
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
          className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300 transition-colors cursor-pointer"
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
          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        {onOpenDeleteSection && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onOpenDeleteSection();
            }}
            title="Delete a section (e.g. Sudoku game, article, etc.)"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-500/10 hover:bg-red-500/25 text-red-300 border border-red-500/30 transition-colors ml-1 font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] hidden sm:inline">Delete Section</span>
          </button>
        )}
      </div>
    </div>
  );
};
