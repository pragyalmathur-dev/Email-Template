import React, { useState, useEffect } from 'react';
import {
  Link2,
  Bookmark,
  ExternalLink,
  Search,
  Check,
  Trash2,
  X,
  ArrowRight,
  Eye,
  Hash,
} from 'lucide-react';
import { DocumentSectionTarget, slugify } from '../utils/sectionLinks';

interface HyperlinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  initialHref?: string;
  availableSections: DocumentSectionTarget[];
  onApplyLink: (href: string, text?: string) => void;
  onRemoveLink?: () => void;
  onTestJump?: (targetId: string) => void;
}

export const HyperlinkModal: React.FC<HyperlinkModalProps> = ({
  isOpen,
  onClose,
  selectedText,
  initialHref = '',
  availableSections,
  onApplyLink,
  onRemoveLink,
  onTestJump,
}) => {
  const [tab, setTab] = useState<'section' | 'external'>('section');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [customAnchorInput, setCustomAnchorInput] = useState<string>('');
  const [externalUrl, setExternalUrl] = useState<string>('');
  const [linkText, setLinkText] = useState<string>(selectedText);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setLinkText(selectedText || '');
    if (initialHref) {
      if (initialHref.startsWith('#')) {
        setTab('section');
        const idWithoutHash = initialHref.slice(1);
        setSelectedSectionId(idWithoutHash);
        setCustomAnchorInput(idWithoutHash);
      } else {
        setTab('external');
        setExternalUrl(initialHref);
      }
    } else {
      // Auto-suggest anchor from selected text if empty
      const suggestedSlug = slugify(selectedText);
      setCustomAnchorInput(suggestedSlug);
      // Check if it matches an existing section
      const match = availableSections.find(
        (s) => s.id.toLowerCase() === suggestedSlug.toLowerCase()
      );
      if (match) {
        setSelectedSectionId(match.id);
      }
    }
  }, [isOpen, initialHref, selectedText, availableSections]);

  if (!isOpen) return null;

  // Filter sections by search query
  const filteredSections = availableSections.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'section') {
      const targetId = selectedSectionId.trim() || customAnchorInput.trim();
      if (!targetId) return;
      const cleanHref = targetId.startsWith('#') ? targetId : `#${targetId}`;
      onApplyLink(cleanHref, linkText);
    } else {
      let url = externalUrl.trim();
      if (!url) return;
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('#')) {
        url = `https://${url}`;
      }
      onApplyLink(url, linkText);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                {initialHref ? 'Edit Hyperlink' : 'Create Hyperlink'}
              </h3>
              <p className="text-xs text-neutral-400">
                Link to a newsletter section or an external website
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="p-5 space-y-4 overflow-y-auto">
          {/* Display Text Field */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Display Text
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="e.g. Customer Delight, Events So Far..."
              className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Link Type Selector Tabs */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Link Destination
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
              <button
                type="button"
                onClick={() => setTab('section')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  tab === 'section'
                    ? 'bg-neutral-800 text-amber-400 shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Newsletter Section</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('external')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  tab === 'external'
                    ? 'bg-neutral-800 text-amber-400 shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Web URL / Email</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Newsletter Section Anchors */}
          {tab === 'section' && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Select a section to jump to upon click:
                </span>
                {selectedSectionId && onTestJump && (
                  <button
                    type="button"
                    onClick={() => onTestJump(selectedSectionId)}
                    className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Test Jump</span>
                  </button>
                )}
              </div>

              {/* Search Sections Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter sections (e.g. Customer Delight, Greener Tomorrow)..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Section List */}
              <div className="max-h-48 overflow-y-auto border border-neutral-800 rounded-lg bg-neutral-950 divide-y divide-neutral-850">
                {filteredSections.length > 0 ? (
                  filteredSections.map((sec) => {
                    const isSelected = selectedSectionId === sec.id;
                    return (
                      <div
                        key={sec.id}
                        onClick={() => {
                          setSelectedSectionId(sec.id);
                          setCustomAnchorInput(sec.id);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'text-neutral-300 hover:bg-neutral-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Hash className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`} />
                          <span className="font-medium truncate">{sec.title}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">#{sec.id}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    No matching sections found. You can type a custom anchor below.
                  </div>
                )}
              </div>

              {/* Custom Anchor Input */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Target Anchor ID:</span>
                  <span className="text-[11px] text-neutral-500 font-mono">#{customAnchorInput || 'section-name'}</span>
                </div>
                <div className="flex items-center bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                  <span className="text-amber-500 font-mono text-xs mr-1 font-bold">#</span>
                  <input
                    type="text"
                    value={customAnchorInput}
                    onChange={(e) => {
                      const val = slugify(e.target.value);
                      setCustomAnchorInput(val);
                      setSelectedSectionId(val);
                    }}
                    placeholder="enter-section-anchor-name"
                    className="w-full bg-transparent text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: External Web URL */}
          {tab === 'external' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Web Address or Mailto Link
                </label>
                <div className="relative">
                  <ExternalLink className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://vianaar.com/villa or mailto:info@company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <p className="text-[11px] text-neutral-500">
                External links open in a new browser tab without leaving the email client.
              </p>
            </div>
          )}

          {/* Dialog Action Buttons */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            {initialHref && onRemoveLink ? (
              <button
                type="button"
                onClick={() => {
                  onRemoveLink();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-800/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Link</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{initialHref ? 'Update Hyperlink' : 'Apply Hyperlink'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
