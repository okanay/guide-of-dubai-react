export const HighlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm.trim()})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 font-semibold">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}
