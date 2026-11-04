import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  UploadCloud,
  Scaling,
  Move,
  ArrowUp,
  ArrowDown,
  Check,
  GripHorizontal,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown as ChevronDownIcon,
  Sparkles,
  Layers,
  Trash2,
} from 'lucide-react';

export interface ImageResizeOverlayProps {
  imageEl: HTMLImageElement;
  containerEl: HTMLElement;
  onUpdate: () => void;
  onReplace: () => void;
  onDeselect: () => void;
}

export const ImageResizeOverlay: React.FC<ImageResizeOverlayProps> = ({
  imageEl,
  containerEl,
  onUpdate,
  onReplace,
  onDeselect,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Synchronously compute initial bounding rectangle
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>(() => {
    if (!imageEl) return { top: 0, left: 0, width: 120, height: 120 };
    const imgRect = imageEl.getBoundingClientRect();
    const parent = containerEl.parentElement || containerEl;
    const parentRect = parent.getBoundingClientRect();
    const top = imgRect.top - parentRect.top + (parent.scrollTop || 0);
    const left = imgRect.left - parentRect.left + (parent.scrollLeft || 0);
    return {
      top: Math.max(0, top),
      left: Math.max(0, left),
      width: Math.max(imgRect.width || imageEl.offsetWidth || 100, 40),
      height: Math.max(imgRect.height || imageEl.offsetHeight || 100, 30),
    };
  });

  const [currentWidth, setCurrentWidth] = useState<number>(() => {
    if (!imageEl) return 100;
    return Math.round(imageEl.getBoundingClientRect().width || imageEl.offsetWidth || 100);
  });
  const [currentHeight, setCurrentHeight] = useState<number>(() => {
    if (!imageEl) return 100;
    return Math.round(imageEl.getBoundingClientRect().height || imageEl.offsetHeight || 100);
  });

  const [currentAlign, setCurrentAlign] = useState<'left' | 'center' | 'right'>('center');
  
  // Show dropdown menu upon image click by default with 3 requested options
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDragMoveMode, setIsDragMoveMode] = useState<boolean>(false);
  const [showResizeHint, setShowResizeHint] = useState<boolean>(false);
  const [dragFeedback, setDragFeedback] = useState<string | null>(null);

  // Measure and align overlay with target image in container space
  const updatePosition = useCallback(() => {
    if (!imageEl || !containerEl) return;
    const imgRect = imageEl.getBoundingClientRect();
    const parentEl =
      (overlayRef.current?.offsetParent as HTMLElement) ||
      containerEl.parentElement ||
      containerEl;
    const parentRect = parentEl.getBoundingClientRect();

    const top = imgRect.top - parentRect.top + (parentEl.scrollTop || 0);
    const left = imgRect.left - parentRect.left + (parentEl.scrollLeft || 0);

    const w = Math.max(imgRect.width || imageEl.offsetWidth || 40, 30);
    const h = Math.max(imgRect.height || imageEl.offsetHeight || 30, 20);

    setRect({
      top,
      left,
      width: w,
      height: h,
    });
    setCurrentWidth(Math.round(w));
    setCurrentHeight(Math.round(h));

    // Detect alignment from inline styles or parent attributes
    const marginL = imageEl.style.marginLeft;
    const marginR = imageEl.style.marginRight;
    const parentTd = imageEl.closest('td');
    const parentAlign = parentTd?.getAttribute('align') || parentTd?.style.textAlign;
    const parentDiv = imageEl.parentElement;
    const divAlign = parentDiv?.style.textAlign;

    if (
      (marginL === 'auto' && marginR === 'auto') ||
      parentAlign === 'center' ||
      divAlign === 'center'
    ) {
      setCurrentAlign('center');
    } else if (
      (marginL === 'auto' && (marginR === '0px' || marginR === '0')) ||
      parentAlign === 'right' ||
      divAlign === 'right'
    ) {
      setCurrentAlign('right');
    } else {
      setCurrentAlign('left');
    }
  }, [imageEl, containerEl]);

  useEffect(() => {
    updatePosition();

    // Listen to container scroll, window scroll, and resize
    const handleScrollOrResize = () => {
      updatePosition();
    };

    containerEl.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Delay attaching document mousedown to prevent immediate deselect on mount
    let timerId: NodeJS.Timeout;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        overlayRef.current &&
        !overlayRef.current.contains(target) &&
        target !== imageEl &&
        !imageEl.contains(target)
      ) {
        onDeselect();
      }
    };

    timerId = setTimeout(() => {
      document.addEventListener('mousedown', handleDocumentClick);
    }, 150);

    return () => {
      clearTimeout(timerId);
      containerEl.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [containerEl, imageEl, onDeselect, updatePosition]);

  // ========================================================
  // DOCUMENT DRAG & DROP LISTENER (To drop image anywhere in newsletter)
  // ========================================================
  useEffect(() => {
    const handleContainerDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }

      // Find drop target position using caretRangeFromPoint or caretPositionFromPoint
      let range: Range | null = null;
      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if ((document as unknown as { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } }).caretPositionFromPoint) {
        const pos = (document as unknown as { caretPositionFromPoint: (x: number, y: number) => { offsetNode: Node; offset: number } }).caretPositionFromPoint(e.clientX, e.clientY);
        if (pos) {
          range = document.createRange();
          range.setStart(pos.offsetNode, pos.offset);
          range.collapse(true);
        }
      }

      // Show drop indicator line
      let indicator = document.getElementById('newsletter-drop-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'newsletter-drop-indicator';
        indicator.style.height = '4px';
        indicator.style.backgroundColor = '#f59e0b';
        indicator.style.borderRadius = '2px';
        indicator.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.8)';
        indicator.style.pointerEvents = 'none';
        indicator.style.margin = '6px 0';
      }

      if (range) {
        try {
          range.insertNode(indicator);
        } catch {
          // If range inside image or invalid node
        }
      }
    };

    const handleContainerDrop = (e: DragEvent) => {
      e.preventDefault();
      const indicator = document.getElementById('newsletter-drop-indicator');
      if (indicator && indicator.parentNode) {
        // Find best element to move: imageEl or its wrapping block
        const toMove =
          imageEl.parentElement &&
          imageEl.parentElement !== containerEl &&
          imageEl.parentElement.children.length === 1 &&
          ['P', 'DIV', 'CENTER'].includes(imageEl.parentElement.tagName)
            ? imageEl.parentElement
            : imageEl;

        indicator.parentNode.insertBefore(toMove, indicator);
        indicator.remove();

        setDragFeedback('Image moved to new location!');
        setTimeout(() => setDragFeedback(null), 2500);

        setTimeout(() => {
          updatePosition();
          onUpdate();
        }, 50);
      }
    };

    const handleContainerDragLeave = (e: DragEvent) => {
      if (!containerEl.contains(e.relatedTarget as Node)) {
        const indicator = document.getElementById('newsletter-drop-indicator');
        indicator?.remove();
      }
    };

    containerEl.addEventListener('dragover', handleContainerDragOver);
    containerEl.addEventListener('drop', handleContainerDrop);
    containerEl.addEventListener('dragleave', handleContainerDragLeave);

    return () => {
      containerEl.removeEventListener('dragover', handleContainerDragOver);
      containerEl.removeEventListener('drop', handleContainerDrop);
      containerEl.removeEventListener('dragleave', handleContainerDragLeave);
      const indicator = document.getElementById('newsletter-drop-indicator');
      indicator?.remove();
    };
  }, [containerEl, imageEl, onUpdate, updatePosition]);

  // Apply width and height to DOM image
  const setDimensions = useCallback(
    (w: number, h?: number) => {
      const safeW = Math.max(30, Math.round(w));
      imageEl.style.width = `${safeW}px`;
      imageEl.style.maxWidth = '100%';
      imageEl.setAttribute('width', String(safeW));

      if (h !== undefined) {
        const safeH = Math.max(20, Math.round(h));
        imageEl.style.height = `${safeH}px`;
        imageEl.setAttribute('height', String(safeH));
      } else {
        imageEl.style.height = 'auto';
        imageEl.removeAttribute('height');
      }

      setCurrentWidth(safeW);
      if (h !== undefined) setCurrentHeight(Math.round(h));
      updatePosition();
      onUpdate();
    },
    [imageEl, onUpdate, updatePosition]
  );

  // Nudge width: +/- delta px
  const nudgeWidth = (delta: number) => {
    const newW = Math.max(40, currentWidth + delta);
    setDimensions(newW);
  };

  // Nudge height: +/- delta px
  const nudgeHeight = (delta: number) => {
    const newH = Math.max(30, currentHeight + delta);
    setDimensions(currentWidth, newH);
  };

  // Move image UP or DOWN in DOM relative to surrounding blocks
  const moveImageDirection = (direction: 'up' | 'down') => {
    const toMove =
      imageEl.parentElement &&
      imageEl.parentElement !== containerEl &&
      imageEl.parentElement.children.length === 1 &&
      ['P', 'DIV', 'CENTER'].includes(imageEl.parentElement.tagName)
        ? imageEl.parentElement
        : imageEl;

    if (direction === 'up') {
      const prev = toMove.previousElementSibling;
      if (prev && prev.parentNode) {
        prev.parentNode.insertBefore(toMove, prev);
        setDragFeedback('Moved image up one section');
      } else {
        setDragFeedback('Already at the top');
      }
    } else {
      const next = toMove.nextElementSibling;
      if (next && next.parentNode) {
        next.parentNode.insertBefore(toMove, next.nextElementSibling);
        setDragFeedback('Moved image down one section');
      } else {
        setDragFeedback('Already at the bottom');
      }
    }

    setTimeout(() => setDragFeedback(null), 2000);
    setTimeout(() => {
      updatePosition();
      onUpdate();
    }, 50);
  };

  // Remove / Delete this image from the document
  const handleDeleteImage = () => {
    const parent = imageEl.parentElement;
    imageEl.remove();
    // Clean up empty wrapping p or div if it only held this image
    if (parent && parent !== containerEl && parent.children.length === 0 && !parent.textContent?.trim()) {
      parent.remove();
    }
    onDeselect();
    onUpdate();
  };

  // Set Preset Width
  const setPresetWidth = (preset: '25%' | '50%' | '75%' | '100%' | 'auto') => {
    if (preset === 'auto') {
      imageEl.style.width = 'auto';
      imageEl.style.maxWidth = '100%';
      imageEl.style.height = 'auto';
      imageEl.removeAttribute('width');
      imageEl.removeAttribute('height');
    } else {
      imageEl.style.width = preset;
      imageEl.style.maxWidth = '100%';
      imageEl.style.height = 'auto';
      imageEl.removeAttribute('height');
    }
    updatePosition();
    onUpdate();
  };

  // Alignment changer (Left, Center, Right)
  const setAlignment = (align: 'left' | 'center' | 'right') => {
    setCurrentAlign(align);
    imageEl.style.display = 'block';

    if (align === 'center') {
      imageEl.style.marginLeft = 'auto';
      imageEl.style.marginRight = 'auto';
      imageEl.style.float = 'none';
    } else if (align === 'right') {
      imageEl.style.marginLeft = 'auto';
      imageEl.style.marginRight = '0px';
      imageEl.style.float = 'none';
    } else {
      imageEl.style.marginLeft = '0px';
      imageEl.style.marginRight = 'auto';
      imageEl.style.float = 'none';
    }

    const parentTd = imageEl.closest('td');
    if (parentTd) {
      parentTd.setAttribute('align', align);
      parentTd.style.textAlign = align;
    }

    const parentDiv = imageEl.parentElement;
    if (parentDiv && parentDiv !== containerEl) {
      parentDiv.style.textAlign = align;
    }

    updatePosition();
    onUpdate();
  };

  // ========================================================
  // 4 CORNER RESIZE DRAG HANDLER (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
  // ========================================================
  const startCornerDrag = (corner: 'nw' | 'ne' | 'se' | 'sw') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = currentWidth || imageEl.offsetWidth || 100;
    const initialH = currentHeight || imageEl.offsetHeight || 100;
    const aspectRatio = initialW > 0 && initialH > 0 ? initialW / initialH : 1;

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let scaleDelta = 0;
      if (corner === 'se') {
        scaleDelta = (deltaX + deltaY * aspectRatio) / 2;
      } else if (corner === 'sw') {
        scaleDelta = (-deltaX + deltaY * aspectRatio) / 2;
      } else if (corner === 'ne') {
        scaleDelta = (deltaX + (-deltaY) * aspectRatio) / 2;
      } else if (corner === 'nw') {
        scaleDelta = (-deltaX + (-deltaY) * aspectRatio) / 2;
      }

      const newW = Math.max(30, Math.round(initialW + scaleDelta));
      const newH = Math.max(20, Math.round(newW / aspectRatio));

      imageEl.style.width = `${newW}px`;
      imageEl.style.maxWidth = '100%';
      imageEl.style.height = `${newH}px`;
      imageEl.setAttribute('width', String(newW));
      imageEl.setAttribute('height', String(newH));

      setCurrentWidth(newW);
      setCurrentHeight(newH);
      updatePosition();
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setIsDragging(false);
      updatePosition();
      onUpdate();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Touch support for 4 corners
  const startCornerTouchDrag = (corner: 'nw' | 'ne' | 'se' | 'sw') => (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.stopPropagation();
    setIsDragging(true);

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const initialW = currentWidth || imageEl.offsetWidth || 100;
    const initialH = currentHeight || imageEl.offsetHeight || 100;
    const aspectRatio = initialW > 0 && initialH > 0 ? initialW / initialH : 1;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length !== 1) return;
      moveEvent.preventDefault();
      const currentTouch = moveEvent.touches[0];
      const deltaX = currentTouch.clientX - startX;
      const deltaY = currentTouch.clientY - startY;

      let scaleDelta = 0;
      if (corner === 'se') {
        scaleDelta = (deltaX + deltaY * aspectRatio) / 2;
      } else if (corner === 'sw') {
        scaleDelta = (-deltaX + deltaY * aspectRatio) / 2;
      } else if (corner === 'ne') {
        scaleDelta = (deltaX + (-deltaY) * aspectRatio) / 2;
      } else if (corner === 'nw') {
        scaleDelta = (-deltaX + (-deltaY) * aspectRatio) / 2;
      }

      const newW = Math.max(30, Math.round(initialW + scaleDelta));
      const newH = Math.max(20, Math.round(newW / aspectRatio));

      imageEl.style.width = `${newW}px`;
      imageEl.style.maxWidth = '100%';
      imageEl.style.height = `${newH}px`;
      imageEl.setAttribute('width', String(newW));
      imageEl.setAttribute('height', String(newH));

      setCurrentWidth(newW);
      setCurrentHeight(newH);
      updatePosition();
    };

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      setIsDragging(false);
      updatePosition();
      onUpdate();
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  };

  // 4 SIDES DRAG HANDLER (Top, Bottom, Left, Right)
  const startDrag = (side: 'top' | 'bottom' | 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = currentWidth;
    const initialH = currentHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (side === 'right') {
        const newW = Math.max(40, initialW + deltaX);
        setDimensions(newW);
      } else if (side === 'left') {
        const newW = Math.max(40, initialW - deltaX);
        setDimensions(newW);
      } else if (side === 'bottom') {
        const newH = Math.max(30, initialH + deltaY);
        setDimensions(initialW, newH);
      } else if (side === 'top') {
        const newH = Math.max(30, initialH - deltaY);
        setDimensions(initialW, newH);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setIsDragging(false);
      updatePosition();
      onUpdate();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Cleanest placement for the dropdown menu
  const dropdownClass =
    rect.height >= 180
      ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      : rect.top < 150
      ? 'top-full mt-2 left-1/2 -translate-x-1/2'
      : '-top-3 left-1/2 -translate-x-1/2 -translate-y-full';

  return (
    <div
      ref={overlayRef}
      style={{
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
      className="absolute pointer-events-none z-40 ring-2 ring-amber-500 rounded select-none"
    >
      {/* Visual Bounding Box Glow */}
      <div
        className={`absolute inset-0 rounded pointer-events-none transition-colors ${
          isDragMoveMode
            ? 'bg-amber-500/30 ring-4 ring-amber-400'
            : isDragging
            ? 'bg-amber-500/25 ring-2 ring-amber-400'
            : 'bg-amber-500/10'
        }`}
      />

      {/* ======================================================== */}
      {/* CENTRAL DRAG & MOVE HANDLE (VISIBLE IN DRAG MODE)        */}
      {/* ======================================================== */}
      {isDragMoveMode && (
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'image-move');
            e.dataTransfer.effectAllowed = 'move';
            imageEl.classList.add('opacity-40');
          }}
          onDragEnd={() => {
            imageEl.classList.remove('opacity-40');
            updatePosition();
            onUpdate();
          }}
          title="Click and drag to drop this image anywhere in text or tables"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-grab active:cursor-grabbing bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-neutral-950 ring-4 ring-amber-500/50 hover:scale-105 transition-transform z-50 select-none animate-in zoom-in-95 duration-150"
        >
          <Move className="w-5 h-5 stroke-[2.8]" />
          <span className="text-xs tracking-wider uppercase">Drag Image Anywhere</span>
        </div>
      )}

      {/* Feedback toast */}
      {dragFeedback && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto bg-neutral-900 border border-amber-500/80 text-amber-300 text-xs px-3 py-1 rounded-full shadow-2xl font-semibold whitespace-nowrap z-50 animate-in fade-in duration-150">
          {dragFeedback}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4 HIGH-VISIBILITY CORNER RESIZE HANDLES (ALWAYS VISIBLE) */}
      {/* ======================================================== */}

      {/* 1. TOP-LEFT CORNER (NW) */}
      <div
        onMouseDown={startCornerDrag('nw')}
        onTouchStart={startCornerTouchDrag('nw')}
        title="Drag Top-Left corner to resize"
        className="absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-white border-[3px] border-amber-500 shadow-2xl cursor-nwse-resize pointer-events-auto flex items-center justify-center hover:scale-125 transition-transform z-50 group/nw ring-2 ring-black/70"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover/nw:bg-amber-400" />
      </div>

      {/* 2. TOP-RIGHT CORNER (NE) */}
      <div
        onMouseDown={startCornerDrag('ne')}
        onTouchStart={startCornerTouchDrag('ne')}
        title="Drag Top-Right corner to resize"
        className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-white border-[3px] border-amber-500 shadow-2xl cursor-nesw-resize pointer-events-auto flex items-center justify-center hover:scale-125 transition-transform z-50 group/ne ring-2 ring-black/70"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover/ne:bg-amber-400" />
      </div>

      {/* 3. BOTTOM-LEFT CORNER (SW) */}
      <div
        onMouseDown={startCornerDrag('sw')}
        onTouchStart={startCornerTouchDrag('sw')}
        title="Drag Bottom-Left corner to resize"
        className="absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full bg-white border-[3px] border-amber-500 shadow-2xl cursor-nesw-resize pointer-events-auto flex items-center justify-center hover:scale-125 transition-transform z-50 group/sw ring-2 ring-black/70"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover/sw:bg-amber-400" />
      </div>

      {/* 4. BOTTOM-RIGHT CORNER (SE) */}
      <div
        onMouseDown={startCornerDrag('se')}
        onTouchStart={startCornerTouchDrag('se')}
        title="Drag Bottom-Right corner to resize"
        className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white border-[3px] border-amber-500 shadow-2xl cursor-nwse-resize pointer-events-auto flex items-center justify-center hover:scale-125 transition-transform z-50 group/se ring-2 ring-black/70"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover/se:bg-amber-400" />
      </div>

      {/* ======================================================== */}
      {/* DROPDOWN MENU: Appears on image click                     */}
      {/* Contains: 1) Upload  2) Resize  3) Drag the image        */}
      {/* ======================================================== */}
      {isDropdownOpen && (
        <div
          className={`absolute ${dropdownClass} pointer-events-auto z-50 w-80 max-w-[92vw] bg-neutral-950/98 border-2 border-amber-500 rounded-2xl shadow-2xl p-3.5 text-neutral-100 backdrop-blur-xl animate-in zoom-in-95 duration-150`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-neutral-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Image Options
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                setShowResizeHint(true);
              }}
              className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Close options menu (Use 4-corner handles to resize)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* The 3 Primary Options Requested by User */}
          <div className="space-y-2">
            {/* 1. Upload the image */}
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                onReplace();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900 hover:bg-amber-500/20 border border-neutral-700/80 hover:border-amber-400 text-left transition-all group cursor-pointer shadow-sm"
            >
              <div className="p-2.5 rounded-lg bg-amber-400 text-neutral-950 group-hover:scale-105 transition-transform shrink-0 shadow">
                <UploadCloud className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-neutral-100 group-hover:text-amber-300 flex items-center justify-between">
                  <span>Upload the image</span>
                  <span className="text-[10px] text-amber-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    Pick &rarr;
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                  Choose file from device or enter image URL
                </div>
              </div>
            </button>

            {/* 2. Resize the image */}
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                setIsDragMoveMode(false);
                setShowResizeHint(true);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900 hover:bg-amber-500/20 border border-neutral-700/80 hover:border-amber-400 text-left transition-all group cursor-pointer shadow-sm"
            >
              <div className="p-2.5 rounded-lg bg-amber-400/20 text-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors shrink-0">
                <Scaling className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-neutral-100 group-hover:text-amber-300 flex items-center justify-between">
                  <span>Resize the image</span>
                  <span className="text-[10px] text-amber-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    Handles &rarr;
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                  Drag 4 corners or sides, presets & align
                </div>
              </div>
            </button>

            {/* 3. Drag the image (NEW) */}
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                setIsDragMoveMode(true);
                setShowResizeHint(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900 hover:bg-amber-500/20 border border-neutral-700/80 hover:border-amber-400 text-left transition-all group cursor-pointer shadow-sm"
            >
              <div className="p-2.5 rounded-lg bg-amber-400/20 text-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors shrink-0">
                <Move className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-neutral-100 group-hover:text-amber-300 flex items-center justify-between">
                  <span>Drag the image</span>
                  <span className="text-[10px] text-amber-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    Move &rarr;
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                  Drag & drop anywhere in newsletter, or move up/down
                </div>
              </div>
            </button>

            {/* 4. Delete / Remove image */}
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                handleDeleteImage();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900 hover:bg-red-500/20 border border-neutral-700/80 hover:border-red-500/80 text-left transition-all group cursor-pointer shadow-sm"
            >
              <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors shrink-0">
                <Trash2 className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-neutral-100 group-hover:text-red-300 flex items-center justify-between">
                  <span>Remove / Delete image</span>
                  <span className="text-[10px] text-red-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    Delete &times;
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                  Completely remove this picture from newsletter
                </div>
              </div>
            </button>
          </div>

          {/* Footer info badge */}
          <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>
              Size: <strong className="text-amber-300">{currentWidth}×{currentHeight}px</strong>
            </span>
            <button
              type="button"
              onClick={onDeselect}
              className="text-neutral-400 hover:text-white hover:underline cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Resize Hint banner when dropdown closes */}
      {showResizeHint && !isDropdownOpen && !isDragMoveMode && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-auto bg-amber-400 text-neutral-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in duration-200 whitespace-nowrap z-50">
          <span>&larr; Drag any of the 4 white corners to resize &rarr;</span>
          <button
            type="button"
            onClick={() => setShowResizeHint(false)}
            className="text-neutral-900 hover:text-black cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Drag Move Active Hint bar */}
      {isDragMoveMode && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-1.5 bg-neutral-950/95 border border-amber-500 rounded-full px-3 py-1 shadow-2xl text-[11px] font-bold text-amber-300 z-50 whitespace-nowrap">
          <Move className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Drag Handle Active: Grab handle and drop anywhere!</span>
          <div className="h-3 w-px bg-neutral-700 mx-1" />
          <button
            type="button"
            onClick={() => moveImageDirection('up')}
            title="Move Image Up"
            className="p-0.5 hover:bg-neutral-800 rounded text-neutral-200 hover:text-amber-400 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => moveImageDirection('down')}
            title="Move Image Down"
            className="p-0.5 hover:bg-neutral-800 rounded text-neutral-200 hover:text-amber-400 cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsDragMoveMode(false)}
            className="ml-1 text-neutral-400 hover:text-white cursor-pointer"
            title="Close drag mode"
          >
            &times;
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* FLOATING TOP TOOLBAR: Alignment, Presets, Actions        */}
      {/* ======================================================== */}
      <div
        className={`absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-1.5 p-1 bg-neutral-950/95 border border-amber-500/60 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap z-50 text-neutral-100 ${
          isDropdownOpen ? 'opacity-90' : 'opacity-100'
        }`}
      >
        {/* Toggle Dropdown Menu Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          title="Open Image Options Dropdown (Upload, Resize, Drag, or Delete)"
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
            isDropdownOpen
              ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold shadow'
              : 'bg-neutral-900 border-neutral-700 text-amber-300 hover:bg-neutral-800'
          }`}
        >
          <span>Options (4)</span>
          <ChevronDownIcon className="w-3.5 h-3.5" />
        </button>

        {/* Drag/Move Direct Toggle Button */}
        <button
          type="button"
          onClick={() => {
            setIsDragMoveMode((prev) => !prev);
            setIsDropdownOpen(false);
          }}
          title="Toggle Drag & Move Anywhere Mode"
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
            isDragMoveMode
              ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold shadow'
              : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-amber-500/20 hover:text-amber-300'
          }`}
        >
          <Move className="w-3.5 h-3.5 text-amber-400" />
          <span>Drag</span>
        </button>

        {/* Quick Shift Up / Down */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => moveImageDirection('up')}
            title="Move Image Up one section"
            className="p-1 hover:bg-neutral-800 rounded text-neutral-300 hover:text-amber-400 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => moveImageDirection('down')}
            title="Move Image Down one section"
            className="p-1 hover:bg-neutral-800 rounded text-neutral-300 hover:text-amber-400 cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upload Direct Button */}
        <button
          type="button"
          onClick={onReplace}
          title="Upload or Replace image"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-neutral-900 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5 text-amber-400 group-hover:text-neutral-950" />
          <span>Upload</span>
        </button>

        {/* Alignment Controls */}
        <div className="flex items-center gap-0.5 bg-neutral-900 border border-neutral-800 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setAlignment('left')}
            title="Align Left"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              currentAlign === 'left'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            title="Align Center"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              currentAlign === 'center'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            title="Align Right"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              currentAlign === 'right'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Width Presets */}
        <div className="hidden sm:flex items-center gap-0.5 bg-neutral-900 border border-neutral-800 p-0.5 rounded-lg text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setPresetWidth('100%')}
            title="100% Full Width"
            className="px-2 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            100%
          </button>
          <button
            type="button"
            onClick={() => setPresetWidth('75%')}
            title="75% Width"
            className="px-2 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            75%
          </button>
          <button
            type="button"
            onClick={() => setPresetWidth('50%')}
            title="50% Width"
            className="px-2 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => setPresetWidth('auto')}
            title="Original / Auto Dimensions"
            className="px-2 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Auto
          </button>
        </div>

        {/* Live Dimensions Display Badge */}
        <div className="px-2 py-1 text-[11px] font-mono bg-neutral-900 border border-neutral-800 rounded-md text-amber-300">
          {currentWidth} × {currentHeight}px
        </div>

        {/* Delete Image Button */}
        <button
          type="button"
          onClick={handleDeleteImage}
          title="Delete / Remove this image from the newsletter"
          className="p-1 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Done / Deselect Button */}
        <button
          type="button"
          onClick={onDeselect}
          title="Done editing (Close handles)"
          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <Check className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 4-SIDED RESIZE BUTTONS & HANDLES                         */}
      {/* ======================================================== */}

      {/* 1. TOP SIDE: Height Adjust & Drag */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center bg-neutral-900/95 border border-amber-500 rounded-full shadow-lg z-40 text-neutral-200 overflow-hidden">
        <button
          type="button"
          onClick={() => nudgeHeight(20)}
          title="Top: Increase Height (+20px)"
          className="px-1.5 py-0.5 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronUp className="w-3 h-3 stroke-[2.5]" />
        </button>
        <div
          onMouseDown={startDrag('top')}
          title="Drag top edge to resize height"
          className="px-2 py-0.5 cursor-ns-resize hover:bg-amber-500/20 text-[10px] font-mono text-neutral-300 font-bold flex items-center gap-0.5"
        >
          <GripHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[9px] uppercase tracking-wider text-amber-300">Top</span>
        </div>
        <button
          type="button"
          onClick={() => nudgeHeight(-20)}
          title="Top: Decrease Height (-20px)"
          className="px-1.5 py-0.5 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronDown className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. BOTTOM SIDE: Height Adjust & Drag */}
      <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center bg-neutral-900/95 border border-amber-500 rounded-full shadow-lg z-40 text-neutral-200 overflow-hidden">
        <button
          type="button"
          onClick={() => nudgeHeight(-20)}
          title="Bottom: Decrease Height (-20px)"
          className="px-1.5 py-0.5 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronUp className="w-3 h-3 stroke-[2.5]" />
        </button>
        <div
          onMouseDown={startDrag('bottom')}
          title="Drag bottom edge to resize height"
          className="px-2 py-0.5 cursor-ns-resize hover:bg-amber-500/20 text-[10px] font-mono text-neutral-300 font-bold flex items-center gap-0.5"
        >
          <GripHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[9px] uppercase tracking-wider text-amber-300">Bottom</span>
        </div>
        <button
          type="button"
          onClick={() => nudgeHeight(20)}
          title="Bottom: Increase Height (+20px)"
          className="px-1.5 py-0.5 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronDown className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* 3. LEFT SIDE: Width Adjust & Drag */}
      <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center bg-neutral-900/95 border border-amber-500 rounded-full shadow-lg z-40 text-neutral-200 overflow-hidden">
        <button
          type="button"
          onClick={() => nudgeWidth(20)}
          title="Left: Expand Width (+20px)"
          className="py-1 px-1 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
        </button>
        <div
          onMouseDown={startDrag('left')}
          title="Drag left edge to resize width"
          className="py-2 px-1 cursor-ew-resize hover:bg-amber-500/20 flex flex-col items-center justify-center"
        >
          <GripVertical className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[8px] uppercase tracking-wider text-amber-300 [writing-mode:vertical-lr] rotate-180">
            Left
          </span>
        </div>
        <button
          type="button"
          onClick={() => nudgeWidth(-20)}
          title="Left: Shrink Width (-20px)"
          className="py-1 px-1 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* 4. RIGHT SIDE: Width Adjust & Drag */}
      <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center bg-neutral-900/95 border border-amber-500 rounded-full shadow-lg z-40 text-neutral-200 overflow-hidden">
        <button
          type="button"
          onClick={() => nudgeWidth(-20)}
          title="Right: Shrink Width (-20px)"
          className="py-1 px-1 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
        </button>
        <div
          onMouseDown={startDrag('right')}
          title="Drag right edge to resize width"
          className="py-2 px-1 cursor-ew-resize hover:bg-amber-500/20 flex flex-col items-center justify-center"
        >
          <GripVertical className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[8px] uppercase tracking-wider text-amber-300 [writing-mode:vertical-lr]">
            Right
          </span>
        </div>
        <button
          type="button"
          onClick={() => nudgeWidth(20)}
          title="Right: Expand Width (+20px)"
          className="py-1 px-1 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
