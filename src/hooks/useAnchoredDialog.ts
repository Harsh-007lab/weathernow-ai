import { useState, useEffect, useRef, useCallback } from 'react';

interface DialogPosition {
  top: number;
  left: number;
  placement: 'bottom' | 'left' | 'right' | 'top';
}

interface UseAnchoredDialogOptions {
  preferredPlacement?: 'bottom' | 'left' | 'right' | 'top';
  offset?: number;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const useAnchoredDialog = (options: UseAnchoredDialogOptions = {}) => {
  const {
    preferredPlacement = 'bottom',
    offset = 12,
    autoClose = true,
    autoCloseDelay = 4000
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DialogPosition | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = useCallback((anchor: HTMLElement, dialog: HTMLElement): DialogPosition => {
    const anchorRect = anchor.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dialogWidth = dialogRect.width || 288; // Default width
    const dialogHeight = dialogRect.height || 150; // Increased estimated height
    
    // Find parent card to position below it
    let parentCard = anchor.closest('[class*="bg-white/10"], [class*="glass"]');
    const parentRect = parentCard?.getBoundingClientRect();

    let placement = preferredPlacement;
    let top = 0;
    let left = 0;
    
    // Enhanced offset for better spacing
    const enhancedOffset = offset + 8;

    // Calculate bottom placement
    if (placement === 'bottom') {
      // If inside a card, position below the card instead of the button
      if (parentRect) {
        top = parentRect.bottom + enhancedOffset;
        left = parentRect.left + (parentRect.width / 2) - (dialogWidth / 2);
      } else {
        top = anchorRect.bottom + enhancedOffset;
        left = anchorRect.left + (anchorRect.width / 2) - (dialogWidth / 2);
      }

      // Check if dialog fits below
      if (top + dialogHeight > viewportHeight - 24) {
        placement = 'top';
      }
    }

    // Calculate top placement
    if (placement === 'top') {
      // If inside a card, position above the card
      if (parentRect) {
        top = parentRect.top - dialogHeight - enhancedOffset;
        left = parentRect.left + (parentRect.width / 2) - (dialogWidth / 2);
      } else {
        top = anchorRect.top - dialogHeight - enhancedOffset;
        left = anchorRect.left + (anchorRect.width / 2) - (dialogWidth / 2);
      }

      // Check if dialog fits above
      if (top < 24) {
        placement = 'bottom';
        if (parentRect) {
          top = parentRect.bottom + enhancedOffset;
        } else {
          top = anchorRect.bottom + enhancedOffset;
        }
      }
    }

    // Calculate left placement
    if (placement === 'left') {
      top = anchorRect.top + (anchorRect.height / 2) - (dialogHeight / 2);
      left = anchorRect.left - dialogWidth - enhancedOffset;

      // Check if dialog fits to the left
      if (left < 24) {
        placement = 'right';
      }
    }

    // Calculate right placement
    if (placement === 'right') {
      top = anchorRect.top + (anchorRect.height / 2) - (dialogHeight / 2);
      left = anchorRect.right + enhancedOffset;

      // Check if dialog fits to the right
      if (left + dialogWidth > viewportWidth - 24) {
        placement = 'left';
        left = anchorRect.left - dialogWidth - enhancedOffset;
        
        // If still doesn't fit, fallback to bottom
        if (left < 24) {
          placement = 'bottom';
          if (parentRect) {
            top = parentRect.bottom + enhancedOffset;
            left = parentRect.left + (parentRect.width / 2) - (dialogWidth / 2);
          } else {
            top = anchorRect.bottom + enhancedOffset;
            left = anchorRect.left + (anchorRect.width / 2) - (dialogWidth / 2);
          }
        }
      }
    }

    // Clamp horizontal position to viewport with better margins
    left = Math.max(24, Math.min(left, viewportWidth - dialogWidth - 24));
    
    // Clamp vertical position to viewport with better margins
    top = Math.max(24, Math.min(top, viewportHeight - dialogHeight - 24));

    return { top, left, placement };
  }, [preferredPlacement, offset]);

  const updatePosition = useCallback(() => {
    if (anchorRef.current && dialogRef.current && isOpen) {
      const pos = calculatePosition(anchorRef.current, dialogRef.current);
      setPosition(pos);
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (isOpen) {
      // Initial position calculation (small delay for render)
      setTimeout(updatePosition, 10);

      // Update on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      // Auto-close timer
      if (autoClose) {
        timeoutRef.current = setTimeout(() => {
          setIsOpen(false);
        }, autoCloseDelay);
      }

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isOpen, updatePosition, autoClose, autoCloseDelay]);

  const toggle = useCallback((anchor?: HTMLElement) => {
    if (anchor) {
      anchorRef.current = anchor;
    }
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback((anchor: HTMLElement) => {
    anchorRef.current = anchor;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    isOpen,
    position,
    anchorRef,
    dialogRef,
    toggle,
    open,
    close,
  };
};
