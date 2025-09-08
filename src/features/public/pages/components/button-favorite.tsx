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
    <button
      onClick={handleToggle}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      className={twMerge('absolute top-2 right-2 flex items-center justify-center', className)}
    >
      <Icon name={isLiked ? 'like-button-filled' : 'like-button'} />
    </button>
  )
}
