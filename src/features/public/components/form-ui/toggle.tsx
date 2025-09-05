function Toggle({ theme }: { theme: 'light' | 'dark' | 'system' }) {
  return (
    <button data-theme={theme} className="group/t h-5.5 w-11 rounded-sm bg-primary-100 p-0.5">
      <div className="h-full w-5.5 translate-x-0 rounded bg-btn-primary transition-transform group-data-[theme=dark]/t:translate-x-full"></div>
    </button>
  )
}
