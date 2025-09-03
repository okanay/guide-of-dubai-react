import { useState, useEffect, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface AvatarImageRenderProps {
  /**
   * Render edilecek görselin URL'si.
   */
  avatarUrl?: string | null
  /**
   * Görsel yüklenemediğinde veya URL olmadığında gösterilecek metin (örn: kullanıcı adı).
   */
  fallbackText: string
  /**
   * Component'in ana kapsayıcısına uygulanacak ek Tailwind sınıfları.
   * twMerge kullanılarak birleştirilir.
   */
  className?: string

  /**
   * Görselin alt metni.
   */
  alt?: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export const AvatarImageRender: React.FC<AvatarImageRenderProps> = ({
  avatarUrl,
  fallbackText,
  className,
  alt,
}) => {
  const [hasError, setHasError] = useState(false)

  // avatarUrl değiştiğinde hata durumunu sıfırla
  useEffect(() => {
    setHasError(false)
  }, [avatarUrl])

  const showImage = avatarUrl && !hasError

  /**
   * Fallback metninden baş harfleri alır.
   * - Tek kelime ise: İlk harfi alır (Örn: "Okan" -> "O").
   * - Birden fazla kelime ise: İlk iki kelimenin baş harflerini alır (Örn: "Okan Ay" -> "OA").
   */
  const fallbackInitials = useMemo(() => {
    if (!fallbackText) return '?'

    const words = fallbackText.trim().split(/\s+/)
    if (words.length > 1) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return words[0] ? words[0][0].toUpperCase() : '?'
  }, [fallbackText])

  // Varsayılan stiller ve dışarıdan gelen stillerin birleştirilmesi
  const containerClasses = twMerge(
    'relative flex items-center justify-center rounded-full overflow-hidden select-none',
    'h-10 w-10 bg-secondary-container text-on-secondary-container', // Varsayılan boyut ve renkler
    className, // Dışarıdan gelen özelleştirmeler
  )

  return (
    <div className={containerClasses}>
      {/* Fallback text - her zaman göster */}

      <span className="text-sm font-semibold" aria-label={fallbackText}>
        {fallbackInitials}
      </span>

      {/* Ana Görsel - hata yoksa üstte göster */}
      {showImage && (
        <div className={twMerge('!inset-0, !absolute bg-tertiary-container', containerClasses)}>
          <img
            src={avatarUrl}
            alt={alt || fallbackText}
            className="absolute inset-0 h-full w-full object-cover aria-disabled:hidden"
            onError={() => setHasError(true)}
            aria-disabled={hasError}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </div>
  )
}
