import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Layers,
  PlusCircle,
  FileCode2,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import {
  DetectedImage,
  NewsletterBlock,
  NewsletterDocument,
  NewsletterMetadata,
} from './types/newsletter';
import { SAMPLE_VIANAAR_NEWSLETTER } from './data/sampleNewsletter';
import { getAllImagesFromDocument, updateDocumentImage } from './utils/htmlParser';
import { generateNewsletterHtml } from './utils/htmlExporter';
import {
  saveNewsletterToStorage,
  loadNewsletterFromStorage,
  clearNewsletterStorage,
} from './utils/storage';
import { Header, ViewportMode, AppTab } from './components/Header';
import { BlockList } from './components/BlockList';
import { BlockPalette } from './components/BlockPalette';
import { LivePreview } from './components/LivePreview';
import { InspectorPanel } from './components/InspectorPanel';
import { ImageReplacerModal } from './components/ImageReplacerModal';
import { AssetManagerDrawer } from './components/AssetManagerDrawer';
import { HtmlImportModal } from './components/HtmlImportModal';
import { HtmlExportModal } from './components/HtmlExportModal';

export default function App() {
  // Main Newsletter State (starts with initial default, then restores from IndexedDB)
  const [doc, setDoc] = useState<NewsletterDocument>(SAMPLE_VIANAAR_NEWSLETTER);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // Persistence & Save State
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<NewsletterDocument[]>([]);
  const [future, setFuture] = useState<NewsletterDocument[]>([]);

  // Selection & UI state
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    SAMPLE_VIANAAR_NEWSLETTER.blocks[0]?.id || null
  );
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [activeTab, setActiveTab] = useState<AppTab>('canvas');
  const [sidebarTab, setSidebarTab] = useState<'blocks' | 'palette'>('blocks');

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);

  // Target image being replaced
  const [targetImageToReplace, setTargetImageToReplace] = useState<DetectedImage | null>(null);

  // Ref to track typing debounce for history
  const lastHistorySnapshotRef = useRef<number>(Date.now());
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const docRef = useRef(doc);
  docRef.current = doc;

  // 1. Initial Load from Persistent Storage (IndexedDB + LocalStorage)
  useEffect(() => {
    let mounted = true;
    async function restoreSavedData() {
      try {
        const saved = await loadNewsletterFromStorage();
        if (mounted && saved) {
          setDoc(saved);
          docRef.current = saved;
          if (saved.blocks && saved.blocks.length > 0) {
            setSelectedBlockId(saved.blocks[0].id);
          }
          setLastSavedTime(
            new Date(saved.updatedAt || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          );
        }
      } catch (err) {
        console.warn('Error restoring newsletter from storage:', err);
      } finally {
        if (mounted) setIsStorageLoaded(true);
      }
    }

    restoreSavedData();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Save function (manual or auto)
  const saveDocumentNow = useCallback(async (documentToSave?: NewsletterDocument) => {
    const target = documentToSave || docRef.current;
    setIsSaving(true);
    try {
      await saveNewsletterToStorage(target);
      setIsDirty(false);
      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastSavedTime(timeStr);
    } catch (err) {
      console.error('Failed to save newsletter to storage:', err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // 3. Document Mutator with Smart History Snapshots & Auto-Save
  const updateDocWithHistory = useCallback(
    (newDoc: NewsletterDocument, immediateHistory = true) => {
      const now = Date.now();
      const timeSinceLastSnapshot = now - lastHistorySnapshotRef.current;

      // Only push to history if immediate (like block delete/reorder/image swap)
      // or if at least 600ms has elapsed since the last typing snapshot
      if (immediateHistory || timeSinceLastSnapshot > 600) {
        setHistory((prev) => [...prev.slice(-35), docRef.current]);
        setFuture([]);
        lastHistorySnapshotRef.current = now;
      }

      setDoc(newDoc);
      docRef.current = newDoc;
      setIsDirty(true);

      // Debounce auto-save: saves to IndexedDB within 700ms of idle typing
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        saveDocumentNow(newDoc);
      }, 700);
    },
    [saveDocumentNow]
  );

  // 4. Undo and Redo handlers
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setFuture((prev) => [docRef.current, ...prev]);

    setDoc(previous);
    docRef.current = previous;
    setIsDirty(true);

    // Save undone state to storage
    saveDocumentNow(previous);
  }, [history, saveDocumentNow]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev, docRef.current]);

    setDoc(next);
    docRef.current = next;
    setIsDirty(true);

    // Save redone state to storage
    saveDocumentNow(next);
  }, [future, saveDocumentNow]);

  // 5. Global Keyboard Shortcuts: Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+S (Save), Ctrl+E (Export)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        (isCmdOrCtrl && e.key.toLowerCase() === 'y') ||
        (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveDocumentNow();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, saveDocumentNow]);

  // 6. BeforeUnload warning if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        saveDocumentNow();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, saveDocumentNow]);

  // Detected Images across current document
  const detectedImages = getAllImagesFromDocument(doc);

  // Block Operations
  const handleUpdateBlock = (updated: NewsletterBlock) => {
    const updatedBlocks = doc.blocks.map((b) => (b.id === updated.id ? updated : b));
    updateDocWithHistory({ ...doc, blocks: updatedBlocks, updatedAt: new Date().toISOString() }, false);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= doc.blocks.length) return;

    const newBlocks = [...doc.blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
  };

  const handleDuplicateBlock = (index: number) => {
    const blockToCopy = doc.blocks[index];
    if (!blockToCopy) return;

    const duplicatedBlock: NewsletterBlock = {
      ...JSON.parse(JSON.stringify(blockToCopy)),
      id: `block-${blockToCopy.type}-${Date.now()}`,
      title: blockToCopy.title ? `${blockToCopy.title} (Copy)` : undefined,
    };

    const newBlocks = [...doc.blocks];
    newBlocks.splice(index + 1, 0, duplicatedBlock);
    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
    setSelectedBlockId(duplicatedBlock.id);
  };

  const handleDeleteBlock = (index: number) => {
    const newBlocks = doc.blocks.filter((_, i) => i !== index);
    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
    if (selectedBlockId === doc.blocks[index]?.id) {
      setSelectedBlockId(newBlocks[0]?.id || null);
    }
  };

  const handleToggleHideBlock = (index: number) => {
    const newBlocks = doc.blocks.map((b, i) => (i === index ? { ...b, hidden: !b.hidden } : b));
    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
  };

  const handleAddBlock = (newBlock: NewsletterBlock) => {
    const newBlocks = [...doc.blocks, newBlock];
    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
    setSelectedBlockId(newBlock.id);
    setSidebarTab('blocks');
  };

  const handleUpdateMetadata = (newMetadata: NewsletterMetadata) => {
    updateDocWithHistory({ ...doc, metadata: newMetadata, updatedAt: new Date().toISOString() }, false);
  };

  // Image Replacement Handler
  const handleSaveImageReplacement = (
    targetImage: DetectedImage,
    newUrl: string,
    newAlt?: string
  ) => {
    const updated = updateDocumentImage(doc, targetImage, newUrl, newAlt);
    updateDocWithHistory(updated, true);
  };

  // Currently Selected Block Object
  const selectedBlock = doc.blocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Top Bar Header with Persistent Save Button */}
      <Header
        document={doc}
        viewport={viewport}
        onViewportChange={setViewport}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'assets') {
            setIsAssetDrawerOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        imageCount={detectedImages.length}
        isDirty={isDirty}
        isSaving={isSaving}
        lastSavedTime={lastSavedTime}
        onSave={() => saveDocumentNow()}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Blocks Reorderer & Component Palette */}
        {activeTab === 'canvas' && !doc.rawHtmlMode && (
          <aside className="w-72 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 select-none">
            {/* Sidebar Tab Selector */}
            <div className="flex items-center border-b border-neutral-800 p-2 bg-neutral-900/60">
              <button
                onClick={() => setSidebarTab('blocks')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sidebarTab === 'blocks'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Sections ({doc.blocks.length})</span>
              </button>

              <button
                onClick={() => setSidebarTab('palette')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sidebarTab === 'palette'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Add Block</span>
              </button>
            </div>

            {/* Sidebar Body */}
            <div className="flex-1 overflow-y-auto">
              {sidebarTab === 'blocks' ? (
                <BlockList
                  blocks={doc.blocks}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  onMoveBlock={handleMoveBlock}
                  onDuplicateBlock={handleDuplicateBlock}
                  onDeleteBlock={handleDeleteBlock}
                  onToggleHideBlock={handleToggleHideBlock}
                />
              ) : (
                <BlockPalette onAddBlock={handleAddBlock} />
              )}
            </div>

            {/* Sidebar Bottom Reset / Preset Strip */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
              <button
                type="button"
                onClick={async () => {
                  if (confirm('Reset to Vianaar "The Inside Edit" sample template? This will replace your current draft.')) {
                    await clearNewsletterStorage();
                    setDoc(SAMPLE_VIANAAR_NEWSLETTER);
                    docRef.current = SAMPLE_VIANAAR_NEWSLETTER;
                    setSelectedBlockId(SAMPLE_VIANAAR_NEWSLETTER.blocks[0].id);
                    setHistory([]);
                    setFuture([]);
                    saveDocumentNow(SAMPLE_VIANAAR_NEWSLETTER);
                  }
                }}
                className="inline-flex items-center gap-1 hover:text-neutral-200 text-[11px]"
                title="Reset to original sample"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Sample
              </button>
              <button
                type="button"
                onClick={() => setIsAssetDrawerOpen(true)}
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px] font-medium"
              >
                <ImageIcon className="w-3 h-3" />
                Manage Images ({detectedImages.length})
              </button>
            </div>
          </aside>
        )}

        {/* Center Live Preview Window */}
        {activeTab === 'canvas' && (
          <LivePreview
            document={doc}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={handleUpdateBlock}
            onMoveBlock={handleMoveBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onDeleteBlock={handleDeleteBlock}
            onOpenImageReplacer={(img) => setTargetImageToReplace(img)}
            viewport={viewport}
            onUpdateRawHtml={(newHtml) => {
              updateDocWithHistory(
                {
                  ...doc,
                  rawHtmlContent: newHtml,
                  updatedAt: new Date().toISOString(),
                },
                false
              );
            }}
          />
        )}

        {/* Code View Tab */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-neutral-900/60">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <FileCode2 className="w-4 h-4 text-amber-500" />
                <span>Live Standalone HTML Output</span>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-300">
                  {(new Blob([generateNewsletterHtml(doc)]).size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded shadow"
              >
                Export / Download File
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-neutral-300 bg-neutral-950">
              <pre className="whitespace-pre-wrap break-all leading-relaxed font-mono-code select-all">
                {generateNewsletterHtml(doc)}
              </pre>
            </div>
          </div>
        )}

        {/* Right Inspector Panel */}
        {activeTab === 'canvas' && !doc.rawHtmlMode && (
          <InspectorPanel
            selectedBlock={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
            metadata={doc.metadata}
            onUpdateMetadata={handleUpdateMetadata}
            onOpenImageReplacer={(img) => setTargetImageToReplace(img)}
          />
        )}
      </div>

      {/* Image Replacer Modal */}
      <ImageReplacerModal
        isOpen={!!targetImageToReplace}
        onClose={() => setTargetImageToReplace(null)}
        targetImage={targetImageToReplace}
        onSave={handleSaveImageReplacement}
      />

      {/* Central Asset Manager Drawer */}
      <AssetManagerDrawer
        isOpen={isAssetDrawerOpen}
        onClose={() => setIsAssetDrawerOpen(false)}
        images={detectedImages}
        onSelectImageToReplace={(img) => {
          setIsAssetDrawerOpen(false);
          setTargetImageToReplace(img);
        }}
      />

      {/* HTML Import Modal */}
      <HtmlImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportDocument={(newDoc) => {
          updateDocWithHistory(newDoc, true);
          setSelectedBlockId(newDoc.blocks[0]?.id || null);
          saveDocumentNow(newDoc);
        }}
      />

      {/* HTML Export Modal */}
      <HtmlExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        document={doc}
      />
    </div>
  );
}
