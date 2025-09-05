import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TextInput } from 'src/features/public/components/form-ui/text-input'
import z from 'zod'
import { useAuthModal } from './store'

const loginSchema = z.object({
  email: z.email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(1, 'Parola gereklidir').min(6, 'Parola en az 6 karakter olmalıdır'),
})

const LOGIN_DEFAULT_VALUES: Partial<LoginFormData> = {
  email: '',
  password: '',
}

type LoginFormData = z.infer<typeof loginSchema>

export function EmailLoginForm({ onClose }: { onClose: () => void }) {
  const { setMode } = useAuthModal()

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
      toast.success('Giriş başarılı!')
      onClose()
    } catch (error) {
      toast.error('Giriş yapılırken bir hata oluştu')
      console.error('Login error:', error)
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
          onClick={() => setMode('login')}
          className="flex items-center gap-x-1 text-size font-semibold"
        >
          <ChevronLeft />
          Geri git
        </button>
        <img src="/images/brand/brand-full-primary.svg" alt="Logo" className="mt-8 w-36" />
        <h2 className="mt-4 mb-1 text-size-4xl font-semibold text-on-box-black">
          Tekrar Hoşgeldiniz
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
                label="E-posta"
                placeholder="E-posta adresinizi girin"
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
                label="Parola"
                placeholder="Parolanızı girin"
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
            {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yapın'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => setMode('forgot-password')} className="text-sm text-primary-600">
            Şifrenizi mi unuttunuz?
          </button>
        </div>
      </div>
    </>
  )
}
