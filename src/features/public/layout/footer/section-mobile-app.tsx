export const PublicFooterMobileAppSection = () => {
  return (
    <section>
      <div
        id="app-promo-section"
        className="relative mx-auto flex h-[180px] w-full max-w-main scroll-m-20 flex-row items-center justify-evenly gap-x-0 bg-black text-white sm:gap-x-8 sm:px-4 sm:py-0 md:h-[320px] dark:bg-white dark:text-black"
      >
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
          <span className="text-body-sm text-gray-200 dark:text-black">QR kodu tarat</span>
        </div>
      </div>
    </section>
  )
}
