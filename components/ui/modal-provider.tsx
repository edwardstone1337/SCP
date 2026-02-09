'use client'

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Modal } from '@/components/ui/modal'

interface ModalContextValue {
  openModal: (content: ReactNode, ariaLabel: string) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

interface ModalProviderProps {
  children: ReactNode
}

// Must match --transition-base in globals.css
const MODAL_EXIT_BUFFER_MS = 200

export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)
  const [ariaLabel, setAriaLabel] = useState('Dialog')
  const closeTimerRef = useRef<number | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openModal = useCallback((nextContent: ReactNode, nextAriaLabel: string) => {
    clearCloseTimer()
    setContent(nextContent)
    setAriaLabel(nextAriaLabel)
    setIsMounted(true)
    setIsOpen(true)
  }, [clearCloseTimer])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setIsMounted(false)
      setContent(null)
    }, MODAL_EXIT_BUFFER_MS)
  }, [clearCloseTimer])

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [clearCloseTimer])

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [openModal, closeModal]
  )

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isMounted && (
        <Modal isOpen={isOpen} onClose={closeModal} ariaLabel={ariaLabel}>
          {content}
        </Modal>
      )}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
