import { useAuthModal } from './store'

export function AuthButton() {
  const { openModal } = useAuthModal()

  return (
    <button
      onClick={() => openModal('login')}
      className="ml-2 bg-btn-primary px-4.5 py-2 text-on-btn-primary transition-colors duration-300 ease-in-out hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled"
      aria-label="Giriş yap veya kayıt ol"
    >
      Login/Register
    </button>
  )
}
