// src/features/modals/auth/modal.tsx - Updated for Global Modal S
import React from 'react'
import { ForgotPasswordForm } from './form-forgot-password'
import { EmailLoginForm } from './form-login'
import { RegisterForm } from './form-register'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'

export type AuthModalMode =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify'
  | 'email-login'
  | 'phone-login'

interface AuthModalProps {
  onClose?: () => void
  onGoBack?: () => void
  mode?: AuthModalMode
  closeOnBack?: boolean
}

export const AuthModalComponent: React.FC<AuthModalProps> = ({
  onClose,
  onGoBack,
  mode: initialMode = 'login',
  closeOnBack = false,
}) => {
  const { t } = useTranslation('global-modal')
  const [mode, setMode] = React.useState<AuthModalMode>(initialMode)

  const handleClose = () => {
    setMode('login') // Reset mode
    onClose?.()
  }

  const renderContent = () => {
    switch (mode) {
      case 'email-login':
        return <EmailLoginForm onClose={handleClose} setMode={setMode} closeOnBack={closeOnBack} />
      case 'register':
        return <RegisterForm onClose={handleClose} setMode={setMode} closeOnBack={closeOnBack} />
      case 'forgot-password':
        return <ForgotPasswordForm onClose={handleClose} setMode={setMode} />
      case 'phone-login':
        return <EmailLoginForm onClose={handleClose} setMode={setMode} />
      case 'login':
      default:
        return <LoginOptions onClose={handleClose} setMode={setMode} />
    }
  }

  return (
    <div className="pointer-events-auto relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-auto md:max-h-[90vh] md:w-full md:max-w-md md:shadow-2xl">
      {renderContent()}
    </div>
  )
}

function LoginOptions({
  onClose,
  setMode,
}: {
  onClose: () => void
  setMode: (mode: AuthModalMode) => void
}) {
  const { t } = useTranslation('global-modal')

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
        <LoginAuthButtons setMode={setMode} />
      </div>

      {/* Login Options Footer */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4 text-center text-balance">
        <LoginTermsText />
      </div>
    </>
  )
}

export const LoginAuthButtons = ({ setMode }: { setMode: (mode: AuthModalMode) => void }) => {
  const { t } = useTranslation('global-modal')

  return (
    <div className="flex flex-col gap-y-2">
      {/* Main Options */}
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
      {/* Divider */}
      <div className="flex items-center gap-x-2 py-2">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-500">{t('auth.or_divider')}</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      {/* Social Options */}
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
  )
}

export const LoginTermsText = () => {
  const { t } = useTranslation('global-modal')

  return (
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
