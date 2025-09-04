import { useGoAiModal } from './store'

export function GoAiButton() {
  const { openModal } = useGoAiModal()

  return (
    <button
      onClick={() => openModal()}
      className="btn-default rounded-full px-2 py-1"
      aria-label="Go.Ai asistanı"
    >
      Go.Ai
    </button>
  )
}
