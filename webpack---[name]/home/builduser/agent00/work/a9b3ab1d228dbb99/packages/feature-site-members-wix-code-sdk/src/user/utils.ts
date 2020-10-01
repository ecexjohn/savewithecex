export const Apis = {
	currentUserDetails: `api/wix-sm/v1/members/current`,
	currentUserRolesUrl: `_api/members-groups-web/v1/groups/users/current?include_implicit_groups=true&groupType=role`,
	currentUserPlansUrl: `_api/members-groups-web/v1/groups/users/current?include_implicit_groups=true&groupType=plan`,
	plansMembershipsUrl: (userId: string) => `_api/members-groups-web/v1/groups/users/${userId}/memberships?type=plan`,
	sendUserEmailApi: '_api/shoutout/v1/emailContact',
}

export const formatPlatformizedHttpError = function(response: any) {
	const status = response.status,
		responseText = response?.text()
	if (!status && !responseText) {
		return response
	}
	if (status === 400) {
		return 'Bad Request: please check the user inputs.'
	}
	if (status === 404) {
		return 'Not Found: the requested item no longer exists.'
	}
	let errorMessage
	try {
		errorMessage = JSON.parse(responseText).message
	} catch (e) {
		/* do nothing */
	}
	return (errorMessage || 'unknown failure') + ' (' + (status || 0) + ')'
}

export const handleErrors = (response: any) => {
	if (!response.ok) {
		Promise.reject(response)
	}
	return response
}
