import { ComponentLibrariesSymbol } from '@wix/thunderbolt-symbols'
import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Environment } from '../../types/Environment'

export const site = ({ componentLibraries }: Environment): ContainerModuleLoader => (bind) => {
	bind(ComponentLibrariesSymbol).toConstantValue(componentLibraries)
}
