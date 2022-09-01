import { IpfsGatewayTemplate } from '../types'

export const DEFAULT_IPFS_GATEWAYS: IpfsGatewayTemplate[] = [
  'https://ipfs.io/ipfs/{cid}{pathToResource}',
  'https://dweb.link/ipfs/{cid}{pathToResource}',
  'https://cloudflare-ipfs.com/ipfs/{cid}{pathToResource}',
  'https://cf-ipfs.com/ipfs/{cid}{pathToResource}',
  'https://4everland.io/ipfs/{cid}{pathToResource}',
]
