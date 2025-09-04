import { X } from 'lucide-react'
import { useAuthModal } from './store'
import { ModalWrapper } from 'src/components/modal-wrapper'

export function AuthModal() {
  const { isOpen, closeModal, scopeId, mode } = useAuthModal()

  return (
    <ModalWrapper isOpen={isOpen} onClose={closeModal} scopeId={scopeId}>
      {/* Modal */}
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-auto md:max-h-[90vh] md:w-full md:max-w-md md:shadow-2xl">
        {/* Header - Her zaman sabit */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
          <h2 id="auth-title" className="text-lg font-semibold text-on-box-black">
            {mode === 'login'
              ? 'Giriş Yap'
              : mode === 'register'
                ? 'Kayıt Ol'
                : mode === 'forgot-password'
                  ? 'Şifre Sıfırla'
                  : 'Doğrulama'}
          </h2>
          <button
            onClick={closeModal}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Auth modal'ı kapat"
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
    </ModalWrapper>
  )
}
