import translationEN from './en/translation.json'
import commonEN from './en/common.json'
import errorPagesEN from './en/error-pages.json'
import seoEN from './en/seo.json'

export type TranslationNS = (typeof ns)[number]

export const defaultNS = 'translation'
export const ns = ['translation', 'common', 'error-pages', 'seo'] as const

const resource = {
  en: {
    translation: translationEN,
    common: commonEN,
    globals: errorPagesEN,
    seo: seoEN,
  },
}

export default resource
