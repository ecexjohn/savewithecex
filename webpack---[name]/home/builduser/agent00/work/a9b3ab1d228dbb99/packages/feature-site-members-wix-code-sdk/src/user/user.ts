import { REGISTRATION_RESULT_STATUS_DISPLAY, UserRoles, UserErrors } from '../types'
import { Apis, formatPlatformizedHttpError, handleErrors } from './utils'
import { MemberDetails } from 'feature-site-members'

let authorizationSingleton = ''
export interface Member extends MemberDetails {
	uid: string
	svSession: string
}

export class User {
	public id?: string
	public loggedIn: boolean = false
	public role: UserRoles

	constructor(
		memberData: Partial<Member>,
		status: REGISTRATION_RESULT_STATUS_DISPLAY | undefined,
		authorization?: string
	) {
		authorizationSingleton = authorization || ''
		if (memberData.uid && status === REGISTRATION_RESULT_STATUS_DISPLAY.PENDING) {
			this.id = memberData.uid
			this.role = UserRoles.VISITOR
		} else if (memberData.uid) {
			this.id = memberData.uid
			this.loggedIn = true
			this.role = memberData.role === 'OWNER' ? UserRoles.ADMIN : UserRoles.MEMBER
		} else {
			this.id = memberData.svSession
			this.role = UserRoles.VISITOR
		}
	}

	public getEmail() {
		if (!this.loggedIn) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}
		return getCurrentMember(authorizationSingleton).then(({ member }: any) =>
			member ? member.loginEmail || member.email : Promise.reject(UserErrors.NO_LOGGED_IN)
		)
	}

	public getPricingPlans() {
		if (!this.loggedIn) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}
		return getUserPlans(this.id, authorizationSingleton).catch((error: any) =>
			Promise.reject(formatPlatformizedHttpError(error))
		)
	}

	public getSlug() {
		if (!this.loggedIn) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}
		return getCurrentMember(authorizationSingleton).then(({ member }: any) =>
			member ? member.slug : Promise.reject(UserErrors.NO_LOGGED_IN)
		)
	}

	public getRoles() {
		if (!this.loggedIn) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}
		return fetch(Apis.currentUserRolesUrl, { headers: { authorization: authorizationSingleton } })
			.then(handleErrors)
			.then((rawRolesResponse) => serializeMemberRoles(rawRolesResponse))
			.catch((error: any) => Promise.reject(formatPlatformizedHttpError(error)))
	}
}

export async function getCurrentMember(authorization: string) {
	return fetchCurrentMember(authorization).catch((error: any) => Promise.reject(formatPlatformizedHttpError(error)))
}

export const fetchCurrentMember = (authorization: string) => {
	return fetch(Apis.currentUserDetails, { headers: { authorization } }).then(handleErrors)
}

export const getUserPlans = (userId: string | undefined, authorization: string) => {
	if (!userId) {
		return Promise.resolve([])
	}
	const plans = fetch(Apis.currentUserPlansUrl, { headers: { authorization } })
	const memberships = fetch(Apis.plansMembershipsUrl(userId), { headers: { authorization } })
	return Promise.all([plans, memberships])
		.then(handleErrors)
		.then(([plansJson, membershipsJson]) => serializeMemberPlans(plansJson, membershipsJson))
}

export const serializeMemberPlans = (plansJson: any, membershipsJson: any) => {
	const plans = (plansJson && plansJson.groups) || []
	const memberships = (membershipsJson && membershipsJson.memberships) || []
	return plans.map((plan: any) => {
		const membership = memberships.find((_membership: any) => {
			return _membership.groupId === plan.id
		})
		const res: any = { name: plan.title }
		if (membership && membership.startDate) {
			res.startDate = new Date(membership.startDate)
		}
		if (membership && membership.expiryDate) {
			res.expiryDate = new Date(membership.expiryDate)
		}
		return res
	})
}

export const serializeMemberRoles = (rawRoles: any) => {
	if (!rawRoles?.groups) {
		return []
	}
	return rawRoles.groups.map((role: any) => {
		return { name: role.title, description: role.description }
	})
}
