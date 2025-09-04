import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

export const PublicFooter = () => {
  return (
    <footer className="pt-20">
      <AppPromoSection />
      <FaqSection />
    </footer>
  )
}

export const AppPromoSection = () => {
  return (
    <section>
      <div className="relative mx-auto flex h-[180px] w-full max-w-7xl flex-row items-center justify-evenly gap-x-0 bg-black text-white sm:gap-x-8 sm:px-4 sm:py-0 md:h-[320px]">
        {/* Arka Plan Deseni */}
        <img
          src="/images/public/footer/background-image.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 hidden h-[160px] w-auto scale-x-[-1] object-contain opacity-50 sm:block md:h-[240px]"
        />

        {/* Sol Taraf: Telefon ve Arka Plan Görselleri */}
        <div className="relative w-[160px] flex-shrink-0 md:w-[270px]">
          {/* Telefon Görseli */}
          <img
            src="/images/public/footer/phone-2.png"
            alt="Guide of Dubai mobil uygulaması"
            className="absolute bottom-full z-10 h-[180px] w-full translate-y-[50%] object-contain sm:left-4 md:h-[362px] md:translate-y-[44.25%]"
          />
        </div>

        {/* Orta Kısım: Metin ve İndirme Butonları */}
        <div className="z-10 flex h-full flex-col items-start justify-center py-2 text-start sm:justify-center">
          <h2 className="items-start text-lg leading-[22px] font-bold sm:max-w-[460px] md:text-heading-2 md:text-balance">
            Dubai seyahatleri için üyelere özel indirimlerin kilidini açın
          </h2>
          <p className="mt-1 mb-2 text-xs sm:mt-6 sm:mb-8 sm:max-w-[240px] md:text-size-lg md:text-balance">
            Dubai seyahatleri için üyelere özel indirimlerin kilidini açın
          </p>
          <div className="flex items-center gap-1 sm:gap-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/public/footer/app-store.png"
                alt="Apple logo"
                className="h-8 w-24 md:h-10 md:w-32"
              />
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/public/footer/google-play.png"
                alt="Google Play logo"
                className="h-8 w-24 md:h-10 md:w-32"
              />
            </a>
          </div>
        </div>

        {/* Sağ Taraf: QR Kod */}
        <div className="z-10 mt-8 hidden flex-col items-center gap-y-4 sm:mt-0 md:flex">
          <img
            src="/images/public/footer/qr-code.png"
            alt="Uygulamayı indirmek için QR kodu"
            className="size-[130px] object-contain"
          />
          <span className="text-body-sm text-gray-200">QR kodu tarat</span>
        </div>
      </div>
    </section>
  )
}

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

export const FaqSection = () => {
  return (
    <div className="bg-transparent px-4 text-on-box-black">
      <div className="mx-auto max-w-7xl py-10">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            data-open={isOpen}
            className="transition-transform duration-500 ease-in-out data-[open=true]:rotate-180"
          >
            <path
              d="M10.5 12.8337L5.5 7.83366L6.66667 6.66699L10.5 10.5003L14.3333 6.66699L15.5 7.83366L10.5 12.8337Z"
              fill="#171717"
            />
          </svg>
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
