import { X } from 'lucide-react'

interface GoAiModalProps {
  onClose?: () => void
  onGoBack?: () => void
}

export const GoAiModalComponent: React.FC<GoAiModalProps> = ({ onClose, onGoBack }) => {
  return (
    <div className="pointer-events-auto relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-[500px] md:w-[380px] md:border md:border-gray-200 md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-primary-500 px-4 py-3 text-white">
        <h2 id="goai-title" className="text-lg font-semibold md:text-sm">
          Go.Ai Asistan
        </h2>
        <button
          onClick={onClose}
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
  )
}
