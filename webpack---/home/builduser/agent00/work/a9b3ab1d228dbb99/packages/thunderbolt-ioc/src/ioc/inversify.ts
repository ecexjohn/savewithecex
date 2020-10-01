import { Container as InversifyContainer, interfaces } from 'inversify'
import {
	IocContainer,
	ContainerModuleLoader,
	Identifier,
	TargetName,
	Bind,
	BindToSyntax,
	FactoryWithDependencies,
	ProviderCreator,
	BindWhenSyntax,
	ModuleMetadataSymbol,
} from './types'
import { getDependencies, isNamed, isMulti, isOptional, withDependencies } from './metadata'

const containersStore = new WeakMap<interfaces.Container, IocContainer>()

const makeFactory = (target: FactoryWithDependencies) => (context: interfaces.Context) => {
	const dependenciesValues = getDependencies(target).map((identifier) => {
		const { container } = context
		if (isNamed(identifier)) {
			if (!container.isBoundNamed(identifier.identifier, identifier.name)) {
				throw new Error(
					`Unbound named dependency ${String(identifier.identifier)}("${
						identifier.name
					}") in module ${target.name.replace(/bound\s/g, '')}`
				)
			}

			return container.getNamed(identifier.identifier, identifier.name)
		}
		if (isMulti(identifier)) {
			return container.isBound(identifier.identifier) ? container.getAll(identifier.identifier) : []
		}
		if (isOptional(identifier)) {
			return container.isBound(identifier.identifier) ? container.get(identifier.identifier) : undefined
		}

		if (!container.isBound(identifier)) {
			throw new Error(`Unbound dependency ${String(identifier)} in module ${target.name.replace(/bound\s/g, '')}`)
		}
		return container.get(identifier)
	})
	return target(...dependenciesValues)
}

const makeProvider = (container: IocContainer, target: ProviderCreator<any>) => (context: interfaces.Context) =>
	target(containersStore.get(context.container)!)

export class Container implements IocContainer {
	constructor(private container: interfaces.Container = new InversifyContainer()) {
		this.container.options.defaultScope = 'Singleton'
		containersStore.set(this.container, this)
	}

	private bindAll(identifiers: Array<Identifier>, factory: FactoryWithDependencies) {
		const bind = this.createBindSyntax()
		let instance: any
		function singletonFactory(...args: any) {
			if (!instance) {
				instance = factory(...args)
			}
			return instance
		}

		Object.defineProperty(singletonFactory, 'name', {
			value: factory.name,
			configurable: true,
		})
		const withDependenciesFactory = withDependencies(factory[ModuleMetadataSymbol].dependencies, singletonFactory)
		identifiers.forEach((symbol: symbol) => bind(symbol).to(withDependenciesFactory))
	}

	private createBindSyntax(): Bind {
		return (identifier) => {
			const fullBindToSyntax = this.container.bind(identifier)
			return this.createBindToSyntax(fullBindToSyntax)
		}
	}

	private createRebindSyntax(): Bind {
		return (identifier) => {
			const fullBindToSyntax = this.container.rebind(identifier)
			return this.createBindToSyntax(fullBindToSyntax)
		}
	}

	private createBindToSyntax(fullBindToSyntax: interfaces.BindingToSyntax<any>): BindToSyntax {
		return {
			to: (target: FactoryWithDependencies) => {
				const fullBindingInWhenOnSyntax = fullBindToSyntax.toDynamicValue(makeFactory(target))
				return this.createBindWhenSyntax(fullBindingInWhenOnSyntax)
			},
			toConstantValue: (target) => {
				const fullBindingInWhenOnSyntax = fullBindToSyntax.toConstantValue(target)
				return this.createBindWhenSyntax(fullBindingInWhenOnSyntax)
			},
			toProvider: (target) => {
				const fullBindingInWhenOnSyntax = fullBindToSyntax.toProvider(makeProvider(this, target))
				return this.createBindWhenSyntax(fullBindingInWhenOnSyntax)
			},
		}
	}

	private createBindWhenSyntax(fullBindingInWhenOnSyntax: interfaces.BindingWhenSyntax<any>): BindWhenSyntax {
		return {
			whenTargetNamed: (name: TargetName) => {
				fullBindingInWhenOnSyntax.whenTargetNamed(name)
			},
		}
	}

	get<T>(identifier: Identifier): T {
		return this.container.get(identifier)
	}

	getAll<T>(identifier: Identifier): Array<T> {
		return this.container.isBound(identifier) ? this.container.getAll(identifier) : []
	}

	getNamed<T>(identifier: Identifier, name: string): T {
		return this.container.getNamed(identifier, name)
	}

	load(...moduleLoaders: Array<ContainerModuleLoader>) {
		moduleLoaders.forEach((loader) => {
			loader(this.createBindSyntax(), this.bindAll.bind(this))
		})
	}

	bind(identifier: Identifier): BindToSyntax {
		return this.createBindSyntax()(identifier)
	}

	rebind(identifier: Identifier): BindToSyntax {
		return this.createRebindSyntax()(identifier)
	}

	createChild() {
		return new Container(this.container.createChild())
	}

	legacy(): interfaces.Container {
		return this.container
	}
}
