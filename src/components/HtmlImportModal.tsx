import React, { useState } from 'react';
import { X, Upload, Code2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { NewsletterDocument } from '../types/newsletter';
import { parseUploadedHtml } from '../utils/htmlParser';
import { SAMPLE_VIANAAR_NEWSLETTER, TEMPLATE_TECH_DISPATCH } from '../data/sampleNewsletter';

interface HtmlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportDocument: (doc: NewsletterDocument) => void;
}

export const HtmlImportModal: React.FC<HtmlImportModalProps> = ({
  isOpen,
  onClose,
  onImportDocument,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'templates'>('upload');
  const [rawHtmlText, setRawHtmlText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setFileContent(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setFileContent(content);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = () => {
    if (fileContent) {
      const doc = parseUploadedHtml(fileContent, uploadedFileName || 'uploaded-newsletter.html');
      onImportDocument(doc);
      onClose();
    }
  };

  const handleConfirmPaste = () => {
    if (rawHtmlText.trim()) {
      const doc = parseUploadedHtml(rawHtmlText, 'pasted-newsletter.html');
      onImportDocument(doc);
      onClose();
    }
  };

  const handleSelectTemplate = (template: NewsletterDocument) => {
    onImportDocument(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-500" />
              Upload or Select Newsletter
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Upload your HTML newsletter file, paste source code, or load a curated editorial template.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-800 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Upload .html File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Paste HTML Code
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Curated Templates
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-xl p-8 text-center bg-neutral-950/40 transition-colors group cursor-pointer relative"
              >
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-full bg-neutral-800 group-hover:bg-amber-500/20 text-neutral-300 group-hover:text-amber-400 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-neutral-200">
                  Drag and drop your newsletter <span className="text-amber-400 font-mono">.html</span> file here, or{' '}
                  <span className="text-amber-400 underline">browse</span>
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Works with files like <span className="text-neutral-400 font-mono">inside-edit-q2-2026.html</span> or any email markup.
                </p>

                {uploadedFileName && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Loaded: {uploadedFileName}</span>
                    <span className="text-neutral-400">({(fileContent.length / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-neutral-300">
                Paste Raw Newsletter HTML
              </label>
              <textarea
                rows={10}
                placeholder="<!DOCTYPE html><html><body>...</body></html>"
                value={rawHtmlText}
                onChange={(e) => setRawHtmlText(e.target.value)}
                className="w-full font-mono text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
              />
              <p className="text-xs text-neutral-500">
                You can edit all text and replace all images visually in live preview after importing.
              </p>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-3">
              <div
                onClick={() => handleSelectTemplate(SAMPLE_VIANAAR_NEWSLETTER)}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-amber-500/60 hover:bg-neutral-950 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
                      Featured Architectural Survey
                    </div>
                    <div className="text-sm font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                      The Inside Edit — Q2 2026 (Vianaar Inspired)
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Exact luxury layout with Villa Caisua hero, Indo-Portuguese verandahs, Goan laterite masonry, teak joinery, dispatches, and private viewing RSVP.
                    </p>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-semibold tracking-wider uppercase text-amber-400 bg-amber-500/10 rounded border border-amber-500/20">
                    Recommended
                  </span>
                </div>
              </div>

              <div
                onClick={() => handleSelectTemplate(TEMPLATE_TECH_DISPATCH)}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-950 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-1">
                      Product & Systems
                    </div>
                    <div className="text-sm font-bold text-neutral-100 group-hover:text-neutral-200 transition-colors">
                      Tech Velocity Weekly
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Clean corporate layout with system diagrams, code benchmarks, and developer workshop CTA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {activeTab === 'upload' && (
            <button
              onClick={handleConfirmUpload}
              disabled={!fileContent}
              className="px-5 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
            >
              Load Uploaded HTML
            </button>
          )}
          {activeTab === 'paste' && (
            <button
              onClick={handleConfirmPaste}
              disabled={!rawHtmlText.trim()}
              className="px-5 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
            >
              Parse Pasted HTML
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
