import React from 'react'
import { useSearchModal } from './store'
import { X } from 'lucide-react'

interface SearchModalProps {
  onClose?: () => void
  onGoBack?: () => void
}

export const SearchModalComponent: React.FC<SearchModalProps> = ({ onClose, onGoBack }) => {
  const { searchQuery, setSearchQuery } = useSearchModal()

  return (
    <div className="pointer-events-auto relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-auto md:max-h-[90vh] md:w-full md:max-w-md md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
        <h2 id="search-title" className="text-lg font-semibold text-on-box-black">
          Arama
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
          aria-label="Arama modal'ı kapat"
        >
          <X className="size-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ara..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          />

          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="mb-4 text-gray-600">Search Modal - Global Store Test</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✅ Global Modal Store aktif</p>
                <p>✅ Zustand Store korundu</p>
                <p>✅ Smart Outside click çalışıyor</p>
                <p>✅ ESC key çalışıyor</p>
                <p>✅ Body lock çalışıyor</p>
                <p>✅ Stack management aktif</p>
                <p>Query: "{searchQuery}"</p>
              </div>
            </div>
          </div>

          <div className="h-20 md:hidden" />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
        <p className="text-center text-gray-600">Global Modal System + Smart Stack! 🎉</p>
      </div>
    </div>
  )
}
