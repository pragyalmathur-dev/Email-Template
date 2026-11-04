import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Search,
  Newspaper,
  Gamepad2,
  Columns2,
  LayoutGrid,
  Sparkles,
  MessageSquareQuote,
  Trophy,
  Calendar,
  AlertCircle,
  FileText,
  Check,
  Eye,
  Layers,
} from 'lucide-react';
import { SECTION_TEMPLATES, SectionTemplate } from '../utils/sectionTemplates';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSection: (htmlContent: string, position: 'cursor' | 'top' | 'bottom') => void;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onInsertSection,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [insertPosition, setInsertPosition] = useState<'cursor' | 'top' | 'bottom'>('cursor');
  const [previewTemplate, setPreviewTemplate] = useState<SectionTemplate | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'content', label: 'Stories & Articles' },
    { id: 'game', label: 'Games & Puzzles' },
    { id: 'cta', label: 'Banners & CTA' },
    { id: 'data', label: 'Stats & Data' },
    { id: 'footer', label: 'Footers' },
  ];

  const filteredTemplates = useMemo(() => {
    return SECTION_TEMPLATES.filter((tpl) => {
      const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.title.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectTemplate = (template: SectionTemplate) => {
    const html = template.generateHtml();
    onInsertSection(html, insertPosition);
    onClose();
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Newspaper':
        return <Newspaper className="w-5 h-5 text-amber-400" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'Columns2':
        return <Columns2 className="w-5 h-5 text-blue-400" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-5 h-5 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'MessageSquareQuote':
        return <MessageSquareQuote className="w-5 h-5 text-yellow-400" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-rose-400" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-neutral-400" />;
      default:
        return <Layers className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold shadow-md">
              <Plus className="w-5 h-5 stroke-[2.8]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <span>Add a Section</span>
                <span className="text-[11px] font-normal text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono">
                  Brevo &middot; Mailchimp Grade
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Choose from pre-designed, email-client-tested section templates to add into your newsletter.
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

        {/* Toolbar: Search + Placement Selector */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections (e.g. Sudoku, feature, two-column, stats)..."
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

          {/* Placement Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 p-1 rounded-xl shrink-0 text-xs">
            <span className="text-[11px] text-neutral-400 px-2 hidden md:inline">Insert:</span>
            <button
              type="button"
              onClick={() => setInsertPosition('cursor')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                insertPosition === 'cursor'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              At Cursor
            </button>
            <button
              type="button"
              onClick={() => setInsertPosition('bottom')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                insertPosition === 'bottom'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              At End
            </button>
            <button
              type="button"
              onClick={() => setInsertPosition('top')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                insertPosition === 'top'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              At Top
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-2 text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-neutral-300">No templates found</div>
              <p className="text-xs text-neutral-500">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/60 rounded-xl p-4 transition-all hover:shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-amber-500/40 transition-colors">
                      {renderIcon(tpl.iconName)}
                    </div>
                    {tpl.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-lg shadow transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Insert Section</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(tpl)}
                    title="Live Preview of HTML layout"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 border border-neutral-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Optional Section Live Preview Drawer / Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
            <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-950">
                <span className="text-xs font-bold text-neutral-100 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Preview: {previewTemplate.title}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1 text-neutral-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-stone-100 text-neutral-900">
                <div dangerouslySetInnerHTML={{ __html: previewTemplate.generateHtml() }} />
              </div>
              <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-lg shadow"
                >
                  Insert This Section
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between text-xs text-neutral-400">
          <span>
            Inserted sections are 100% editable inline like in Microsoft Word &middot; Press <strong>Ctrl + Z</strong> to undo.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
