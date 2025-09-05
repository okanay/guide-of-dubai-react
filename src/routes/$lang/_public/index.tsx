import { createFileRoute } from '@tanstack/react-router'
import { IndexPage } from 'src/features/public/pages/index'

export const Route = createFileRoute('/$lang/_public/')({
  component: ExampleForm,
})

import { Checkbox } from 'src/features/public/components/form-ui/checkbox'
import { RadioGroup } from 'src/features/public/components/form-ui/radio-input'
import { Select } from 'src/features/public/components/form-ui/select'
import { Slider } from 'src/features/public/components/form-ui/slider'
import { ToggleSwitch } from 'src/features/public/components/form-ui/toggle-switch'

export function ExampleForm() {
  const countryOptions = [
    { value: 'tr', label: 'Türkiye' },
    { value: 'us', label: 'ABD' },
    { value: 'de', label: 'Almanya' },
    { value: 'fr', label: 'Fransa' },
  ]

  const genderOptions = [
    { value: 'male', label: 'Erkek' },
    { value: 'female', label: 'Kadın' },
  ]

  return (
    <form className="mx-auto max-w-md space-y-6 p-6">
      <Checkbox checked label="Şartları ve koşulları kabul ediyorum" required />
      <Checkbox label="Şartları ve koşulları kabul ediyorum" required />

      <ToggleSwitch checked label="Bildirimler" id="notifications-2" />
      <ToggleSwitch label="Bildirimler" id="notifications" />

      <Slider label="Ses seviyesi" min={0} max={100} />
      <Select label="Ülke" placeholder="Ülke seçiniz" options={countryOptions} required />
      <RadioGroup label="Cinsiyet" name="gender" value="male" options={genderOptions} required />
    </form>
  )
}
