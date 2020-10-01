// ssr
export * from './server'
export * from './ssr/snapshotManager'

// this should have a proper place
export * from './browserWindow'
export * from './headContent'

// viewer-model
export * from './viewer-model/ViewerModel'
export * from './viewer-model/ILanguage'
export * from './viewer-model/SiteAssetsParams'

// LifeCycle
export * from '../features/thunderbolt/LifeCycle'

// features types
export * from '../features/clickHandlerRegistrar/types'
export * from '../features/rendererPropsExtender/IRendererPropsExtender'
export * from '../features/translations/interfaces'
export * from '../features/compEventsRegistrar/interfaces'
export * from '../features/compRefs/interfaces'
export * from '../features/compRefs/types'
export * from '../features/logger/ILogger'
export * from '../features/stores/interfaces'
export * from '../features/fetch/interfaces'
export * from '../features/bi'
export * from '../features/experiments'
export * from '../features/types'
export * from '../features/assetsLoader'
export * from '../features/businessLogger/interfaces'
export * from '../features/reporter/types'
export * from '../features/compsLifeCycle/interfaces'

export * from './tpa'
export * from './becky'
export * from './render'
export * from './platform/siteWixCodeSdk'
export * from './platform/platform-types'
export * from './multilingual'
export * from './warmupData'
export * from './componentsStylesOverrides'
export * from './dynamicPagesTypes'

export type RecursivePartial<T> = { [K in keyof T]?: RecursivePartial<T[K]> }
