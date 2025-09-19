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
import { CountrySelect } from '@/features/public/components/form-ui/country-select'

export function RegisterForm({ onClose }: { onClose: () => void }) {
  const { setMode } = useAuthModal()
  const { t } = useTranslation(['global-modal', 'errors-zod', 'global-common'])

  // Zod Schema with i18n
  const registerSchema = z
    .object({
      firstName: z
        .string()
        .min(1, t('errors-zod:required'))
        .min(2, t('errors-zod:string_min', { min: 2 }))
        .max(50, t('errors-zod:string_max', { max: 50 })),
      lastName: z
        .string()
        .min(1, t('errors-zod:required'))
        .min(2, t('errors-zod:string_min', { min: 2 }))
        .max(50, t('errors-zod:string_max', { max: 50 })),
      nationality: z.string().min(1, t('errors-zod:nationality_required')),
      email: z.email(t('errors-zod:invalid_email')),
      phone: z
        .string()
        .min(1, t('errors-zod:required'))
        .refine((phone) => {
          try {
            const phoneNumber = parsePhoneNumberFromString(phone)
            return phoneNumber?.isValid() ?? false
          } catch {
            return false
          }
        }, t('errors-zod:phone_invalid'))
        .transform((phone) => {
          const phoneNumber = parsePhoneNumberFromString(phone)
          return phoneNumber!.format('E.164')
        }),
      referralCode: z
        .string()
        .optional()
        .refine((val) => !val || /^[A-Z0-9]{6,12}$/.test(val), {
          message: t('errors-zod:referral_code_format', { min: 6, max: 12 }),
        }),
      password: z
        .string()
        .min(1, t('errors-zod:required'))
        .min(6, t('errors-zod:password_min', { min: 6 }))
        .regex(/[A-Z]/, t('errors-zod:password_uppercase'))
        .regex(/[a-z]/, t('errors-zod:password_lowercase'))
        .regex(/\d/, t('errors-zod:password_number')),
      confirmPassword: z.string().min(1, t('errors-zod:required')),
      privacyPolicy: z.boolean().refine((val) => val === true, {
        message: t('errors-zod:privacy_acceptance'),
      }),
      marketingConsent: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('errors-zod:confirm_password'),
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
  } = form

  const onValidSubmit = async (data: RegisterFormData) => {
    try {
      console.log('Register data:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(t('global-common:success_title'))
      onClose()
    } catch (error) {
      toast.error(t('global-common:error_title'))
      console.error('Register error:', error)
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
          onClick={() => setMode('login')}
          className="flex items-center gap-x-1 text-size font-semibold"
        >
          <ChevronLeft />
          {t('global-common:back')}
        </button>
        <Icon name="brand/full-primary" width={144} className="mt-2 -mb-5 inline-block" />
      </header>

      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto px-6 pb-4">
        <h2 className="text-size-4xl font-semibold text-on-box-black">
          {t('global-modal:auth.register_title')}
        </h2>
        <p className="mb-6 text-size-sm text-on-box-black">
          {t('global-modal:auth.register_description')}
        </p>
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
                  label={t('global-modal:auth.form.first_name')}
                  placeholder={t('global-modal:auth.form.first_name')}
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
                  label={t('global-modal:auth.form.last_name')}
                  placeholder={t('global-modal:auth.form.last_name')}
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
              <CountrySelect
                {...field}
                id="nationality"
                label={t('global-modal:auth.form.nationality')}
                placeholder={t('global-modal:auth.form.nationality')}
                required
                error={errors.nationality?.message}
                value={field.value || ''}
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
                label={t('global-modal:auth.form.email')}
                placeholder={t('global-modal:auth.form.email')}
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
                label={t('global-modal:auth.form.phone')}
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
                label={t('global-modal:auth.form.referral_code')}
                placeholder={t('global-modal:auth.form.referral_code_placeholder')}
                value={field.value || ''}
                error={errors.referralCode?.message}
                maxLength={12}
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
                label={t('global-modal:auth.form.password')}
                placeholder={t('global-modal:auth.form.password')}
                required
                value={field.value || ''}
                error={errors.password?.message}
                description={t('global-modal:auth.form.password_description')}
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
                label={t('global-modal:auth.form.confirm_password')}
                placeholder={t('global-modal:auth.form.confirm_password')}
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
                    (
                      <span className="text-size-sm">{t('global-modal:auth.privacy_policy')}</span>
                    ) as any
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
                      <span className="text-size-sm">
                        {t('global-modal:auth.marketing_consent')}
                      </span>
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
            {isSubmitting ? t('global-common:sending') : t('global-modal:auth.register_button')}
          </button>
        </form>

        <div className="h-20 md:hidden" />
      </div>

      {/* Register Footer */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4 text-center">
        <div className="text-sm">
          <span>{t('global-modal:auth.have_account')} </span>
          <button onClick={() => setMode('email-login')} className="font-semibold text-btn-primary">
            {t('global-modal:auth.login_link')}
          </button>
        </div>
      </div>
    </>
  )
}
