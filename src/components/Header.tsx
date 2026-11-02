import React from 'react';
import {
  Download,
  Upload,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Image as ImageIcon,
  Layers,
  Code2,
  Save,
  Check,
  Loader2,
  FilePlus2,
} from 'lucide-react';
import { NewsletterDocument } from '../types/newsletter';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type AppTab = 'canvas' | 'assets' | 'code';

interface HeaderProps {
  document: NewsletterDocument | null;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenImportModal: () => void;
  onOpenExportModal: () => void;
  imageCount: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedTime: string | null;
  onSave: () => void;
  onClearDocument?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  document,
  viewport,
  onViewportChange,
  activeTab,
  onTabChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenImportModal,
  onOpenExportModal,
  imageCount,
  isDirty,
  isSaving,
  lastSavedTime,
  onSave,
  onClearDocument,
}) => {
  const hasDoc = !!document;

  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-950 px-4 md:px-6 flex items-center justify-between gap-4 md:gap-6 shrink-0 z-30 select-none">
      {/* Zone 1: Wordmark & Document Title */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <a href="/" className="text-base font-bold tracking-tight text-neutral-100 flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-serif-editorial italic font-bold flex items-center justify-center text-lg">
            E
          </span>
          <span>EditoMail</span>
        </a>
        <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-400 border-l border-neutral-800 pl-4">
          <span className="text-neutral-200 font-medium truncate max-w-[220px]">
            {document ? document.name || 'Untitled Newsletter' : 'No Newsletter Loaded'}
          </span>
          {document && (
            <>
              <span className="text-neutral-600">·</span>
              <span className="text-[11px] text-neutral-400">
                {document.rawHtmlMode ? 'Uploaded HTML Mode' : `${document.blocks.length} sections`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Modes, Viewport & Undo/Redo */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {hasDoc && (
          <>
            {/* Workspace Mode Tabs */}
            <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
              <button
                onClick={() => onTabChange('canvas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'canvas'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Editor</span>
              </button>

              <button
                onClick={() => onTabChange('assets')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'assets'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Images</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-neutral-950 rounded-full font-mono text-neutral-300">
                  {imageCount}
                </span>
              </button>

              <button
                onClick={() => onTabChange('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'code'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">HTML Code</span>
              </button>
            </div>

            {/* Viewport Width Switches */}
            {activeTab === 'canvas' && (
              <div className="hidden md:flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
                <button
                  onClick={() => onViewportChange('desktop')}
                  title="Desktop View (680px container)"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewport === 'desktop'
                      ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewportChange('tablet')}
                  title="Tablet View (540px)"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewport === 'tablet'
                      ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewportChange('mobile')}
                  title="Mobile View (375px)"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewport === 'mobile'
                      ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Undo / Redo - prominent on all screens */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className="p-1.5 text-neutral-300 hover:text-neutral-100 disabled:opacity-25 disabled:pointer-events-none rounded hover:bg-neutral-800 transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className="p-1.5 text-neutral-300 hover:text-neutral-100 disabled:opacity-25 disabled:pointer-events-none rounded hover:bg-neutral-800 transition-colors"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Zone 3: Primary Actions (Save, Upload & Export HTML) */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {hasDoc && (
          <>
            {/* Prominent Save Button with Status Feedback */}
            <button
              onClick={onSave}
              disabled={isSaving}
              title="Save changes to persistent storage (Ctrl+S)"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border whitespace-nowrap shrink-0 shadow-sm ${
                isSaving
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-300 cursor-wait'
                  : isDirty
                  ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-emerald-900/30 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Saving...</span>
                </>
              ) : isDirty ? (
                <>
                  <Save className="w-3.5 h-3.5 text-white" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-neutral-200">
                    Saved{lastSavedTime ? ` · ${lastSavedTime}` : ''}
                  </span>
                </>
              )}
            </button>

            {onClearDocument && (
              <button
                onClick={onClearDocument}
                title="Close current newsletter and return to blank upload screen"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">New / Upload Another</span>
              </button>
            )}
          </>
        )}

        <button
          onClick={onOpenImportModal}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            !hasDoc
              ? 'bg-amber-400 text-neutral-950 font-semibold hover:bg-amber-300 shadow'
              : 'text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload HTML</span>
        </button>

        {hasDoc && (
          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0 hover:shadow-amber-500/20 hover:shadow-md"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export</span>
          </button>
        )}
      </div>
    </header>
  );
};
