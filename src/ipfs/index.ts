import '../utils/fetch'
import type { ProfileMetadata } from '../types/metadata'

export class Ipfs {
  static async uploadJson(json: any) {
    const res = await fetch('https://ipfs-relay.crossbell.io/json', {
      method: 'POST',
      body: JSON.stringify(json),
    }).then((res) => res.json())

    return res as IpfsResponse
  }

  static async metadataToUri(metadata: ProfileMetadata) {
    const res = await this.uploadJson(metadata)

    if (!res?.url?.startsWith('ipfs://')) {
      throw new Error('upload to IPFS failed')
    }

    return res.url
  }

  static async uriToMetadata<T extends ProfileMetadata>(uri: string) {
    if (uri.startsWith('ipfs://')) {
      // to cf-ipfs endpoint
      uri = uri.replace('ipfs://', 'https://cf-ipfs.com/ipfs/')
    }

    const res = await fetch(uri).then((res) => res.json())

    return res as T
  }
}

type IpfsResponse = {
  status: 'ok' | 'error'
  cid: string
  /** ipfs url. e.g. `ipfs://...` */
  url: string
  /** http url. e.g. `https://...` */
  web2url: string
}
