import { useState } from 'react'
import { Checkbox } from './checkbox'
import { RadioGroup } from './radio-input'
import { Select } from './select'
import { Slider } from './slider'
import { SliderMinMax } from './slider-min-max'
import { TextInput } from './text-input'
import { ToggleSwitch } from './toggle-switch'

export function ExampleForm() {
  // State'ler
  const [name, setName] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isToggled, setIsToggled] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const [sliderValue, setSliderValue] = useState(50)
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 25000])

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

      {/* ToggleSwitch */}
      <ToggleSwitch
        checked={isToggled}
        onChange={(e) => setIsToggled(e.target.checked)}
        label="Bildirimler"
        id="notifications"
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
        currency="$"
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
