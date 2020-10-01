import {
	CompRefAPI,
	AddCompRefById,
	CompRefPromise,
	CompRefResolver,
	CompRef,
	IPropsStore,
	Props,
} from '@wix/thunderbolt-symbols'

import { withDependencies } from '@wix/thunderbolt-ioc'

type CompRefsPromises = Record<string, { promise: CompRefPromise; resolver: CompRefResolver | null }>

export const CompRefs = withDependencies(
	[Props],
	(propsStore: IPropsStore): CompRefAPI => {
		const compRefsStore: CompRefsPromises = {}

		const addCompRefById: AddCompRefById = (compId, compRef) => {
			const compRefPromise = compRefsStore[compId] || {}
			if (compRefPromise.resolver) {
				compRefPromise.resolver(compRef)
				compRefPromise.resolver = null
			} else {
				compRefPromise.promise = Promise.resolve(compRef)
			}
			compRefsStore[compId] = compRefPromise
		}

		const getCompRefPromise = (compId: string) => {
			let resolver = null
			const promise: CompRefPromise = new Promise((resolve) => {
				resolver = resolve
			})
			compRefsStore[compId] = { promise, resolver }
			propsStore.update({ [compId]: { ref: (ref: CompRef) => addCompRefById(compId, ref) } })
			return compRefsStore[compId]
		}

		const getCompRefById = (compId: string) => {
			const { promise } = compRefsStore[compId] || getCompRefPromise(compId)
			return promise
		}

		return {
			getCompRefById,
		}
	}
)
