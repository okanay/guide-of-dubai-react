import { useRef, useState } from 'react'
import { useHeader } from '../store'
import { useAuthModal } from './store'
import { createPortal } from 'react-dom'

export function AuthButton() {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownContentRef = useRef<HTMLDivElement>(null) // Dropdown içeriği için yeni ref
  const {} = useAuthModal()
  const { setInverted, isInverted } = useHeader()
  const [dropdown, setDropdown] = useState(false)

  const toggleDropdown = () => {
    setDropdown(!dropdown)
    setInverted(!isInverted)
  }

  const closeDropdown = () => {
    setDropdown(false)
    setInverted(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dropdownContentRef.current && !dropdownContentRef.current.contains(e.target as Node)) {
      closeDropdown()
    }
  }

  return (
    <>
      {createPortal(
        <div
          ref={dropdownRef}
          onClick={handleBackdropClick}
          data-visible={dropdown ? 'true' : 'false'}
          className="pointer-events-none fixed inset-0 z-33 opacity-0 transition-opacity duration-300 ease-in-out data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100"
        >
          {/* Semi-transparent backdrop */}
          <div
            className="pointer-events-auto absolute inset-0 z-34 bg-black-40"
            onClick={toggleDropdown}
          />

          {/* White header strip - h-17 */}
          <div className="absolute top-0 left-0 z-35 h-17 w-full bg-white" />

          {/* Dropdown positioned relative to header */}
          <div
            ref={dropdownContentRef}
            className="pointer-events-none absolute top-17 right-0 left-[50%] z-35 flex w-full max-w-8xl translate-x-[-50%] justify-end"
          >
            <div className="pointer-events-auto w-72 border border-gray-200 bg-white shadow-lg">
              {/* Menu Items */}

              {/* Separator */}
              <div className="my-1 border-t border-gray-100" />
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="ml-2 flex items-center gap-x-2 bg-btn-primary px-4.5 py-2 text-on-btn-primary transition-colors duration-300 ease-in-out hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled"
        aria-label="Giriş yap veya kayıt ol"
      >
        Profil
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
        >
          <path
            d="M4.8875 12.825C5.525 12.3375 6.2375 11.9531 7.025 11.6719C7.8125 11.3906 8.6375 11.25 9.5 11.25C10.3625 11.25 11.1875 11.3906 11.975 11.6719C12.7625 11.9531 13.475 12.3375 14.1125 12.825C14.55 12.3125 14.8906 11.7313 15.1344 11.0813C15.3781 10.4313 15.5 9.7375 15.5 9C15.5 7.3375 14.9156 5.92188 13.7469 4.75313C12.5781 3.58438 11.1625 3 9.5 3C7.8375 3 6.42188 3.58438 5.25313 4.75313C4.08438 5.92188 3.5 7.3375 3.5 9C3.5 9.7375 3.62188 10.4313 3.86563 11.0813C4.10938 11.7313 4.45 12.3125 4.8875 12.825ZM9.5 9.75C8.7625 9.75 8.14063 9.49688 7.63438 8.99063C7.12813 8.48438 6.875 7.8625 6.875 7.125C6.875 6.3875 7.12813 5.76562 7.63438 5.25938C8.14063 4.75313 8.7625 4.5 9.5 4.5C10.2375 4.5 10.8594 4.75313 11.3656 5.25938C11.8719 5.76562 12.125 6.3875 12.125 7.125C12.125 7.8625 11.8719 8.48438 11.3656 8.99063C10.8594 9.49688 10.2375 9.75 9.5 9.75ZM9.5 16.5C8.4625 16.5 7.4875 16.3031 6.575 15.9094C5.6625 15.5156 4.86875 14.9813 4.19375 14.3063C3.51875 13.6313 2.98438 12.8375 2.59063 11.925C2.19688 11.0125 2 10.0375 2 9C2 7.9625 2.19688 6.9875 2.59063 6.075C2.98438 5.1625 3.51875 4.36875 4.19375 3.69375C4.86875 3.01875 5.6625 2.48438 6.575 2.09063C7.4875 1.69688 8.4625 1.5 9.5 1.5C10.5375 1.5 11.5125 1.69688 12.425 2.09063C13.3375 2.48438 14.1313 3.01875 14.8063 3.69375C15.4813 4.36875 16.0156 5.1625 16.4094 6.075C16.8031 6.9875 17 7.9625 17 9C17 10.0375 16.8031 11.0125 16.4094 11.925C16.0156 12.8375 15.4813 13.6313 14.8063 14.3063C14.1313 14.9813 13.3375 15.5156 12.425 15.9094C11.5125 16.3031 10.5375 16.5 9.5 16.5Z"
            fill="#F8F8F8"
          />
        </svg>
      </button>
    </>
  )
}
