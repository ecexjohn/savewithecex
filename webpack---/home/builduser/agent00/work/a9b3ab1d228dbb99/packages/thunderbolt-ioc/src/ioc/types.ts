import { interfaces } from 'inversify'

export const ModuleMetadataSymbol = Symbol.for('module metadata')

export type Identifier = symbol
export type TargetName = string | number | symbol

export type NamedIdentifier = {
	identifier: Identifier
	name: string
}

export type MultiIdentifier = {
	identifier: Identifier
	multi: true
}

export type OptionalIdentifier = {
	identifier: Identifier
	optional: true
}

export type Factory<T> = (...args: Array<any>) => T

export type Dependencies = Identifier | NamedIdentifier | MultiIdentifier | OptionalIdentifier

export type FactoryWithDependencies<T = any> = Factory<T> & {
	[ModuleMetadataSymbol]: {
		dependencies: Array<Dependencies>
	}
}

type Provider<T> = (...args: Array<any>) => Promise<T>

export type ProviderCreator<T> = (container: IocContainer) => Provider<T>

export interface BindWhenSyntax {
	whenTargetNamed(name: TargetName): void
}

export interface BindToSyntax {
	to(target: FactoryWithDependencies): BindWhenSyntax
	toConstantValue(target: any): BindWhenSyntax
	toProvider<T>(target: ProviderCreator<T>): BindWhenSyntax
}

export type Bind = <T>(serviceIdentifier: Identifier) => BindToSyntax
export type BindAll = (serviceIdentifiers: Array<Identifier>, factory: any) => void

export type ContainerModuleLoader = (bind: Bind, bindAll: BindAll) => void

export interface IocContainer {
	load(...modules: Array<ContainerModuleLoader>): void
	get<T>(identifier: Identifier): T
	getAll<T>(identifier: Identifier): Array<T>
	getNamed<T>(identifier: Identifier, name: string): T
	bind<T>(identifier: Identifier): BindToSyntax
	rebind<T>(identifier: Identifier): BindToSyntax
	createChild(): IocContainer
	legacy(): interfaces.Container
}
