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
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'

export function RegisterForm({ onClose }: { onClose: () => void }) {
  const { setMode } = useAuthModal()
  const { t } = useTranslation(['auth', 'zod-errors', 'common'])

  // Zod Schema with i18n
  const registerSchema = z
    .object({
      firstName: z
        .string()
        .min(1, t('zod-errors:required'))
        .min(2, t('zod-errors:string_min', { min: 2 }))
        .max(50, t('zod-errors:string_max', { max: 50 })),
      lastName: z
        .string()
        .min(1, t('zod-errors:required'))
        .min(2, t('zod-errors:string_min', { min: 2 }))
        .max(50, t('zod-errors:string_max', { max: 50 })),
      nationality: z.string().min(1, t('zod-errors:nationality_required')),
      email: z.string().min(1, t('zod-errors:required')).email(t('zod-errors:invalid_email')),
      phone: z
        .string()
        .min(1, t('zod-errors:required'))
        .refine((phone) => {
          try {
            const phoneNumber = parsePhoneNumberFromString(phone, 'TR')
            return phoneNumber?.isValid() ?? false
          } catch {
            return false
          }
        }, t('zod-errors:phone_invalid'))
        .transform((phone) => {
          const phoneNumber = parsePhoneNumberFromString(phone, 'TR')
          return phoneNumber!.format('E.164')
        }),
      referralCode: z
        .string()
        .optional()
        .refine((val) => !val || /^[A-Z0-9]{6,12}$/.test(val), {
          message: t('zod-errors:referral_code_format', { min: 6, max: 12 }),
        }),
      password: z
        .string()
        .min(1, t('zod-errors:required'))
        .min(6, t('zod-errors:password_min', { min: 6 }))
        .regex(/[A-Z]/, t('zod-errors:password_uppercase'))
        .regex(/[a-z]/, t('zod-errors:password_lowercase'))
        .regex(/\d/, t('zod-errors:password_number')),
      confirmPassword: z.string().min(1, t('zod-errors:required')),
      privacyPolicy: z.boolean().refine((val) => val === true, {
        message: t('zod-errors:privacy_acceptance'),
      }),
      marketingConsent: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('zod-errors:confirm_password'),
      path: ['confirmPassword'],
    })

  type RegisterFormData = z.infer<typeof registerSchema>

  const REGISTER_DEFAULT_VALUES: Partial<RegisterFormData> = {
    firstName: '',
    lastName: '',
    nationality: '',
    email: '',
    phone: '',
    referralCode: '',
    password: '',
    confirmPassword: '',
    privacyPolicy: false,
    marketingConsent: false,
  }

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_DEFAULT_VALUES,
    reValidateMode: 'onSubmit',
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = form

  const onValidSubmit = async (data: RegisterFormData) => {
    try {
      console.log('Register data:', data)
      // API çağrısı yapılacak
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simülasyon
      toast.success(t('common:success_title'))
      onClose()
    } catch (error) {
      toast.error(t('common:error_title'))
      console.error('Register error:', error)
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
          {t('auth:register_title')}
        </h2>
        <p className="text-size-sm text-on-box-black">{t('auth:register_description')}</p>
      </header>

      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto px-6 py-4">
        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="space-y-4">
          {/* Ad ve Soyad */}
          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="firstName"
                  label={t('auth:first_name_label')}
                  placeholder={t('auth:first_name_label')}
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
                  label={t('auth:last_name_label')}
                  placeholder={t('auth:last_name_label')}
                  required
                  value={field.value || ''}
                  error={errors.lastName?.message}
                  maxLength={50}
                />
              )}
            />
          </div>

          {/* Uyruk */}
          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="nationality"
                label={t('auth:nationality_label')}
                placeholder={t('auth:nationality_label')}
                required
                value={field.value || ''}
                error={errors.nationality?.message}
              />
            )}
          />

          {/* E-posta */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="email"
                type="email"
                label={t('auth:email_label')}
                placeholder={t('auth:email_label')}
                required
                value={field.value || ''}
                error={errors.email?.message}
              />
            )}
          />

          {/* Telefon */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                label={t('auth:phone_label')}
                placeholder="+90 532 546 8228"
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.phone?.message}
                required
              />
            )}
          />

          {/* Referans Kodu */}
          <Controller
            name="referralCode"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="referralCode"
                label={t('auth:referral_code_label')}
                placeholder={t('auth:referral_code_placeholder')}
                value={field.value || ''}
                error={errors.referralCode?.message}
                maxLength={12}
                style={{ textTransform: 'uppercase' }}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />

          {/* Parola */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="password"
                type="password"
                label={t('auth:password_label')}
                placeholder={t('auth:password_label')}
                required
                value={field.value || ''}
                error={errors.password?.message}
                description={t('auth:password_description')}
              />
            )}
          />

          {/* Parola Tekrarı */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="confirmPassword"
                type="password"
                label={t('auth:confirm_password_label')}
                placeholder={t('auth:confirm_password_label')}
                required
                value={field.value || ''}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {/* Checkbox'lar */}
          <div className="space-y-3">
            <Controller
              name="privacyPolicy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  id="privacy-checkbox"
                  checked={field.value || false}
                  error={errors.privacyPolicy?.message}
                  onChange={field.onChange}
                  label={
                    (<span className="text-size-sm">{t('auth:privacy_policy_label')}</span>) as any
                  }
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
                      <span className="text-size-sm">{t('auth:marketing_consent_label')}</span>
                    ) as any
                  }
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xs bg-btn-primary py-2.5 font-semibold text-on-btn-primary hover:bg-btn-primary-hover disabled:opacity-50"
          >
            {isSubmitting ? t('common:sending') : t('auth:register_button')}
          </button>
        </form>

        {/* Mobil için extra spacing */}
        <div className="h-20 md:hidden" />
      </div>
    </>
  )
}
