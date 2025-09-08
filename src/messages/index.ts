import enCommon from './en/common.json'
import enComponents from './en/components.json'
import enApiErrors from './en/errors-api.json'
import enZodErrors from './en/errors-zod.json'
import enLayoutFooter from './en/layout-footer.json'
import enLayoutHeader from './en/layout-header.json'
import enModalAuth from './en/modal-auth.json'
import enPageErrors from './en/page-errors.json'
import enPageIndex from './en/page-index.json'
import enSeo from './en/seo.json'

import trCommon from './tr/common.json'
import trComponents from './tr/components.json'
import trApiErrors from './tr/errors-api.json'
import trZodErrors from './tr/errors-zod.json'
import trLayoutFooter from './tr/layout-footer.json'
import trLayoutHeader from './tr/layout-header.json'
import trModalAuth from './tr/modal-auth.json'
import trPageErrors from './tr/page-errors.json'
import trPageIndex from './tr/page-index.json'
import trSeo from './tr/seo.json'

export type TranslationNS = (typeof ns)[number]

export const defaultNS = 'common'

export const ns = [
  'common',
  'components',
  'layout-header',
  'layout-footer',
  'page-index',
  'page-errors',
  'errors-zod',
  'errors-api',
  'modal-auth',
] as const

const resource = {
  en: {
    common: enCommon,
    'page-errors': enPageErrors,
    components: enComponents,
    'layout-header': enLayoutHeader,
    'layout-footer': enLayoutFooter,
    'page-index': enPageIndex,
    'errors-zod': enZodErrors,
    'errors-api': enApiErrors,
    seo: enSeo,
    'modal-auth': enModalAuth,
  },
  tr: {
    common: trCommon,
    'page-errors': trPageErrors,
    components: trComponents,
    'layout-header': trLayoutHeader,
    'layout-footer': trLayoutFooter,
    'page-index': trPageIndex,
    'errors-zod': trZodErrors,
    'errors-api': trApiErrors,
    seo: trSeo,
    'modal-auth': trModalAuth,
  },
}

export default resource
