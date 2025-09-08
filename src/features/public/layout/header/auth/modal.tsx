import { ModalWrapper } from 'src/components/modal-wrapper'
import { ForgotPasswordForm } from './form-forgot-password'
import { EmailLoginForm } from './form-login'
import { RegisterForm } from './form-register'
import { useAuthModal } from './store'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'

export function AuthModal() {
  const { isOpen, closeModal, scopeId, mode, setMode } = useAuthModal()
  const { t } = useTranslation('layout-header')

  const handleClose = () => {
    closeModal()
    setTimeout(() => setMode('login'), 300)
  }

  const renderContent = () => {
    switch (mode) {
      case 'email-login':
        return <EmailLoginForm onClose={handleClose} />
      case 'register':
        return <RegisterForm onClose={handleClose} />
      case 'forgot-password':
        return <ForgotPasswordForm onClose={handleClose} />
      case 'phone-login':
        return <EmailLoginForm onClose={handleClose} />
      case 'login':
      default:
        return <LoginOptions onClose={handleClose} />
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} scopeId={scopeId}>
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-auto md:max-h-[90vh] md:w-full md:max-w-md md:shadow-2xl">
        {/* Dinamik içerik (Header + Body) */}
        {renderContent()}

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4 text-center">
          {mode === 'login' && (
            <p className="text-xs text-gray-500">
              {t('auth.terms_text')}{' '}
              <a href="#" className="underline">
                {t('auth.terms_link')}
              </a>{' '}
              ve{' '}
              <a href="#" className="underline">
                {t('auth.privacy_link')}
              </a>{' '}
              {t('auth.terms_accept')}
            </p>
          )}
          {(mode === 'email-login' || mode === 'forgot-password') && (
            <div className="text-sm">
              <span>{t('auth.no_account')} </span>
              <button
                onClick={() => setMode('register')}
                className="font-semibold text-btn-primary"
              >
                {t('auth.create_account')}
              </button>
            </div>
          )}
          {mode === 'register' && (
            <div className="text-sm">
              <span>{t('auth.have_account')} </span>
              <button
                onClick={() => setMode('email-login')}
                className="font-semibold text-btn-primary"
              >
                {t('auth.login_link')}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  )
}

function LoginOptions({ onClose }: { onClose: () => void }) {
  const { setMode } = useAuthModal()
  const { t } = useTranslation('public-header')

  return (
    <>
      <div className="flex shrink-0 items-start justify-between border-b border-gray-200 bg-box-surface px-6 py-4">
        <div className="flex-1 text-center">
          <h2 className="text-start text-lg font-semibold text-on-box-black">
            {t('auth.welcome_title')}
          </h2>
          <p className="mt-1 text-start text-sm text-gray-600">{t('auth.welcome_description')}</p>
        </div>
        <div className="w-8">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-200 p-1.5 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Kapat"
          >
            <Icon name="cancel" className="size-4" />
          </button>
        </div>
      </div>
      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <AuthButton
              icon="phone"
              iconClass="h-5 w-5 text-black"
              label={t('auth.continue_with_phone')}
              onClick={() => setMode('phone-login')}
            />
            <AuthButton
              icon="email"
              iconClass="h-5 w-5"
              label={t('auth.continue_with_email')}
              onClick={() => setMode('email-login')}
            />
          </div>
          <div className="flex items-center gap-x-2 py-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">{t('auth.or_divider')}</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="space-y-2">
            <AuthButton
              icon="socials/apple"
              iconClass="h-5 w-5 text-black dark:invert"
              label={t('auth.continue_with_apple')}
              onClick={() => {}}
            />
            <AuthButton
              icon="socials/google"
              iconClass="h-5 w-5"
              label={t('auth.continue_with_google')}
              onClick={() => {}}
            />
            <AuthButton
              icon="socials/facebook"
              iconClass="h-5 w-5"
              label={t('auth.continue_with_facebook')}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  )
}

interface AuthButtonProps {
  icon: string
  iconClass: string
  label: string
  onClick: () => void
}

function AuthButton({ icon, iconClass, label, onClick }: AuthButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xs border border-gray-300 p-3 hover:bg-gray-50"
    >
      <div className="flex items-center gap-x-4">
        <Icon name={icon} className={iconClass} />
        <span className="font-semibold">{label}</span>
      </div>
      <Icon name="chevron-right" className="h-5 w-5 text-gray-400" />
    </button>
  )
}
