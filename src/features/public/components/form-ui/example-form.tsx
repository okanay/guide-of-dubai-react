import { useState } from 'react'
import { Checkbox } from './checkbox'
import { RadioGroup } from './radio-input'
import { Select } from './select'
import { Slider } from './slider'
import { SliderMinMax } from './slider-min-max'
import { TextInput } from './text-input'
import { ToggleSwitch } from './toggle-switch'
import { PhoneInput } from './phone-input'
import { NumericStepper } from './numeric-stepper'
import { DatePicker } from './date-picker'
import { TimePicker } from './time-picker'

export function ExampleForm() {
  // State'ler
  const [name, setName] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isToggled, setIsToggled] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const [sliderValue, setSliderValue] = useState(50)
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 25000])
  const [phone, setPhone] = useState('')
  const [adults, setAdults] = useState(1)
  const [alisTarihi, setAlisTarihi] = useState<Date | null>(new Date())
  const [standardTime, setStandardTime] = useState('10:00')

  // Options
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
      <h1 className="mb-8 text-center text-heading-2 font-bold">Form Test</h1>

      {/* TextInput */}
      <TextInput
        label="İsim"
        placeholder="Adınızı girin"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={50}
      />

      {/* Checkbox */}
      <Checkbox
        id="terms-checkbox" // ID eklendi
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)} // Düzeltildi
        label="Şartları kabul ediyorum"
        required
      />

      <DatePicker label="Alış Tarihi" value={alisTarihi} onChange={setAlisTarihi} required />

      {/* ToggleSwitch */}
      <ToggleSwitch
        checked={isToggled}
        onChange={(e) => setIsToggled(e.target.checked)}
        label="Bildirimler"
        id="notifications"
      />

      <TimePicker
        label="Etkinlik Saati"
        value={standardTime}
        onChange={setStandardTime}
        allowedTimes={['09:00', '12:30', '16:00', '20:00']}
        description="Etkinlik sadece 09:00, 12:30, 16:00 ve 20:00'de mevcuttur. Girdiğiniz saat en yakınına sabitlenir."
      />

      {/* Slider */}
      <Slider
        label="Ses seviyesi"
        min={0}
        max={100}
        value={sliderValue}
        onChange={setSliderValue}
      />

      {/* Slider */}
      <SliderMinMax
        label="Bütçe Aralığı"
        min={0}
        max={25000}
        step={500}
        value={budgetRange}
        onChange={setBudgetRange}
      />

      {/* Select */}
      <Select
        label="Ülke"
        placeholder="Ülke seçiniz"
        options={countryOptions}
        value={selectedCountry}
        onChange={setSelectedCountry}
        required
      />

      <NumericStepper
        label="Yetişkin Sayısı"
        value={adults}
        onChange={setAdults}
        min={1}
        max={10}
        description="Minimum 1 yetişkin olmalıdır."
      />

      <PhoneInput
        label="Telefon Numarası"
        value={phone}
        onChange={setPhone}
        placeholder="+90 (5XX) XXX XX XX"
        required
      />

      {/* RadioGroup */}
      <RadioGroup
        label="Cinsiyet"
        name="gender"
        value={selectedGender}
        onChange={setSelectedGender}
        options={genderOptions}
        required
      />
    </form>
  )
}
