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
import { LivePreview, LivePreviewHandle } from './components/LivePreview';
import { InspectorPanel } from './components/InspectorPanel';
import { ImageReplacerModal } from './components/ImageReplacerModal';
import { AssetManagerDrawer } from './components/AssetManagerDrawer';
import { HtmlImportModal } from './components/HtmlImportModal';
import { HtmlExportModal } from './components/HtmlExportModal';
import { EmptyUploadState } from './components/EmptyUploadState';
import { ConfirmModal } from './components/ConfirmModal';

export default function App() {
  // Main Newsletter State: by default null (no newsletter loaded until user uploads or picks one)
  const [doc, setDoc] = useState<NewsletterDocument | null>(null);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // Persistence & Save State (Manual save only - no unwanted auto-saving)
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<NewsletterDocument[]>([]);
  const [future, setFuture] = useState<NewsletterDocument[]>([]);

  // Selection & UI state
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [activeTab, setActiveTab] = useState<AppTab>('canvas');
  const [sidebarTab, setSidebarTab] = useState<'blocks' | 'palette'>('blocks');

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Target image being replaced
  const [targetImageToReplace, setTargetImageToReplace] = useState<DetectedImage | null>(null);

  // Refs for tracking changes and live editor handle
  const livePreviewRef = useRef<LivePreviewHandle>(null);
  const lastHistorySnapshotRef = useRef<number>(Date.now());
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

  // 2. Manual Save function (Save Changes button / Ctrl+S)
  const saveDocumentNow = useCallback(async (documentToSave?: NewsletterDocument) => {
    let target = documentToSave || docRef.current;
    if (!target) return;

    // In rawHtmlMode, grab the latest unblurred DOM content from the editor
    if (target.rawHtmlMode && livePreviewRef.current) {
      const latestHtml = livePreviewRef.current.getLatestHtml();
      if (latestHtml !== null && latestHtml !== undefined && latestHtml.length > 0) {
        target = {
          ...target,
          rawHtmlContent: latestHtml,
          updatedAt: new Date().toISOString(),
        };
        setDoc(target);
        docRef.current = target;
      }
    }

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

  // 3. Document Mutator with Smart History Snapshots (Manual save only - no auto-save)
  const updateDocWithHistory = useCallback(
    (newDoc: NewsletterDocument, immediateHistory = true) => {
      const now = Date.now();
      const timeSinceLastSnapshot = now - lastHistorySnapshotRef.current;

      if (docRef.current) {
        if (immediateHistory || timeSinceLastSnapshot > 600) {
          setHistory((prev) => [...prev.slice(-35), docRef.current!]);
          setFuture([]);
          lastHistorySnapshotRef.current = now;
        }
      }

      setDoc(newDoc);
      docRef.current = newDoc;
      setIsDirty(true);
    },
    []
  );

  // 4. Undo and Redo handlers
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    if (docRef.current) {
      setFuture((prev) => [docRef.current!, ...prev]);
    }

    setDoc(previous);
    docRef.current = previous;
    setIsDirty(true);

    saveDocumentNow(previous);
  }, [history, saveDocumentNow]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    if (docRef.current) {
      setHistory((prev) => [...prev, docRef.current!]);
    }

    setDoc(next);
    docRef.current = next;
    setIsDirty(true);

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
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'e' && docRef.current) {
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
      if (isDirty && docRef.current) {
        saveDocumentNow();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, saveDocumentNow]);

  // Clear current newsletter and return to blank upload screen
  const handleClearDocument = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Close Newsletter & Return to Upload?',
      message: 'Any unsaved edits will be discarded and you will return to the blank upload screen.',
      confirmLabel: 'Close Newsletter',
      danger: true,
      onConfirm: async () => {
        await clearNewsletterStorage();
        setDoc(null);
        docRef.current = null;
        setHistory([]);
        setFuture([]);
        setIsDirty(false);
        setSelectedBlockId(null);
      },
    });
  };

  // Detected Images across current document
  const detectedImages = doc ? getAllImagesFromDocument(doc) : [];

  // Block Operations
  const handleUpdateBlock = (updated: NewsletterBlock) => {
    if (!doc) return;
    const updatedBlocks = doc.blocks.map((b) => (b.id === updated.id ? updated : b));
    updateDocWithHistory({ ...doc, blocks: updatedBlocks, updatedAt: new Date().toISOString() }, false);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!doc) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= doc.blocks.length) return;

    const newBlocks = [...doc.blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
  };

  const handleDuplicateBlock = (index: number) => {
    if (!doc) return;
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
    if (!doc) return;
    const newBlocks = doc.blocks.filter((_, i) => i !== index);
    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
    if (selectedBlockId === doc.blocks[index]?.id) {
      setSelectedBlockId(newBlocks[0]?.id || null);
    }
  };

  const handleToggleHideBlock = (index: number) => {
    if (!doc) return;
    const newBlocks = doc.blocks.map((b, i) => (i === index ? { ...b, hidden: !b.hidden } : b));
    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
  };

  const handleAddBlock = (newBlock: NewsletterBlock) => {
    if (!doc) return;
    const newBlocks = [...doc.blocks, newBlock];
    updateDocWithHistory({ ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() }, true);
    setSelectedBlockId(newBlock.id);
    setSidebarTab('blocks');
  };

  const handleUpdateMetadata = (newMetadata: NewsletterMetadata) => {
    if (!doc) return;
    updateDocWithHistory({ ...doc, metadata: newMetadata, updatedAt: new Date().toISOString() }, false);
  };

  // Image Replacement Handler (supports replacement url, alt, and alignment)
  const handleSaveImageReplacement = (
    targetImage: DetectedImage,
    newUrl: string,
    newAlt?: string,
    newAlign?: 'left' | 'center' | 'right'
  ) => {
    if (!doc) return;
    const updated = updateDocumentImage(doc, targetImage, newUrl, newAlt, newAlign);
    updateDocWithHistory(updated, true);
  };

  // Currently Selected Block Object
  const selectedBlock = doc ? doc.blocks.find((b) => b.id === selectedBlockId) || null : null;

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
        onClearDocument={doc ? handleClearDocument : undefined}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* If no document is loaded, show the clean default Upload Screen */}
        {!doc ? (
          <EmptyUploadState
            onLoadDocument={(newDoc) => {
              updateDocWithHistory(newDoc, true);
              if (newDoc.blocks && newDoc.blocks.length > 0) {
                setSelectedBlockId(newDoc.blocks[0].id);
              }
              saveDocumentNow(newDoc);
            }}
            onOpenPasteModal={() => setIsImportModalOpen(true)}
          />
        ) : (
          <>
            {/* Left Sidebar: Blocks Reorderer & Component Palette */}
            {activeTab === 'canvas' && !doc.rawHtmlMode && (
              <aside className="w-72 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 select-none min-h-0">
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
                    onClick={() => {
                      setConfirmModalConfig({
                        isOpen: true,
                        title: 'Reset to Sample Template?',
                        message: 'This will replace your current draft with the original Vianaar "The Inside Edit" sample template.',
                        confirmLabel: 'Reset to Sample',
                        danger: false,
                        onConfirm: async () => {
                          await clearNewsletterStorage();
                          setDoc(SAMPLE_VIANAAR_NEWSLETTER);
                          docRef.current = SAMPLE_VIANAAR_NEWSLETTER;
                          setSelectedBlockId(SAMPLE_VIANAAR_NEWSLETTER.blocks[0].id);
                          setHistory([]);
                          setFuture([]);
                          saveDocumentNow(SAMPLE_VIANAAR_NEWSLETTER);
                        },
                      });
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

            {/* Center Live Preview Window with Free Unrestricted Scrolling */}
            {activeTab === 'canvas' && (
              <LivePreview
                ref={livePreviewRef}
                document={doc}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onUpdateBlock={handleUpdateBlock}
                onAddBlock={handleAddBlock}
                onMoveBlock={handleMoveBlock}
                onDuplicateBlock={handleDuplicateBlock}
                onDeleteBlock={handleDeleteBlock}
                onOpenImageReplacer={(img) => setTargetImageToReplace(img)}
                viewport={viewport}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                onMarkDirty={() => setIsDirty(true)}
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
              <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden min-h-0">
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
          </>
        )}
      </div>

      {/* Image Replacer Modal */}
      {doc && (
        <ImageReplacerModal
          isOpen={!!targetImageToReplace}
          onClose={() => setTargetImageToReplace(null)}
          targetImage={targetImageToReplace}
          onSave={handleSaveImageReplacement}
        />
      )}

      {/* Central Asset Manager Drawer */}
      {doc && (
        <AssetManagerDrawer
          isOpen={isAssetDrawerOpen}
          onClose={() => setIsAssetDrawerOpen(false)}
          images={detectedImages}
          onSelectImageToReplace={(img) => {
            setIsAssetDrawerOpen(false);
            setTargetImageToReplace(img);
          }}
        />
      )}

      {/* HTML Import Modal */}
      <HtmlImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportDocument={(newDoc) => {
          updateDocWithHistory(newDoc, true);
          if (newDoc.blocks && newDoc.blocks.length > 0) {
            setSelectedBlockId(newDoc.blocks[0]?.id || null);
          }
          saveDocumentNow(newDoc);
        }}
      />

      {/* HTML Export Modal */}
      {doc && (
        <HtmlExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          document={doc}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        danger={confirmModalConfig.danger}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
