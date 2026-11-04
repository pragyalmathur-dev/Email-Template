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
    <header className="h-16 border-b border-neutral-800 bg-neutral-950 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-30 select-none overflow-x-auto scrollbar-none">
      {/* Zone 1: Wordmark & Document Title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <a href="/" className="text-base font-bold tracking-tight text-neutral-100 flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-serif-editorial italic font-bold flex items-center justify-center text-lg">
            E
          </span>
          <span className="hidden sm:inline">EditoMail</span>
        </a>
        {hasDoc && (
          <div className="hidden 2xl:flex items-center gap-2 text-xs text-neutral-400 border-l border-neutral-800 pl-3">
            <span className="text-neutral-200 font-medium truncate max-w-[160px]">
              {document.name || 'Untitled Newsletter'}
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-[11px] text-neutral-400 whitespace-nowrap">
              {document.rawHtmlMode ? 'Uploaded HTML Mode' : `${document.blocks.length} sections`}
            </span>
          </div>
        )}
      </div>

      {/* Zone 2: Navigation Modes, Viewport & Undo/Redo */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {hasDoc && (
          <>
            {/* Workspace Mode Tabs */}
            <div className="flex items-center p-0.5 sm:p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
              <button
                onClick={() => onTabChange('canvas')}
                title="Visual Canvas Editor"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'canvas'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline">Editor</span>
              </button>

              <button
                onClick={() => onTabChange('assets')}
                title="All Newsletter Images & Assets"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'assets'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xl:inline">Images</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-neutral-950 rounded-full font-mono text-neutral-300">
                  {imageCount}
                </span>
              </button>

              <button
                onClick={() => onTabChange('code')}
                title="Inspect Standalone HTML Code"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'code'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xl:inline">HTML Code</span>
              </button>
            </div>

            {/* Viewport Width Switches */}
            {activeTab === 'canvas' && (
              <div className="hidden 2xl:flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
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

      {/* Zone 3: Primary Actions (Save, Upload & Export HTML - always prioritized) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {hasDoc && (
          <>
            {/* Prominent Save Button with Status Feedback */}
            <button
              onClick={onSave}
              disabled={isSaving}
              title="Save changes to persistent storage (Ctrl+S)"
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border whitespace-nowrap shrink-0 shadow-sm ${
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
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : isDirty ? (
                <>
                  <Save className="w-3.5 h-3.5 text-white" />
                  <span>
                    Save<span className="hidden md:inline"> Changes</span>
                  </span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-neutral-200">
                    Saved
                    <span className="hidden xl:inline">
                      {lastSavedTime ? ` · ${lastSavedTime}` : ''}
                    </span>
                  </span>
                </>
              )}
            </button>

            {onClearDocument && (
              <button
                onClick={onClearDocument}
                title="Close current newsletter and return to blank upload screen"
                className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            )}
          </>
        )}

        <button
          onClick={onOpenImportModal}
          title="Upload an HTML newsletter file"
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            !hasDoc
              ? 'bg-amber-400 text-neutral-950 font-semibold hover:bg-amber-300 shadow'
              : 'text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload HTML</span>
          <span className="sm:hidden">Upload</span>
        </button>

        {/* ALWAYS VISIBLE & PROMINENT EXPORT HTML BUTTON */}
        {hasDoc && (
          <button
            onClick={onOpenExportModal}
            title="Export edited newsletter as clean standalone HTML"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md whitespace-nowrap shrink-0 hover:shadow-amber-500/25 ring-1 ring-amber-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export HTML</span>
          </button>
        )}
      </div>
    </header>
  );
};
