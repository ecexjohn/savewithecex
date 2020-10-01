import { RendererProps } from '../types'
import Context from './AppContext'
import React, { useContext, ComponentType, useEffect, useState, useCallback, useRef, MutableRefObject } from 'react'
import { ErrorBoundary, DeadComp } from './ErrorBoundary'
import { getDisplayedId } from '@wix/thunderbolt-commons'

type StructureComponentProps = { id: string; displayedItemId?: string }
const getProps = (displayedId: string, id: string, propsStore: any) =>
	displayedId !== id ? { ...propsStore.get(id), ...propsStore.get(displayedId) } : propsStore.get(id)

const withObserver = (Comp: ComponentType<StructureComponentProps>): ComponentType<StructureComponentProps> => ({
	id,
	displayedItemId = '',
}) => {
	const { structure: structureStore, props: propsStore, compsLifeCycle } = useContext(Context)
	const displayedId = displayedItemId ? getDisplayedId(id, displayedItemId) : id

	const [, setTick] = useState(0)
	const forceUpdate = useCallback(() => setTick((tick) => tick + 1), [])
	const registerOnMount = () => {
		const stores = [propsStore, structureStore]
		const unSubscribers: Array<() => void> = []
		compsLifeCycle.notifyCompDidMount(id, displayedId)
		stores.forEach((store) => {
			const unsubscribe = store.subscribeById(displayedId, forceUpdate)
			unSubscribers.push(unsubscribe)
			if (displayedId !== id) {
				unSubscribers.push(store.subscribeById(id, forceUpdate))
			}
		})

		return () => {
			unSubscribers.forEach((cb) => cb())
		}
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(registerOnMount, [])

	return <Comp id={id} displayedItemId={displayedItemId} />
}

const StructureComponent: ComponentType<StructureComponentProps> = withObserver(({ id, displayedItemId = '' }) => {
	const {
		structure: structureStore,
		props: propsStore,
		comps,
		translate,
		logger,
		compEventsRegistrar,
		compControllers,
		createCompControllerArgs,
	}: RendererProps = useContext(Context)
	const displayedId = displayedItemId ? getDisplayedId(id, displayedItemId) : id

	const compStructure = structureStore.get(displayedId) || structureStore.get(id)
	const { componentType, uiType } = compStructure
	const compClassType = uiType ? `${componentType}_${uiType}` : componentType
	const Comp = comps[compClassType]

	if (compControllers[compClassType]) {
		const controllerActionsReference: MutableRefObject<any> = useRef(null)
		if (!controllerActionsReference.current) {
			controllerActionsReference.current = compControllers[compClassType](createCompControllerArgs(displayedId))
		}

		compEventsRegistrar.registerController(displayedId, controllerActionsReference.current)
	}

	const compProps = getProps(displayedId, id, propsStore) || {}
	const components = compStructure!.components

	const children = useCallback(
		(itemId?: string) =>
			(components || []).map((childId: string) => {
				const childProps = propsStore.get(childId)

				return (
					<StructureComponent
						displayedItemId={displayedItemId || itemId}
						id={childId}
						key={childProps?.key || childId}
					/>
				)
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[components, displayedItemId]
	)

	// TODO: Remove the fallback once all components are implemented
	const component = Comp ? (
		<Comp translate={translate} {...compProps} id={displayedId}>
			{children}
		</Comp>
	) : (
		<DeadComp id={displayedId}>{children()}</DeadComp>
	)

	return (
		<ErrorBoundary
			id={displayedId}
			logger={logger}
			recursiveChildren={children}
			Component={Comp}
			compClassType={compClassType}
			sentryDsn={compProps.sentryDsn}
		>
			{component}
		</ErrorBoundary>
	)
})

export default StructureComponent
