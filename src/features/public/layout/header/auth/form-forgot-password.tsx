import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TextInput } from 'src/features/public/components/form-ui/text-input'
import z from 'zod'
import { useAuthModal } from './store'
import Icon from '@/components/icon'

const forgotPasswordSchema = z.object({
  email: z.email('Geçerli bir e-posta adresi girin'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const FORGOT_PASSWORD_DEFAULT_VALUES: Partial<ForgotPasswordFormData> = {
  email: '',
}

export function ForgotPasswordForm({ onClose }: { onClose: () => void }) {
  const { setMode } = useAuthModal()

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
      // API çağrısı yapılacak
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simülasyon
      toast.success('Şifre sıfırlama bağlantısı e-postanıza gönderildi!')
      setMode('email-login')
    } catch (error) {
      toast.error('Şifre sıfırlama sırasında bir hata oluştu')
      console.error('Forgot password error:', error)
    }
  }

  const onInvalidSubmit = () => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean)
    if (errorMessages.length > 0) {
      toast.error('Form hatalarını düzeltin', {
        description: errorMessages.join(', '),
      })
    }
  }

  return (
    <>
      <header className="flex flex-col px-6 py-4">
        <button
          onClick={() => setMode('email-login')}
          className="flex items-center gap-x-1 text-size font-semibold"
        >
          <ChevronLeft />
          Geri git
        </button>
        <Icon name="brand/full-primary" width={144} className="mt-4 inline-block" />
        <h2 className="mb-1 text-size-4xl font-semibold text-on-box-black">
          Şifrenizi mi Unuttunuz?
        </h2>
        <p className="text-size-sm text-on-box-black">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
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
                label="E-posta"
                placeholder="E-posta adresinizi girin"
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
            {isSubmitting ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
          </button>
        </form>
      </div>
    </>
  )
}
