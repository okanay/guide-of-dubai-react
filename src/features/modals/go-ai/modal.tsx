import { X } from 'lucide-react'
import { useGoAiModal } from './store'
import { ModalWrapper } from '@/features/modals/components/wrapper'

export function GoAiModal() {
  const { isOpen, closeModal, scopeId } = useGoAiModal()

  return (
    <ModalWrapper
      containerClassName="fixed inset-0 z-50 flex items-start justify-start p-0 md:inset-auto md:right-4 md:bottom-4 md:items-end md:justify-end md:p-0"
      overlayClassName="absolute inset-0 bg-black/50 md:hidden"
      isOpen={isOpen}
      onClose={closeModal}
      scopeId={scopeId}
    >
      {/* Modal Container */}
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-[500px] md:w-[380px] md:border md:border-gray-200 md:shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-primary-500 px-4 py-3 text-white">
          <h2 id="goai-title" className="text-lg font-semibold md:text-sm">
            Go.Ai Asistan
          </h2>
          <button
            onClick={closeModal}
            className="rounded-full p-1 text-white/80 transition-colors duration-300 hover:bg-white/10 hover:text-white"
            aria-label="Go.Ai asistanını kapat"
          >
            <X className="size-6 md:size-4" />
          </button>
        </div>

        {/* Content - Kaydırılabilir alan */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4">
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-600">Content</p>
            </div>
            {/* Mobil için extra spacing */}
            <div className="h-20 md:hidden" />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
          <p className="text-center text-gray-600 md:text-sm">Footer</p>
        </div>
      </div>
    </ModalWrapper>
  )
}
