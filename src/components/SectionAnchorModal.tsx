import React, { useState, useEffect } from 'react';
import { BookmarkPlus, Hash, Check, X } from 'lucide-react';
import { slugify } from '../utils/sectionLinks';

interface SectionAnchorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onApplyAnchor: (anchorId: string) => void;
}

export const SectionAnchorModal: React.FC<SectionAnchorModalProps> = ({
  isOpen,
  onClose,
  selectedText,
  onApplyAnchor,
}) => {
  const [anchorId, setAnchorId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnchorId(slugify(selectedText) || 'new-section');
    }
  }, [isOpen, selectedText]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = slugify(anchorId);
    if (!cleanId) return;
    onApplyAnchor(cleanId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookmarkPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Create Section Bookmark (Anchor ID)
              </h3>
              <p className="text-xs text-neutral-400">
                Mark this heading so table-of-contents links can jump to it
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Section Title / Text
            </label>
            <div className="px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 font-medium truncate">
              {selectedText || 'Selected heading or section'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Anchor ID (used in hyperlinks as #{anchorId || 'section-name'})
            </label>
            <div className="flex items-center bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
              <Hash className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />
              <input
                type="text"
                autoFocus
                value={anchorId}
                onChange={(e) => setAnchorId(slugify(e.target.value))}
                placeholder="section-id-name"
                className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Links with <code className="text-amber-400">#{anchorId || 'id'}</code> will automatically scroll to this section.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Set Section Bookmark</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
