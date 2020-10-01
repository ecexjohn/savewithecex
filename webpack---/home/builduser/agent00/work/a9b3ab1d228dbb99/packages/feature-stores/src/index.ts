import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import { getStore } from './stores'
import { CompRefs } from './compRefs'
import { CompEventsRegistrar } from './compEventsRegistrar'
import { CompsLifeCycle } from './compsLifeCycle'
import {
	AppStructure,
	PropsMap,
	CompActions,
	IStructureStore,
	Structure,
	IPropsStore,
	Props,
	ICompActionsStore,
	CompActionsSym,
	IRendererPropsExtender,
	RendererPropsExtenderSym,
	CompsLifeCycleSym,
	CompEventsRegistrarSym,
	ICompsLifeCycle,
	ICompEventsRegistrar,
	CompRefAPISym,
} from '@wix/thunderbolt-symbols'

export { Structure }

const rendererPropsExtender = withDependencies(
	[Structure, Props, CompsLifeCycleSym, CompEventsRegistrarSym],
	(
		structureStore: IStructureStore,
		propsStore: IPropsStore,
		compsLifeCycle: ICompsLifeCycle,
		compEventsRegistrar: ICompEventsRegistrar
	): IRendererPropsExtender => {
		return {
			async extendRendererProps() {
				return {
					structure: structureStore,
					props: propsStore,
					compsLifeCycle,
					compEventsRegistrar,
				}
			},
		}
	}
)

export const site: ContainerModuleLoader = (bind) => {
	const structure = getStore<AppStructure>()
	const props = getStore<PropsMap>()
	const compActions = getStore<CompActions>()

	// Serializable
	bind<IStructureStore>(Structure).toConstantValue(structure)
	bind<IPropsStore>(Props).toConstantValue(props)
	// Not Serializable
	bind<ICompActionsStore>(CompActionsSym).toConstantValue(compActions)

	bind(CompRefAPISym).to(CompRefs)
	bind(CompEventsRegistrarSym).to(CompEventsRegistrar)
	bind(CompsLifeCycleSym).to(CompsLifeCycle)
	bind<IRendererPropsExtender>(RendererPropsExtenderSym).to(rendererPropsExtender)
}
