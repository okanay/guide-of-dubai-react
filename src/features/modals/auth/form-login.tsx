import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TextInput } from 'src/features/public/components/form-ui/text-input'
import z from 'zod'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'
import { AuthModalMode } from './modal'

interface EmailLoginFormProps {
  onClose: () => void
  setMode: (mode: AuthModalMode) => void
  closeOnLoginBack?: boolean
}

export function EmailLoginForm({ onClose, setMode, closeOnLoginBack }: EmailLoginFormProps) {
  const { t } = useTranslation(['global-modal', 'errors-zod', 'global-common'])

  const loginSchema = z.object({
    email: z.email(t('errors-zod:invalid_email')),
    password: z
      .string()
      .min(1, t('errors-zod:required'))
      .min(6, t('errors-zod:password_min', { min: 6 })),
  })

  type LoginFormData = z.infer<typeof loginSchema>

  const LOGIN_DEFAULT_VALUES: Partial<LoginFormData> = {
    email: '',
    password: '',
  }

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
    reValidateMode: 'onSubmit',
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onValidSubmit = async (data: LoginFormData) => {
    try {
      console.log('Login data:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(t('global-common:success_title'))
      onClose()
    } catch (error) {
      toast.error(t('global-common:error_title'))
      console.error('Login error:', error)
    }
  }

  const onInvalidSubmit = () => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean)
    if (errorMessages.length > 0) {
      toast.error(t('global-common:error_title'), {
        description: errorMessages.join(', '),
      })
    }
  }

  return (
    <>
      <header className="flex flex-col px-6 py-4">
        <button
          onClick={() => {
            if (closeOnLoginBack) {
              onClose()
            } else {
              setMode('login')
            }
          }}
          className="flex items-center gap-x-1 text-size font-semibold"
        >
          <ChevronLeft />
          {t('global-common:back')}
        </button>
        <Icon name="brand/full-primary" width={144} className="mt-4 inline-block" />
        <h2 className="mb-1 text-size-4xl font-semibold text-on-box-black">
          {t('global-modal:auth.login_title')}
        </h2>
        <p className="text-size-sm text-on-box-black">{t('global-modal:auth.login_description')}</p>
      </header>

      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto px-6 py-4">
        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="email"
                label={t('global-modal:auth.form.email')}
                placeholder={t('global-modal:auth.form.email')}
                required
                value={field.value || ''}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="password"
                type="password"
                label={t('global-modal:auth.form.password')}
                placeholder={t('global-modal:auth.form.password')}
                required
                value={field.value || ''}
                error={errors.password?.message}
              />
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xs bg-btn-primary py-2.5 font-semibold text-on-btn-primary hover:bg-btn-primary-hover disabled:opacity-50"
          >
            {isSubmitting ? t('global-common:sending') : t('global-modal:auth.login_button')}
          </button>
        </form>

        <div className="mt-4 text-center font-semibold">
          <button onClick={() => setMode('forgot-password')} className="text-sm text-btn-primary">
            {t('global-modal:auth.forgot_password_link')}
          </button>
        </div>
      </div>

      {/* Email Login Footer */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4 text-center">
        <div className="text-sm">
          <span>{t('global-modal:auth.no_account')} </span>
          <button onClick={() => setMode('register')} className="font-semibold text-btn-primary">
            {t('global-modal:auth.create_account')}
          </button>
        </div>
      </div>
    </>
  )
}
