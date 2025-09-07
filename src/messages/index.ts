import translationEN from './en/translation.json'
import commonEN from './en/common.json'
import errorPagesEN from './en/error-pages.json'
import componentsEN from './en/components.json'
import publicHeaderEN from './en/public-header.json'
import publicFooterEN from './en/public-footer.json'
import publicIndexEN from './en/public-index.json'
import zodErrorsEN from './en/zod-errors.json'
import apiErrorsEN from './en/api-errors.json'
import seoEN from './en/seo.json'
import authEN from './en/auth.json'

import translationTR from './tr/translation.json'
import commonTR from './tr/common.json'
import errorPagesTR from './tr/error-pages.json'
import componentsTR from './tr/components.json'
import publicHeaderTR from './tr/public-header.json'
import publicFooterTR from './tr/public-footer.json'
import publicIndexTR from './tr/public-index.json'
import zodErrorsTR from './tr/zod-errors.json'
import apiErrorsTR from './tr/api-errors.json'
import seoTR from './tr/seo.json'
import authTR from './tr/auth.json'

export type TranslationNS = (typeof ns)[number]

export const defaultNS = 'translation'
export const ns = [
  'common',
  'components',
  'public-header',
  'public-footer',
  'public-index',
  'error-pages',
  'zod-errors',
  'api-errors',
  'auth',
] as const

const resource = {
  en: {
    translation: translationEN,
    common: commonEN,
    'error-pages': errorPagesEN,
    components: componentsEN,
    'public-header': publicHeaderEN,
    'public-footer': publicFooterEN,
    'public-index': publicIndexEN,
    'zod-errors': zodErrorsEN,
    'api-errors': apiErrorsEN,
    seo: seoEN,
    auth: authEN,
  },
  tr: {
    translation: translationTR,
    common: commonTR,
    'error-pages': errorPagesTR,
    components: componentsTR,
    'public-header': publicHeaderTR,
    'public-footer': publicFooterTR,
    'public-index': publicIndexTR,
    'zod-errors': zodErrorsTR,
    'api-errors': apiErrorsTR,
    seo: seoTR,
    auth: authTR,
  },
}

export default resource
