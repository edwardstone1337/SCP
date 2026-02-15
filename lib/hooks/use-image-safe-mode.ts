'use client'

import { useEffect, useRef } from 'react'

const EYE_OFF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>`

interface UseImageSafeModeOptions {
  containerRef: React.RefObject<HTMLElement | null>
  isEnabled: boolean
  isLoading: boolean
  /** A key that changes when the article content changes (e.g. SCP ID).
   *  Forces the effect to re-run and process the new DOM. */
  contentKey: string
}

/**
 * Processes article DOM to hide images when Image Safe Mode is enabled.
 * Creates clickable placeholders that reveal images on demand.
 *
 * Operates on real DOM nodes (not React virtual DOM) because SCP content
 * is raw HTML injected via dangerouslySetInnerHTML.
 */
export function useImageSafeMode({
  containerRef,
  isEnabled,
  isLoading,
  contentKey,
}: UseImageSafeModeOptions): void {
  // Track whether we've applied safe mode so cleanup is correct
  const appliedRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Always clean up previous article's state first when contentKey changes
    if (appliedRef.current) {
      restoreAllImages(container)
      appliedRef.current = false
    }

    // If loading or disabled, stay restored
    if (isLoading || !isEnabled) {
      return
    }

    // Apply safe mode to the current article
    hideImages(container)
    appliedRef.current = true

    return () => {
      // Cleanup on unmount or before re-run
      if (appliedRef.current && container) {
        restoreAllImages(container)
        appliedRef.current = false
      }
    }
  }, [containerRef, isEnabled, isLoading, contentKey])
}

/** Hide all images in the container and insert placeholders. */
function hideImages(container: HTMLElement): void {
  const images = container.querySelectorAll<HTMLImageElement>('img')

  images.forEach((img, index) => {
    // Skip if already processed (idempotency for React strict mode)
    if (img.hasAttribute('data-original-src')) return

    // Skip images with no meaningful src (decorative/broken)
    const src = img.getAttribute('src') || ''
    if (!src || src.startsWith('data:')) return

    // Store original src and hide
    img.setAttribute('data-original-src', src)
    img.setAttribute('src', '')
    img.classList.add('image-safe-hidden')

    // Determine placeholder dimensions
    const placeholderWidth = getPlaceholderWidth(img)

    // Build aria label using alt text if available
    const alt = img.getAttribute('alt')
    const ariaLabel = alt
      ? `Hidden image: ${alt} — click to reveal`
      : 'Hidden image — click to reveal'

    // Create placeholder button
    const placeholder = document.createElement('button')
    placeholder.className = 'image-safe-placeholder'
    placeholder.setAttribute('aria-label', ariaLabel)
    placeholder.setAttribute('data-image-id', `safe-img-${index}`)
    placeholder.setAttribute('type', 'button')
    placeholder.style.width = placeholderWidth

    placeholder.innerHTML = `${EYE_OFF_SVG}<span>Click to reveal image</span>`

    // Insert placeholder right after the image
    img.insertAdjacentElement('afterend', placeholder)

    // Reveal handler
    const reveal = () => {
      const originalSrc = img.getAttribute('data-original-src')
      if (originalSrc) {
        img.setAttribute('src', originalSrc)
        img.removeAttribute('data-original-src')
        img.classList.remove('image-safe-hidden')

        // Focus the revealed image for screen reader feedback
        img.setAttribute('tabindex', '-1')
        img.focus()
      }
      placeholder.remove()
    }

    placeholder.addEventListener('click', reveal)
  })
}

/** Restore all images and remove placeholders. */
function restoreAllImages(container: HTMLElement): void {
  // Restore hidden images
  const hiddenImages = container.querySelectorAll<HTMLImageElement>(
    'img[data-original-src]'
  )

  hiddenImages.forEach((img) => {
    const originalSrc = img.getAttribute('data-original-src')
    if (originalSrc) {
      img.setAttribute('src', originalSrc)
      img.removeAttribute('data-original-src')
    }
    img.classList.remove('image-safe-hidden')
    img.removeAttribute('tabindex')
  })

  // Remove all placeholders
  const placeholders = container.querySelectorAll('.image-safe-placeholder')
  placeholders.forEach((el) => el.remove())
}

/** Determine the width for a placeholder based on the image or its wrapper. */
function getPlaceholderWidth(img: HTMLImageElement): string {
  // Check explicit width attribute on image
  const widthAttr = img.getAttribute('width')
  if (widthAttr && !isNaN(Number(widthAttr))) {
    return `${widthAttr}px`
  }

  // Check inline style width on the image
  if (img.style.width) {
    return img.style.width
  }

  // Check parent .scp-image-block for width
  const block = img.closest('.scp-image-block')
  if (block instanceof HTMLElement) {
    if (block.style.width) {
      return block.style.width
    }
    const blockWidth = block.getAttribute('width')
    if (blockWidth && !isNaN(Number(blockWidth))) {
      return `${blockWidth}px`
    }
  }

  // Default: full width of content area
  return '100%'
}
