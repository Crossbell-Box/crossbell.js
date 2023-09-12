import { ipfsFetch, isIpfsUrl } from '@crossbell/ipfs-fetch'
import retry from 'async-retry'
import {
	type BaseMetadata,
	type CharacterMetadata,
	type Metadata,
	type NoteMetadata,
} from './types/metadata'

let IPFS_GATEWAY = 'https://w3s.link/ipfs/'
export function getIpfsGateway() {
	return IPFS_GATEWAY
}
export function setIpfsGateway(gateway: string) {
	IPFS_GATEWAY = gateway
}

export interface IpfsResponse {
	status: 'ok' | 'error'
	cid: string
	/** ipfs url. e.g. `ipfs://...` */
	url: string
	/** http url. e.g. `https://...` */
	web2url: string
}

export function ipfsUploadJson(json: any): Promise<IpfsResponse> {
	return retry(
		async () => {
			const res = await fetch('https://ipfs-relay.crossbell.io/json', {
				method: 'POST',
				body: JSON.stringify(json),
			}).then((res) => res.json())

			return res as IpfsResponse
		},
		{ retries: 3 },
	)
}

ipfsUploadJson({})

export function ipfsUploadFile(file: File | Blob): Promise<IpfsResponse> {
	return retry(
		async () => {
			const formData = new FormData()

			formData.append('file', file)

			const res = await fetch('https://ipfs-relay.crossbell.io/upload', {
				method: 'post',
				body: formData,
			})

			return res.json()
		},
		{ retries: 3 },
	)
}

export async function ipfsMetadataToUri(metadata: Metadata) {
	const res = await ipfsUploadJson(metadata)

	if (!res?.url?.startsWith('ipfs://')) {
		throw new Error('upload to IPFS failed')
	}

	return res.url
}

export function ipfsUriToMetadata<T extends Metadata>(uri: string) {
	return retry(
		async () => {
			if (isIpfsUrl(uri)) {
				const res = await ipfsFetch(uri).then((res) => res.text())
				try {
					const json = JSON.parse(res)
					return json as T
				} catch {
					throw new Error(`Failed to parse metadata from uri: ${uri}`)
				}
			}

			let res
			try {
				res = await fetch(uri).then((res) => res.text())
				res = JSON.parse(res)
				return res as T
			} catch {
				throw new Error(
					`Failed to fetch metadata from uri: ${uri} . Response: ${res}`,
				)
			}
		},
		{ retries: 3 },
	)
}

export async function ipfsParseMetadataOrUri(
	type: 'note',
	metadataOrUri: NoteMetadata | string,
	retrieveMetadataIfNeeded?: false,
): Promise<{ uri: string }>
export async function ipfsParseMetadataOrUri(
	type: 'note',
	metadataOrUri: NoteMetadata | string,
	retrieveMetadataIfNeeded: true,
): Promise<{ metadata: NoteMetadata; uri: string }>
export async function ipfsParseMetadataOrUri(
	type: 'character',
	metadataOrUri: CharacterMetadata | string,
	retrieveMetadataIfNeeded?: false,
): Promise<{ uri: string }>
export async function ipfsParseMetadataOrUri(
	type: 'character',
	metadataOrUri: CharacterMetadata | string,
	retrieveMetadataIfNeeded: true,
): Promise<{ metadata: CharacterMetadata; uri: string }>
export async function ipfsParseMetadataOrUri<T extends Metadata>(
	type: BaseMetadata['type'],
	metadataOrUri: T | string,
	retrieveMetadataIfNeeded = false,
): Promise<{ metadata?: T; uri: string }> {
	if (metadataOrUri === '') {
		return { uri: '', metadata: undefined }
	}

	let uri
	let metadata: T | undefined
	if (typeof metadataOrUri === 'string') {
		uri = metadataOrUri
		metadata = retrieveMetadataIfNeeded
			? await ipfsUriToMetadata<T>(uri)
			: undefined
	} else {
		metadata = metadataOrUri
		if (!metadata.type) {
			metadata.type = type
		}
		uri = await ipfsMetadataToUri(metadata)
	}

	return {
		metadata,
		uri,
	}
}
