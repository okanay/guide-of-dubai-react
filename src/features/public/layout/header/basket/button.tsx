import { useBasketModal } from './store'

export function BasketButton() {
  const { openModal } = useBasketModal()

  return (
    <button
      onClick={() => openModal()}
      className="btn-default flex items-center gap-1 rounded-full px-2 py-1"
      aria-label="Sepeti görüntüle"
    >
      Sepetim
    </button>
  )
}
