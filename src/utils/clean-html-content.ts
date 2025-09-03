export const cleanHtmlContent = (html: string) => {
  return html
    .replace(/<p>\s*&nbsp;\s*<\/p>/gi, '') //
    .replace(/<h[1-6]>\s*&nbsp;\s*<\/h[1-6]>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/<p>\s*<\/p>/gi, '')
}
