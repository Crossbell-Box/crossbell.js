import type { Web2Url, IpfsUrl, IpfsInfo, IpfsGatewayTemplate } from '../types'

import { DEFAULT_IPFS_GATEWAYS } from './ipfs-fetch.constant'

export type Web2Info = { url: Web2Url; gateway: IpfsGatewayTemplate }

export function parseIpfsInfo(ipfsUrl: IpfsUrl): IpfsInfo | null {
  const [, protocol = '', cid = '', pathToResource = ''] =
    /^(\w+):\/\/([^/]+)(.*)/.exec(ipfsUrl) ?? []

  if (protocol.toLowerCase() !== 'ipfs' || !cid) {
    console.error(`Invalid IPFS URL: ${ipfsUrl}`)
    return null
  }

  return {
    cid,
    pathToResource: pathToResource as IpfsInfo['pathToResource'],
  }
}

export function fillIpfsGatewayTemplate(
  gateway: IpfsGatewayTemplate,
  ipfsInfo: IpfsInfo,
): Web2Url {
  const formattedPath = (() => {
    if (
      ipfsInfo.pathToResource === '' ||
      ipfsInfo.pathToResource.startsWith('/')
    ) {
      return ipfsInfo.pathToResource
    } else {
      return `/${ipfsInfo.pathToResource}`
    }
  })()

  return gateway
    .replace(/{cid}/g, ipfsInfo.cid)
    .replace(/\/?{pathToResource}/g, formattedPath) as Web2Url
}

export function ipfsToWeb2InfoList(
  ipfsUrl: IpfsUrl,
  gateways: IpfsGatewayTemplate[] = DEFAULT_IPFS_GATEWAYS,
): Web2Info[] {
  const ipfsInfo = parseIpfsInfo(ipfsUrl)

  if (!ipfsInfo) {
    return []
  }

  return gateways.map((gateway) => ({
    gateway,
    url: fillIpfsGatewayTemplate(gateway, ipfsInfo),
  }))
}
