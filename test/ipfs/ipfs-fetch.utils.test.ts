import { expect, describe, it, test } from 'vitest'

import {
  parseIpfsInfo,
  ipfsToWeb2InfoList,
  fillIpfsGatewayTemplate,
} from '../../src/ipfs/ipfs-fetch.utils'
import { IpfsUrl, IpfsInfo, IpfsGatewayTemplate } from '../../src/types'

describe('ipfs-fetch.utils', () => {
  describe.concurrent('parseIpfsInfo', () => {
    it(`should parse ipfs url`, () => {
      expect(
        parseIpfsInfo(
          'ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
        ),
      ).toEqual({
        cid: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
        pathToResource: '',
      })
    })

    it(`should parse ipfs url with path`, () => {
      expect(
        parseIpfsInfo(
          'ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html',
        ),
      ).toEqual({
        cid: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
        pathToResource: '/wiki/Vincent_van_Gogh.html',
      })
    })

    it(`should return null if the url is incorrect`, () => {
      expect(parseIpfsInfo('https://google.com' as IpfsUrl)).toBeNull()
      expect(parseIpfsInfo('ipfs://' as IpfsUrl)).toBeNull()
      expect(parseIpfsInfo('' as IpfsUrl)).toBeNull()
    })
  })

  describe.concurrent('ipfsToWeb2InfoList', () => {
    const gateways: IpfsGatewayTemplate[] = [
      'https://ipfs.io/ipfs/{cid}{pathToResource}',
      'https://{cid}.ipfs.dweb.link{pathToResource}',
    ]

    it(`should return web2 info list`, () => {
      expect(
        ipfsToWeb2InfoList(
          'ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
          gateways,
        ),
      ).toMatchInlineSnapshot(`
        [
          {
            "gateway": "https://ipfs.io/ipfs/{cid}{pathToResource}",
            "url": "https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq",
          },
          {
            "gateway": "https://{cid}.ipfs.dweb.link{pathToResource}",
            "url": "https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link",
          },
        ]
      `)
    })

    it(`should return empty list if the ipfs url is incorrect`, () => {
      expect(
        ipfsToWeb2InfoList('https://google.com' as IpfsUrl, gateways),
      ).toEqual([])
    })
  })

  describe.concurrent('fillIpfsGatewayTemplate', () => {
    const ipfsInfos: IpfsInfo[] = [
      {
        cid: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
        pathToResource: '',
      },
      {
        cid: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
        pathToResource: 'wiki',
      },
      {
        cid: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
        pathToResource: '/wiki',
      },
    ]

    test(`path type gateway`, () => {
      const gateways: IpfsGatewayTemplate[] = [
        'https://ipfs.io/ipfs/{cid}{pathToResource}',
        'https://ipfs.io/ipfs/{cid}/{pathToResource}',
      ]

      expect(
        gateways.flatMap((gateway) =>
          ipfsInfos.map((ipfsInfo) =>
            fillIpfsGatewayTemplate(gateway, ipfsInfo),
          ),
        ),
      ).toMatchInlineSnapshot(`
        [
          "https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq",
          "https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki",
          "https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki",
          "https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq",
          "https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki",
          "https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki",
        ]
      `)
    })

    test(`subdomain type gateway`, () => {
      const gateways: IpfsGatewayTemplate[] = [
        'https://{cid}.ipfs.dweb.link{pathToResource}',
        'https://{cid}.ipfs.dweb.link/{pathToResource}',
      ]

      expect(
        gateways.flatMap((gateway) =>
          ipfsInfos.map((ipfsInfo) =>
            fillIpfsGatewayTemplate(gateway, ipfsInfo),
          ),
        ),
      ).toMatchInlineSnapshot(`
        [
          "https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link",
          "https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki",
          "https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki",
          "https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link",
          "https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki",
          "https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki",
        ]
      `)
    })
  })
})
