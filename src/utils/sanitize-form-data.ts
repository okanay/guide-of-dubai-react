export function sanitizeFormData<T extends Record<string, any>>(data: T): Partial<T> {
  const sanitized: Partial<T> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed !== '') {
        sanitized[key as keyof T] = trimmed as T[keyof T]
      }
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nestedSanitized = sanitizeFormData(value)
      if (Object.keys(nestedSanitized).length > 0) {
        sanitized[key as keyof T] = nestedSanitized as T[keyof T]
      }
    } else if (Array.isArray(value) && value.length > 0) {
      // Cast value as unknown first to bypass the assignment error
      sanitized[key as keyof T] = value as unknown as T[keyof T]
    } else if (value !== undefined && value !== null && value !== '') {
      sanitized[key as keyof T] = value
    }
  }

  return sanitized
}
