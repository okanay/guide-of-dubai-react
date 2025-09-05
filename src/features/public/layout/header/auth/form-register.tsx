import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TextInput } from 'src/features/public/components/form-ui/text-input'
import z from 'zod'
import { useAuthModal } from './store'
import { PhoneInput } from 'src/features/public/components/form-ui/phone-input'
import { Checkbox } from 'src/features/public/components/form-ui/checkbox'
import parsePhoneNumberFromString from 'libphonenumber-js/min'

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Ad gereklidir')
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  lastName: z
    .string()
    .min(1, 'Soyad gereklidir')
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(50, 'Soyad en fazla 50 karakter olabilir'),
  nationality: z.string().min(1, 'Uyruk seçimi gereklidir'),
  email: z.email('Geçerli bir e-posta adresi girin'),
  phone: z
    .string()
    .min(1, 'Telefon numarası gereklidir')
    .refine((phone) => {
      try {
        const phoneNumber = parsePhoneNumberFromString(phone, 'TR')
        return phoneNumber?.isValid() ?? false
      } catch {
        return false
      }
    }, 'Geçerli bir telefon numarası girin')
    .transform((phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone, 'TR')
      return phoneNumber!.format('E.164')
    }),
  referralCode: z
    .string()
    .optional()
    .refine((val) => !val || /^[A-Z0-9]{6,12}$/.test(val), {
      message: 'Referans kodu 6-12 karakter arası büyük harf ve rakam içermelidir',
    }),
  password: z
    .string()
    .min(1, 'Parola gereklidir')
    .min(6, 'Parola en az 6 karakter olmalıdır')
    .regex(/[A-Z]/, 'Parola en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Parola en az bir küçük harf içermelidir')
    .regex(/\d/, 'Parola en az bir rakam içermelidir'),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: 'Gizlilik politikasını kabul etmelisiniz',
  }),
  marketingConsent: z.boolean().optional(),
})

const REGISTER_DEFAULT_VALUES: Partial<RegisterFormData> = {
  firstName: '',
  lastName: '',
  nationality: '',
  email: '',
  phone: '',
  referralCode: '',
  password: '',
  privacyPolicy: false,
  marketingConsent: false,
}

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm({ onClose }: { onClose: () => void }) {
  const { setMode } = useAuthModal()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_DEFAULT_VALUES,
    reValidateMode: 'onSubmit',
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onValidSubmit = async (data: RegisterFormData) => {
    try {
      console.log('Register data:', data)
      // API çağrısı yapılacak
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simülasyon
      toast.success('Kayıt başarılı!')
      onClose()
    } catch (error) {
      toast.error('Kayıt olurken bir hata oluştu')
      console.error('Register error:', error)
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
        <h2 className="mt-4 mb-1 text-size-4xl font-semibold text-on-box-black">Hesap Oluşturun</h2>
        <p className="text-size-sm text-on-box-black">Hemen kayıt olun ve keşfetmeye başlayın.</p>
      </header>
      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto px-6 py-4">
        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="firstName"
                  label="Ad"
                  placeholder="Adınız"
                  required
                  value={field.value || ''}
                  error={errors.firstName?.message}
                  maxLength={50}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="lastName"
                  label="Soyad"
                  placeholder="Soyadınız"
                  required
                  value={field.value || ''}
                  error={errors.lastName?.message}
                  maxLength={50}
                />
              )}
            />
          </div>

          {/* Nationality - Select olacak ama şimdilik text */}
          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="nationality"
                label="Uyruk"
                placeholder="Seçiniz"
                required
                value={field.value || ''}
                error={errors.nationality?.message}
              />
            )}
          />

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
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                label="Telefon Numarası"
                placeholder="+90 532 546 8228"
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.phone?.message}
                required
              />
            )}
          />

          <Controller
            name="referralCode"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="referralCode"
                label="Referans Kodu"
                placeholder="Referans kodu (opsiyonel)"
                value={field.value || ''}
                error={errors.referralCode?.message}
                maxLength={12}
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
                placeholder="Parolanızı oluşturun"
                required
                value={field.value || ''}
                error={errors.password?.message}
                description="Parola büyük harf, küçük harf, rakam ve en az 6 karakter içermelidir"
              />
            )}
          />

          {/* Checkbox'lar - şimdilik basit input */}
          <div className="space-y-2">
            <Controller
              name="privacyPolicy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  id="terms-checkbox"
                  checked={field.value || false}
                  error={errors.privacyPolicy?.message}
                  onChange={field.onChange}
                  label={(<span className="text-size-sm">Şartları kabul ediyorum</span>) as any}
                />
              )}
            />

            <Controller
              name="marketingConsent"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  id="marketing-consent-checkbox"
                  checked={field.value || false}
                  error={errors.marketingConsent?.message}
                  onChange={field.onChange}
                  label={
                    (
                      <span className="text-size-sm">
                        Guide of Dubai'den haberdar olmak istiyorum
                      </span>
                    ) as any
                  }
                />
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xs bg-btn-primary py-2.5 font-semibold text-on-btn-primary hover:bg-btn-primary-hover disabled:opacity-50"
          >
            {isSubmitting ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </>
  )
}
