export type CompAction = Function
export type ActionProps = Record<string, CompAction>
export interface ICompEventsRegistrar {
	register: (compId: string, eventName: string, compAction: CompAction) => void
	registerController: (compId: string, controllerActions: ActionProps) => void
}

export const CompEventsRegistrarSym = Symbol.for('CompEventsRegistrar')
