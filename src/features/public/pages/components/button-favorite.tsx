import Icon from '@/components/icon'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  contentId?: string
  className?: string
  initialLiked?: boolean
  onToggle?: (contentId: string, isLiked: boolean) => void
}

export const ButtonFavorite: React.FC<Props> = ({
  contentId,
  className,
  initialLiked = false,
  onToggle,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked)

  const handleToggle = () => {}

  return (
    <div className={twMerge('absolute top-2 right-2', className)}>
      <button
        onClick={handleToggle}
        aria-label={isLiked ? 'Unlike' : 'Like'}
        className="flex items-center justify-center transition-opacity duration-300 hover:opacity-80 focus:opacity-80 active:opacity-70"
      >
        <Icon
          name={isLiked ? 'like-button-filled' : 'like-button'}
          data-liked={isLiked}
          className="size-10 text-gray-100 data-[liked=true]:text-badge-pink"
        />
      </button>
    </div>
  )
}
