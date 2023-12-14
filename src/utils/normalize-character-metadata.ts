import type { CharacterMetadata } from '../types'

export function normalizeCharacterMetadata<
	T extends CharacterMetadata | undefined,
>(metadata: T): T {
	if (!metadata) return metadata

	return {
		...metadata,
		connected_accounts: normalizeConnectedAccounts(metadata.connected_accounts),
	}
}

function normalizeConnectedAccounts(items?: unknown[]): string[] {
	if (!Array.isArray(items)) return []

	return items
		.map((item) => {
			switch (typeof item) {
				case 'string':
					return item
				case 'object':
					return item && 'uri' in item && typeof item.uri === 'string'
						? item.uri
						: ''
				default:
					return ''
			}
		})
		.filter(Boolean)
}
