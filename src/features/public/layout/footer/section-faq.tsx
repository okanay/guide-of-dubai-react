import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqData = [
  { question: 'Guide of Dubai nedir?' },
  { question: 'Turu özelleştirebilir miyim?' },
  { question: 'Bir Çöl Safarisi’nde neler var?' },
  { question: 'Burj Khalifa biletleri tura dahil mi?' },
  { question: 'Özel turlar rezervasyonu yapabilir miyim?' },
  { question: 'Şehir turlarınıza Geleceğin Müzesi dahil mi?' },
  { question: 'Çöl Safarisi için güvenlik önlemleri nelerdir?' },
  { question: 'Guide of Dubai ile turu nasıl rezerve ederim?' },
  { question: 'Turlarda ulaşım dahil mi?' },
  { question: 'Sorularım için müşteri hizmetleriyle nasıl iletişim kurabilirim?' },
  { question: 'Dubai Şehir Turu ne kadar sürer?' },
  { question: 'Turumu iptal edersem geri ödeme alabilir miyim?' },
  { question: "Dubai'yi ziyaret etmek için vizeye ihtiyacım var mı?" },
  { question: "Miracle Garden'ı yıl boyunca ziyaret edebilir miyim?" },
]

// Cevaplar için Lorem Ipsum metni
const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

export const PublicFooterFAQSection = () => {
  return (
    <div className="bg-transparent px-4 text-on-box-black">
      <div className="mx-auto max-w-main py-10">
        <h2 className="text-start text-size-lg font-bold">
          Turlar Hakkında Daha Fazla Bilgi Edinin
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {/* Sol Sütun */}
          <div className="flex flex-col">
            {faqData.slice(0, 7).map((item, index) => (
              <FaqItem key={index} question={item.question}>
                <p>{loremIpsum}</p>
              </FaqItem>
            ))}
          </div>

          {/* Sağ Sütun */}
          <div className="flex flex-col">
            {faqData.slice(7).map((item, index) => (
              <FaqItem key={index} question={item.question}>
                <p>{loremIpsum}</p>
              </FaqItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FaqItemProps {
  question: string
  children: React.ReactNode
}

export function FaqItem({ question, children }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-white/20 py-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        data-open={isOpen}
        className="flex w-full flex-col items-start justify-start border-b border-gray-100 pb-1 text-left transition-[padding] duration-100 data-[open=true]:pb-3"
        aria-expanded={isOpen}
      >
        <span className="flex w-full items-center justify-between">
          <span className="text-body text-gray-800">{question}</span>
          <ChevronDown />
        </span>

        <span
          className="grid grid-rows-[0fr] pt-2 transition-[grid-template-rows] duration-300 ease-in-out"
          style={{
            gridTemplateRows: isOpen ? '1fr' : '0fr',
          }}
        >
          <span className="overflow-hidden">
            <span className="pt-3 text-body text-gray-800">{children}</span>
          </span>
        </span>
      </button>
    </div>
  )
}
