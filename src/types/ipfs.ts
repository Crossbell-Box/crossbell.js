export type IpfsResponse = {
  status: 'ok' | 'error'
  cid: string
  /** ipfs url. e.g. `ipfs://...` */
  url: string
  /** http url. e.g. `https://...` */
  web2url: string
}
