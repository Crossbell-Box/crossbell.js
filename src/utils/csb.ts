const CSB_PROTOCOL = 'csb://' as const

const SUPPORTED_SCOPES = ['account', 'asset'] as const

export function parseCsbUri(uri: string) {
	if (!uri.startsWith(CSB_PROTOCOL)) {
		throw new Error('Invalid csb uri. It should start with csb://')
	}

	const newUri = uri.replace(CSB_PROTOCOL, 'http://') // new URL() only accepts common protocols

	const url = new URL(newUri)

	const scheme = CSB_PROTOCOL
	const scope = url.username as typeof SUPPORTED_SCOPES[number]
	const identity = url.password
	const host = url.host

	// account
	const platform = scope === 'account' ? host : undefined

	// asset
	const network = scope === 'asset' ? host : undefined
	const contract_address =
		scope === 'asset' ? identity.split('-')[0] : undefined
	const token_id = scope === 'asset' ? identity.split('-')[1] : undefined

	return {
		scheme,
		scope,
		identity,
		host,
		platform,
		network,
		contract_address,
		token_id,
	}
}
