// import type { BytesLike } from 'ethers'
// import type { Abi } from './abi/types'
// import type { Result } from './types'
// import { NIL_ADDRESS } from './utils'

import { BaseContract } from './base'

export class LinkModuleContract extends BaseContract {
  // getLinkModule4Character <-- to delete
  // setLinkModule4Character
  // getLinkModule4Address <-- not implemented
  // setLinkModule4Address
  // setLinkModule4ERC721
  // setLinkModule4Link
  // setLinkModule4Note
  /**
   * @deprecated
   * Please use `getCharacter()` instead.
   *
   * This returns the link module for a given character
   * @param {string} characterId - The character ID of the character you want to get the link module for.
   * @returns The link module address for the character.
   */
  // TODO: next version
  // async getLinkModule4Character(
  //   characterId: string,
  // ): Promise<Result<string>> | never {
  //   const linkModule = await this.contract.getLinkModule4Character(characterId)
  //   return {
  //     data: linkModule,
  //   }
  // }
  // TODO: next version
  // async setLinkModule4Character(
  //   characterId: string,
  //   linkModule: string,
  //   linkModuleInitData: BytesLike,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.setLinkModule4Character(
  //     characterId,
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
  //   characterId: string,
  // ): Promise<string | null> | never {
  //   const linkModule = await this.contract.getLinkModule4Address(characterId)
  //   return linkModule
  // }
}
