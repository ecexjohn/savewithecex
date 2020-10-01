import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { StructureAPI } from './structureApi'
import { IStructureAPI, StructureAPI as StructureAPISym } from '@wix/thunderbolt-symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind<IStructureAPI>(StructureAPISym).to(StructureAPI)
}
