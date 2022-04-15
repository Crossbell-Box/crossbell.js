// import type { BytesLike } from 'ethers'
// import type { Abi } from './abi/types'
// import type { Result } from './types'
// import { NIL_ADDRESS } from './utils'

import { BaseContract } from './base'

export class LinkModuleContract extends BaseContract {
  // getLinkModule4Profile <-- to delete
  // setLinkModule4Profile
  // getLinkModule4Address <-- not implemented
  // setLinkModule4Address
  // setLinkModule4ERC721
  // setLinkModule4Link
  // setLinkModule4Note
  /**
   * @deprecated
   * Please use `getProfile()` instead.
   *
   * This returns the link module for a given profile
   * @param {string} profileId - The profile ID of the profile you want to get the link module for.
   * @returns The link module address for the profile.
   */
  // TODO: next version
  // async getLinkModule4Profile(
  //   profileId: string,
  // ): Promise<Result<string>> | never {
  //   const linkModule = await this.contract.getLinkModule4Profile(profileId)
  //   return {
  //     data: linkModule,
  //   }
  // }
  // TODO: next version
  // async setLinkModule4Profile(
  //   profileId: string,
  //   linkModule: string,
  //   linkModuleInitData: BytesLike,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.setLinkModule4Profile(
  //     profileId,
  //     NIL_ADDRESS,
  //     NIL_ADDRESS,
  //   )
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }
  // TODO: next version
  // async getLinkModule4Address(
  //   profileId: string,
  // ): Promise<string | null> | never {
  //   const linkModule = await this.contract.getLinkModule4Address(profileId)
  //   return linkModule
  // }
}
