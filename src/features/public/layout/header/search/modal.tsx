import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSearchModal } from './store'

export function SearchModal() {
  const { isOpen, closeModal, scopeId } = useSearchModal()
  const modalRef = useRef<HTMLDivElement>(null)

  // Find scope element for click outside
  const scopeElement = scopeId
    ? scopeId === 'body'
      ? document.body
      : document.getElementById(scopeId)
    : document.body

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-start p-0 md:items-center md:justify-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledled="search-title"
    >
      {/* Overlay - sadece desktop'ta görünür */}
      <div className="absolute inset-0 hidden bg-black/50 md:block" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-auto md:max-h-[90vh] md:w-full md:max-w-lg md:shadow-2xl"
      >
        {/* Header - Her zaman sabit */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
          <h2 id="search-title" className="text-lg font-semibold text-on-box-black">
            Arama
          </h2>
          <button
            onClick={closeModal}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Arama modal'ı kapat"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content - Kaydırılabilir alan */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-600">Content</p>
            </div>
            {/* Mobil için extra spacing */}
            <div className="h-20 md:hidden" />
          </div>
        </div>

        {/* Footer - Her zaman sabit */}
        <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
          <p className="text-center text-gray-600">Footer</p>
        </div>
      </div>
    </div>,
    scopeElement!,
  )
}
