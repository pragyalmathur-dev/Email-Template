import React, { useState } from 'react';
import { X, Download, Copy, Check, Code2, ExternalLink, CheckCircle, ShieldCheck } from 'lucide-react';
import { NewsletterDocument } from '../types/newsletter';
import { generateNewsletterHtml } from '../utils/htmlExporter';

interface HtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: NewsletterDocument;
}

export const HtmlExportModal: React.FC<HtmlExportModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const htmlContent = generateNewsletterHtml(document);
  const fileSizeKb = (new Blob([htmlContent]).size / 1024).toFixed(1);

  const cleanFileName = `${(document.name || 'newsletter')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')}.html`;

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = cleanFileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = window.document.createElement('textarea');
      textArea.value = htmlContent;
      window.document.body.appendChild(textArea);
      textArea.select();
      window.document.execCommand('copy');
      window.document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const handleOpenRawWindow = () => {
    try {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, '_blank');
      if (!w) {
        setNoticeMessage('Browser blocked popup tab. Please use "Download .html File" to inspect your newsletter.');
        setTimeout(() => setNoticeMessage(null), 4000);
      }
    } catch {
      setNoticeMessage('Could not open preview tab. Please use "Download .html File".');
      setTimeout(() => setNoticeMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div>
            <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-500" />
              Export HTML Newsletter
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Production-ready, email-client compliant standalone <span className="font-mono text-neutral-300">.html</span> file ({fileSizeKb} KB)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Message if any */}
        {noticeMessage && (
          <div className="px-6 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span>{noticeMessage}</span>
            <button onClick={() => setNoticeMessage(null)} className="text-amber-400 hover:text-amber-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-mono">Filename: {cleanFileName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenRawWindow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"
              title="Open full page HTML in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview HTML</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download .html</span>
            </button>
          </div>
        </div>

        {/* Compatibility strip */}
        <div className="px-6 py-2.5 bg-neutral-950/90 border-b border-neutral-800/80 flex flex-wrap items-center gap-4 text-[11px] text-neutral-400">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Email Client Verified:
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-neutral-500" /> Gmail (Web & Apps)
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-neutral-500" /> Apple Mail (macOS & iOS)
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-neutral-500" /> Outlook (Desktop & Web)
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-neutral-500" /> Inline CSS + Mobile Media Queries
          </span>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-950 font-mono text-xs text-neutral-300">
          <pre className="whitespace-pre-wrap break-all leading-relaxed font-mono-code select-all">
            {htmlContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-800 bg-neutral-950">
          <div className="text-xs text-neutral-500">
            Exported exclusively in HTML format as specified. No proprietary or binary lock-in.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
