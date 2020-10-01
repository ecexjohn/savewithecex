import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { OoiTpaSharedConfig } from './ooiTpaSharedConfig'
import { OoiTpaSharedConfigSymbol } from './symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(OoiTpaSharedConfigSymbol).to(OoiTpaSharedConfig)
}

export { OoiTpaSharedConfigSymbol }
export * from './types'
