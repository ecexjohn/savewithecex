import React from 'react'

import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import { AppStructure, ComponentLibrariesSymbol } from '@wix/thunderbolt-symbols'
import {
	ComponentsLoaderRegistry,
	ComponentsRegistry,
	ComponentLibraries,
	ThunderboltHostAPI,
	ComponentLoaderFunction,
	CompControllersRegistry,
	IComponentsRegistrar,
	ComponentModule,
} from './types'
import { IComponentsLoader } from './IComponentLoader'
import { taskify } from '@wix/thunderbolt-commons'
import { ComponentsRegistrarSymbol } from './symbols'

type ComponentsLoaderFactory = (
	componentsLibraries: ComponentLibraries,
	componentsRegistrars: Array<IComponentsRegistrar>
) => IComponentsLoader

const getCompClassType = (componentType: string, uiType?: string) =>
	uiType ? `${componentType}_${uiType}` : componentType

const isComponentModule = <T>(loader: any): loader is ComponentModule<T> => !!loader.component

const componentsLoaderFactory: ComponentsLoaderFactory = (componentsLibraries, componentsRegistrars) => {
	const componentsLoaderRegistry: ComponentsLoaderRegistry = {}
	const componentsRegistry: ComponentsRegistry = {}
	const compControllersRegistry: CompControllersRegistry = {}

	const loadComponent = async (compType: string) => {
		const loader = componentsLoaderRegistry[compType]
		if (!loader || componentsRegistry[compType]) {
			return
		}

		const module = await taskify(() => loader())
		if (isComponentModule(module)) {
			componentsRegistry[compType] = React.memo(module.component)
			if (module.controller) {
				compControllersRegistry[compType] = module.controller
			}
		} else {
			componentsRegistry[compType] = React.memo(module.default)
		}
	}

	const getRequiredComps = (structure: AppStructure) => {
		const allCompClassTypes = Object.entries(structure).map(([_, { componentType, uiType }]) =>
			getCompClassType(componentType, uiType)
		)
		const uniqueCompTypes = [...new Set(allCompClassTypes)]
		return uniqueCompTypes
	}

	const hostAPI: ThunderboltHostAPI = {
		registerComponent: <Props>(
			componentType: string,
			loadingFunction: ComponentLoaderFunction<Props>,
			uiType?: string
		) => {
			const compClassType = getCompClassType(componentType, uiType)
			if (process.env.NODE_ENV === 'development' && componentsLoaderRegistry[compClassType]) {
				console.warn(
					`${compClassType} was already registered. Please remove it from thunderbolt components ASAP`
				)
			}
			componentsLoaderRegistry[compClassType] = loadingFunction
		},
	}

	// ORDER MATTERS!!!
	const registerLibraries = taskify(async () => {
		return componentsRegistrars
			.concat(await componentsLibraries)
			.reduce(
				(acc, { registerComponents }) => acc.then(() => taskify(() => registerComponents(hostAPI))),
				Promise.resolve()
			)
	})

	return {
		getComponentsMap: () => componentsRegistry,
		getCompControllersMap: () => compControllersRegistry,
		loadComponents: async (structure) => {
			await registerLibraries

			const requiredComps = getRequiredComps(structure)
			return Promise.all(requiredComps.map((compType) => loadComponent(compType)))
		},
		loadComponent: async (componentType: string, uiType?: string) =>
			loadComponent(getCompClassType(componentType, uiType)),
	}
}

export const ComponentsLoader = withDependencies(
	[ComponentLibrariesSymbol, multi(ComponentsRegistrarSymbol)],
	componentsLoaderFactory
)
