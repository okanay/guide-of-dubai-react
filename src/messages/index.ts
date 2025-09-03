import translationEN from './en/translation.json'
import commonEN from './en/common.json'
import errorPagesEN from './en/error-pages.json'
import seoEN from './en/seo.json'

import translationTR from './tr/translation.json'
import commonTR from './tr/common.json'
import errorPagesTR from './tr/error-pages.json'
import seoTR from './tr/seo.json'

export type TranslationNS = (typeof ns)[number]

export const defaultNS = 'translation'
export const ns = ['translation', 'common', 'error-pages', 'seo'] as const

const resource = {
  en: {
    translation: translationEN,
    common: commonEN,
    'error-pages': errorPagesEN,
    seo: seoEN,
  },
  tr: {
    translation: translationTR,
    common: commonTR,
    'error-pages': errorPagesTR,
    seo: seoTR,
  },
}

export default resource
