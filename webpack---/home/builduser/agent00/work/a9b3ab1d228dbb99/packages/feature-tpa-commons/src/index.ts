import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { TpaMessageContextPicker } from './tpaMessageContextPicker'
import { MasterPageTpaPropsCacheSymbol, TpaContextMappingSymbol, TpaSrcBuilderSymbol } from './symbols'
import { TpaPropsCacheFactory } from './tpaPropsCache'
import { TpaSrcBuilder } from './tpaSrcBuilder'
import { TpaContextMappingFactory } from './tpaContextMapping'

export const site: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppDidMountHandler).to(TpaMessageContextPicker)
	bind(MasterPageTpaPropsCacheSymbol).to(TpaPropsCacheFactory)
	bind(TpaContextMappingSymbol).to(TpaContextMappingFactory)
	bind(TpaSrcBuilderSymbol).to(TpaSrcBuilder)
}

export { TpaHandlersManagerSymbol, name } from './symbols'
export { MasterPageTpaPropsCacheSymbol, TpaSrcBuilderSymbol, TpaContextMappingSymbol }
export * from './types'
