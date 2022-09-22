import { autoSwitchMainnet } from '../decorators'
import type { Result } from '../../types/contract'
import { BaseContract } from './base'
import { type BigNumberish } from 'ethers'

export class CbtContract extends BaseContract {
  /**
   * This mint a new CBT token to a character.
   *
   * @category CharacterBoundToken
   * @param characterId - The id of the character.
   * @param tokenId - The id of the token.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async mintCbt(
    characterId: BigNumberish,
    tokenId: BigNumberish,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.cbtContract.mint(characterId, tokenId)

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }
}
