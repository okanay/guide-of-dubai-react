import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TextInput } from 'src/features/public/components/form-ui/text-input'
import z from 'zod'
import { useAuthModal } from './store'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'

export function ForgotPasswordForm({ onClose }: { onClose: () => void }) {
  const { setMode } = useAuthModal()
  const { t } = useTranslation(['modal-global', 'errors-zod', 'common'])

  const forgotPasswordSchema = z.object({
    email: z.string().email(t('errors-zod:invalid_email')),
  })

  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

  const FORGOT_PASSWORD_DEFAULT_VALUES: Partial<ForgotPasswordFormData> = {
    email: '',
  }

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: FORGOT_PASSWORD_DEFAULT_VALUES,
    reValidateMode: 'onSubmit',
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onValidSubmit = async (data: ForgotPasswordFormData) => {
    try {
      console.log('Forgot password data:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(t('common:success_title'), {
        description: t('common:success_message'),
      })
      onClose()
    } catch (error) {
      toast.error(t('common:error_title'))
      console.error('Forgot password error:', error)
    }
  }

  const onInvalidSubmit = () => {
    if (errors.email?.message) {
      toast.error(t('common:error_title'), {
        description: errors.email.message,
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
          {t('modal-global:auth.back_to_login')}
        </button>
        <Icon name="brand/full-primary" width={144} className="mt-4 inline-block" />
        <h2 className="mb-1 text-size-4xl font-semibold text-on-box-black">
          {t('modal-global:auth.forgot_password_title')}
        </h2>
        <p className="text-size-sm text-on-box-black">
          {t('modal-global:auth.forgot_password_description')}
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
                label={t('modal-global:auth.form.email')}
                placeholder={t('modal-global:auth.form.email')}
                required
                value={field.value || ''}
                error={errors.email?.message}
              />
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xs bg-btn-primary py-2.5 font-semibold text-on-btn-primary hover:bg-btn-primary-hover disabled:opacity-50"
          >
            {isSubmitting ? t('common:sending') : t('modal-global:auth.forgot_password_button')}
          </button>
        </form>
      </div>
    </>
  )
}
