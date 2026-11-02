import React, { useState } from 'react';
import {
  Upload,
  FileCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { NewsletterDocument } from '../types/newsletter';
import { parseUploadedHtml } from '../utils/htmlParser';
import { SAMPLE_VIANAAR_NEWSLETTER } from '../data/sampleNewsletter';

interface EmptyUploadStateProps {
  onLoadDocument: (doc: NewsletterDocument) => void;
  onOpenPasteModal: () => void;
}

export const EmptyUploadState: React.FC<EmptyUploadStateProps> = ({
  onLoadDocument,
  onOpenPasteModal,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const doc = parseUploadedHtml(content, file.name);
        onLoadDocument(doc);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const doc = parseUploadedHtml(content, file.name);
        onLoadDocument(doc);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 min-h-0">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-300">
        {/* Main Title & Hero Intro */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            HTML Newsletter Studio
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
            Upload Your Newsletter HTML
          </h1>
          <p className="text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Upload an existing HTML newsletter to edit content inline, replace images, adjust blocks, and export clean HTML ready for email distribution.
          </p>
        </div>

        {/* Big Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-10 md:p-12 text-center transition-all cursor-pointer group ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900/80'
          }`}
        >
          <input
            type="file"
            accept=".html,.htm"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="w-16 h-16 rounded-2xl bg-neutral-800 group-hover:bg-amber-500/20 text-neutral-300 group-hover:text-amber-400 flex items-center justify-center mx-auto mb-5 transition-colors shadow-inner">
            <Upload className="w-8 h-8 stroke-[1.75]" />
          </div>

          <h3 className="text-base font-semibold text-neutral-100 mb-1">
            Drag & drop your <span className="font-mono text-amber-400">.html</span> file here
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            Supports standard email HTML templates, responsive tables, and custom inline designs
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-20">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md cursor-pointer hover:shadow-amber-500/20">
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Browse HTML File</span>
              <input
                type="file"
                accept=".html,.htm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPasteModal();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors"
            >
              <FileCode className="w-4 h-4 text-neutral-400" />
              <span>Paste HTML Code</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
              <Layers className="w-4 h-4 text-amber-400" />
              Inline Text Editing
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Click any text node, title, or button directly in the preview to edit with instant updates.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              Image Replacement
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Hover over any photo in your newsletter to swap it with your local files, image URLs, or presets.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
              <RotateCcw className="w-4 h-4 text-blue-400" />
              Undo / Redo & Save
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Persistent storage retains your changes across refreshes with <kbd className="text-[10px] bg-neutral-800 px-1 py-0.5 rounded font-mono">Ctrl+Z</kbd> undo support.
            </p>
          </div>
        </div>

        {/* Optional Sample Template Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onLoadDocument(SAMPLE_VIANAAR_NEWSLETTER)}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-amber-400 transition-colors"
          >
            <span>Or test with a sample template: <strong>The Inside Edit (Vianaar Q2 2026)</strong></span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
