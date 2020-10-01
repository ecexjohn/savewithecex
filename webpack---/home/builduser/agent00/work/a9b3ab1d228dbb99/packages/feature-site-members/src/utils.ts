import { MemberDetailsDTO, MemberDetails } from './types'

export const memberDetailsFromDTO = (memberDetailsDTO: MemberDetailsDTO): MemberDetails => ({
	id: memberDetailsDTO.id,
	emailVerified: memberDetailsDTO.attributes?.emailVerified,
	role: memberDetailsDTO.memberRole,
	owner: memberDetailsDTO.owner,
	loginEmail: memberDetailsDTO.email,
	memberName: memberDetailsDTO.name ?? memberDetailsDTO.attributes?.name ?? '',
	firstName: memberDetailsDTO.attributes?.firstName,
	lastName: memberDetailsDTO.attributes?.lastName,
	imageUrl: memberDetailsDTO.attributes?.imageUrl ?? '',
	nickname: memberDetailsDTO.attributes?.nickname,
	profilePrivacyStatus: memberDetailsDTO.attributes?.privacyStatus,
	slug: memberDetailsDTO.slug,
	status: memberDetailsDTO.status,
	creationDate: memberDetailsDTO.dateCreated,
	lastUpdateDate: memberDetailsDTO.dateUpdated,
	emails: [],
	phones: [],
	addresses: [],
	labels: [],
	groups: [],
	customFields: [],
})

export const hangingPromise = <T>() => new Promise<T>(() => 0)
