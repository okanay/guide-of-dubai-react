import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FaqItem {
  question: string
  answer: string
}

export const PublicFooterFAQSection = () => {
  const { t } = useTranslation('layout-footer')

  // FAQ verilerini array olarak al
  const faqItems: FaqItem[] = t('faq.items', { returnObjects: true }) as FaqItem[]

  // Array'i iki parçaya böl
  const leftColumnItems = faqItems.slice(0, Math.ceil(faqItems.length / 2))
  const rightColumnItems = faqItems.slice(Math.ceil(faqItems.length / 2))

  return (
    <div className="bg-transparent px-4 text-on-box-black">
      <div className="mx-auto max-w-main py-10">
        <h2 className="text-start text-size-lg font-bold">{t('faq.title')}</h2>

        <div className="mt-4 grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {/* Sol Sütun */}
          <div className="flex flex-col">
            {leftColumnItems.map((item, index) => (
              <FaqItemComponent
                key={`left-${index}`}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>

          {/* Sağ Sütun */}
          <div className="flex flex-col">
            {rightColumnItems.map((item, index) => (
              <FaqItemComponent
                key={`right-${index}`}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FaqItemComponentProps {
  question: string
  answer: string
}

export function FaqItemComponent({ question, answer }: FaqItemComponentProps) {
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
            <span className="pt-3 text-body text-gray-800">{answer}</span>
          </span>
        </span>
      </button>
    </div>
  )
}
