import { SiteMembersApiSymbol } from './symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { ISiteMembersApi, CurrentMemberTPAHandlerResponse, TPARequestLoginOptions, TPALogoutOptions } from './types'

const siteMembersTPAHandlers = (siteMembersApi: ISiteMembersApi) => ({
	getTpaHandlers() {
		const currentMember = async (): Promise<CurrentMemberTPAHandlerResponse> => {
			const member = await siteMembersApi.getMemberDetails()
			if (member) {
				return {
					attributes: {
						firstName: member.firstName ?? '',
						lastName: member.lastName ?? '',
						privacyStatus: member.profilePrivacyStatus,
					},
					name: member.memberName,
					email: member.loginEmail,
					id: member.id,
					owner: member.owner,
					status: member.status,
				}
			}

			return null
		}
		const requestLogin = async (
			_compId: void,
			dialogOptions: TPARequestLoginOptions = {}
		): Promise<CurrentMemberTPAHandlerResponse> => {
			const { member } = await siteMembersApi.promptLogin({
				mode: dialogOptions.mode,
				modal: dialogOptions.modal,
			})
			return {
				attributes: {
					firstName: member.firstName ?? '',
					lastName: member.lastName ?? '',
					privacyStatus: member.profilePrivacyStatus,
				},
				name: member.memberName,
				email: member.loginEmail,
				id: member.id,
				owner: member.owner,
				status: member.status,
			}
		}

		return {
			currentMember,
			smCurrentMember: currentMember,
			logOutCurrentMember(_comp: never, options?: TPALogoutOptions): void {
				siteMembersApi.logout(options?.url)
			},
			requestLogin,
			smRequestLogin: requestLogin,
		}
	},
})

export const SiteMembersTPAHandlers = withDependencies([SiteMembersApiSymbol], siteMembersTPAHandlers)
