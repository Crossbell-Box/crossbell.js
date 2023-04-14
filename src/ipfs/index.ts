import retry from 'async-retry'
import { ipfsFetch, isIpfsUrl } from '@crossbell/ipfs-fetch'
import { type IpfsResponse } from '../types/ipfs'
import {
  type BaseMetadata,
  type CharacterMetadata,
  type Metadata,
  type NoteMetadata,
} from '../types/metadata'

export class Ipfs {
  static uploadJson(json: any) {
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

  static uploadFile(file: File | Blob): Promise<IpfsResponse> {
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

  static async metadataToUri(metadata: Metadata) {
    const res = await this.uploadJson(metadata)

    if (!res?.url?.startsWith('ipfs://')) {
      throw new Error('upload to IPFS failed')
    }

    return res.url
  }

  static uriToMetadata<T extends Metadata>(uri: string) {
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

  static async parseMetadataOrUri(
    type: 'note',
    metadataOrUri: NoteMetadata | string,
    retrieveMetadataIfNeeded?: false,
  ): Promise<{ uri: string }>
  static async parseMetadataOrUri(
    type: 'note',
    metadataOrUri: NoteMetadata | string,
    retrieveMetadataIfNeeded: true,
  ): Promise<{ metadata: NoteMetadata; uri: string }>
  static async parseMetadataOrUri(
    type: 'character',
    metadataOrUri: CharacterMetadata | string,
    retrieveMetadataIfNeeded?: false,
  ): Promise<{ uri: string }>
  static async parseMetadataOrUri(
    type: 'character',
    metadataOrUri: CharacterMetadata | string,
    retrieveMetadataIfNeeded: true,
  ): Promise<{ metadata: CharacterMetadata; uri: string }>
  static async parseMetadataOrUri<T extends Metadata>(
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
        ? await Ipfs.uriToMetadata<T>(uri)
        : undefined
    } else {
      metadata = metadataOrUri
      if (!metadata.type) {
        metadata.type = type
      }
      uri = await Ipfs.metadataToUri(metadata)
    }

    return {
      metadata,
      uri,
    }
  }
}
