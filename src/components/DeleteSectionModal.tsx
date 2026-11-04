import React, { useState, useMemo } from 'react';
import {
  X,
  Trash2,
  Search,
  Eye,
  Gamepad2,
  Newspaper,
  Table,
  Sparkles,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { DeletableSection } from '../utils/sectionDeleter';

interface DeleteSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: DeletableSection[];
  onDeleteSection: (section: DeletableSection) => void;
  onDeleteByKeyword?: (keyword: string) => boolean;
  onPreviewSection?: (section: DeletableSection) => void;
}

export const DeleteSectionModal: React.FC<DeleteSectionModalProps> = ({
  isOpen,
  onClose,
  sections,
  onDeleteSection,
  onDeleteByKeyword,
  onPreviewSection,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [customKeyword, setCustomKeyword] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase().trim();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.snippet.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  const handleConfirmDelete = (section: DeletableSection) => {
    onDeleteSection(section);
    setConfirmDeleteId(null);
    setFeedbackMessage(`Removed "${section.title}"! (Ctrl+Z to undo)`);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 2800);
  };

  const handleCustomKeywordDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKeyword.trim() || !onDeleteByKeyword) return;
    const success = onDeleteByKeyword(customKeyword.trim());
    if (success) {
      setFeedbackMessage(`Deleted section matching "${customKeyword}"! (Ctrl+Z to undo)`);
      setCustomKeyword('');
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 2800);
    } else {
      setFeedbackMessage(`Could not find a section matching "${customKeyword}".`);
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
    }
  };

  const getCategoryBadge = (category: DeletableSection['category']) => {
    switch (category) {
      case 'game':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Gamepad2 className="w-3 h-3 text-purple-400" />
            Game / Puzzle
          </span>
        );
      case 'table':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Table className="w-3 h-3 text-blue-400" />
            Table Section
          </span>
        );
      case 'footer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-700/50 text-neutral-300 border border-neutral-600">
            Footer
          </span>
        );
      case 'banner':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Header / Banner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Newspaper className="w-3 h-3 text-emerald-400" />
            Article Section
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <span>Delete a Section</span>
                <span className="text-xs font-normal text-neutral-400 px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700">
                  {sections.length} detected
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select any section (e.g. Sudoku game, article, leader spotlight) to completely remove it.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div className="px-6 py-2.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-2 duration-150">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              {feedbackMessage}
            </span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/90 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections by name (e.g. Sudoku, Customer Delight, Welcome)..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Custom Keyword Removal Form */}
          {onDeleteByKeyword && (
            <form onSubmit={handleCustomKeywordDelete} className="flex items-center gap-2">
              <input
                type="text"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                placeholder="Or type any exact keyword to remove (e.g. 'sudoku', 'puzzle')..."
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={!customKeyword.trim()}
                className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove by Keyword</span>
              </button>
            </form>
          )}
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-neutral-300">
                No matching sections found
              </div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try searching for a different word, or use the "Remove by Keyword" input above to target text directly.
              </p>
            </div>
          ) : (
            filteredSections.map((sec) => {
              const isConfirming = confirmDeleteId === sec.id;

              return (
                <div
                  key={sec.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    sec.category === 'game'
                      ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-400/60'
                      : isConfirming
                      ? 'bg-red-950/30 border-red-500/50'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getCategoryBadge(sec.category)}
                      <h4 className="text-xs font-bold text-neutral-100 truncate max-w-md">
                        {sec.title}
                      </h4>
                    </div>
                    {sec.snippet && (
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {sec.snippet}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {onPreviewSection && (
                      <button
                        type="button"
                        onClick={() => {
                          onPreviewSection(sec);
                          onClose();
                        }}
                        title="Scroll to and preview this section in the editor"
                        className="p-2 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden md:inline text-[11px]">Preview</span>
                      </button>
                    )}

                    {isConfirming ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(sec)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Confirm Delete</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(sec.id)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
          <span>
            Tip: All section removals can be undone anytime by pressing <strong>Ctrl + Z</strong>.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
