import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TextInput } from 'src/features/public/components/form-ui/text-input'
import z from 'zod'
import { useAuthModal } from './store'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'

export function EmailLoginForm({ onClose }: { onClose: () => void }) {
  const { setMode } = useAuthModal()
  const { t } = useTranslation(['modal-auth', 'errors-zod', 'common'])

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
      // API çağrısı yapılacak
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simülasyon
      toast.success(t('common:success_title'))
      onClose()
    } catch (error) {
      toast.error(t('common:error_title'))
      console.error('Login error:', error)
    }
  }

  const onInvalidSubmit = () => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean)
    if (errorMessages.length > 0) {
      toast.error(t('common:error_title'), {
        description: errorMessages.join(', '),
      })
    }
  }

  return (
    <>
      <header className="flex flex-col px-6 py-4">
        <button
          onClick={() => setMode('login')}
          className="flex items-center gap-x-1 text-size font-semibold"
        >
          <ChevronLeft />
          {t('common:back')}
        </button>
        <Icon name="brand/full-primary" width={144} className="mt-4 inline-block" />
        <h2 className="mb-1 text-size-4xl font-semibold text-on-box-black">
          {t('modal-auth:login_title')}
        </h2>
        <p className="text-size-sm text-on-box-black">
          Hemen giriş yapın ve keşfetmeye devam edin.
        </p>
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
                label={t('modal-auth:email_label')}
                placeholder={t('modal-auth:email_label')}
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
                label={t('modal-auth:password_label')}
                placeholder={t('modal-auth:password_label')}
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
            {isSubmitting ? t('common:sending') : t('modal-auth:login_button')}
          </button>
        </form>

        <div className="mt-4 text-center font-semibold">
          <button onClick={() => setMode('forgot-password')} className="text-sm text-btn-primary">
            {t('modal-auth:forgot_password_title')}
          </button>
        </div>
      </div>
    </>
  )
}
