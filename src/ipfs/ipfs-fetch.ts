import type { IpfsUrl, IpfsGatewayTemplate } from '../types'

import { DEFAULT_IPFS_GATEWAYS } from './ipfs-fetch.constant'
import { ipfsToWeb2InfoList } from './ipfs-fetch.utils'

export type IpfsToFastestWeb2UrlConfig = {
  gateways?: IpfsGatewayTemplate[]
  timeout?: number
}

export enum IpfsFetchError {
  timeout = 'ipfsFetch timeout',
}

const NEVER = new Promise<never>(() => {})

export function ipfsFetch(
  ipfsUrl: IpfsUrl,
  {
    gateways = DEFAULT_IPFS_GATEWAYS,
    timeout = 6000,
  }: IpfsToFastestWeb2UrlConfig = {},
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const web2InfoList = ipfsToWeb2InfoList(ipfsUrl, gateways)
    const abortControllerSet = new Set<AbortController>()

    const cancelRequests = () => {
      abortControllerSet.forEach((abortController) => abortController.abort())
      abortControllerSet.clear()
    }

    const timeoutId = setTimeout(() => {
      cancelRequests()
      reject(new Error(IpfsFetchError.timeout))
    }, timeout)

    Promise.race(
      web2InfoList.map((info) => {
        const abortController = new AbortController()
        abortControllerSet.add(abortController)

        return (
          fetch(info.url, { signal: abortController.signal })
            .then((res) => {
              // Only resolve successful requests
              if (res.status === 200) {
                // Remove current abortController to avoid unexpected abort behavior
                abortControllerSet.delete(abortController)
                return res
              } else {
                return NEVER
              }
            })
            // Ignore fetch errors
            .catch(() => NEVER)
        )
      }),
    ).then((res) => {
      resolve(res)
      clearTimeout(timeoutId)
      cancelRequests()
    })
  })
}
