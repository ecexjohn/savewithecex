import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	CompActionsSym,
	ICompActionsStore,
	ICompEventsRegistrar,
	Props,
	IPropsStore,
	ActionProps,
	PropsMap,
} from '@wix/thunderbolt-symbols'
import { getFullId, isDisplayedOnly } from '@wix/thunderbolt-commons'

const ControllerActionSymbol = Symbol('controllerActionSymbol')
const isControllerActionFunction = (action: any) => !!action[ControllerActionSymbol]

const eventSymbol = Symbol('eventSymbol')
type EventPropFunction = ((...args: Array<any>) => void) & {
	[eventSymbol]: true
}

const isEventPropFunction = (callback: any = {}) => !!callback[eventSymbol]
const createEventPropFunction = (
	compActionsStore: ICompActionsStore,
	eventName: string,
	compId: string
): EventPropFunction => {
	const getCompActionHandlers = () => {
		const compActions = compActionsStore.get(compId)?.[eventName] ?? []
		if (!isDisplayedOnly(compId)) {
			return compActions
		}

		const compTemplateActions = compActionsStore.get(getFullId(compId))?.[eventName] ?? []
		return [...compActions, ...compTemplateActions]
	}
	// @ts-ignore
	const callback: EventPropFunction = (...args: Array<any>) => {
		const compActions = getCompActionHandlers()
		const sortedCompActions = compActions.sort((compAction) => (!isControllerActionFunction(compAction) ? 1 : -1))
		sortedCompActions.forEach((eventHandler) => eventHandler(...args))
	}
	callback[eventSymbol] = true

	return callback
}

export const CompEventsRegistrar = withDependencies(
	[CompActionsSym, Props],
	(compActionsStore: ICompActionsStore, props: IPropsStore): ICompEventsRegistrar => {
		compActionsStore.subscribeToChanges((partial) => {
			const componentProps = Object.entries(partial).reduce((acc, [compId, compEvents]) => {
				const compProps = props.get(compId) || {}
				const actionProps = Object.keys(compEvents)
					// Filter only events that are either new or has event prop that was not created by the compEventsRegistrar
					.filter((eventName) => !compProps[eventName] || !isEventPropFunction(compProps[eventName]))
					.reduce(
						(newProps, eventName) => ({
							...newProps,
							[eventName]: createEventPropFunction(compActionsStore, eventName, compId),
						}),
						{}
					)

				return Object.keys(actionProps).length ? { ...acc, [compId]: actionProps } : acc
			}, {} as PropsMap)

			props.update(componentProps)
		})
		const updateCompActions = (compId: string, newActions: ActionProps, isController: boolean) => {
			const currentActions = compActionsStore.get(compId) || {}
			const mergedActions = Object.entries(newActions).reduce((acc, [eventName, compAction]) => {
				const currentEventCompActions = currentActions[eventName] || []
				if (isController) {
					// @ts-ignore
					compAction[ControllerActionSymbol] = true
				}

				const action = {
					[eventName]: [...currentEventCompActions, compAction],
				}
				return { ...acc, ...action }
			}, {})

			compActionsStore.update({
				[compId]: {
					...currentActions,
					...mergedActions,
				},
			})
		}

		const hasControllerAlreadyRegisteredForCompId = (compId: string) => {
			const allCompActions = Object.values(compActionsStore.get(compId) || {})

			return allCompActions.some((actionArr) => actionArr.some(isControllerActionFunction))
		}
		const registerController: ICompEventsRegistrar['registerController'] = (compId, controllerActions) => {
			if (!hasControllerAlreadyRegisteredForCompId(compId)) {
				updateCompActions(compId, controllerActions, true)
			}
		}

		const register: ICompEventsRegistrar['register'] = (compId, eventName, compAction) => {
			updateCompActions(compId, { [eventName]: compAction }, false)
		}

		return {
			register,
			registerController,
		}
	}
)
