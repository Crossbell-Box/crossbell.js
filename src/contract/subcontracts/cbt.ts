import { autoSwitchMainnet } from '../decorators'
import type { Overrides, Result } from '../../types/contract'
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
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.cbtContract.mint(characterId, tokenId, overrides)

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets the URI of the token.
   *
   * @category CharacterBoundToken
   * @param tokenId - The id of the token.
   * @param uri - The URI of the token.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async setCbtTokenUri(
    tokenId: BigNumberish,
    uri: string,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.cbtContract.setTokenURI(tokenId, uri, overrides)

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the URI of the token.
   * @category CharacterBoundToken
   * @param tokenId - The id of the token.
   * @returns The URI of the token.
   */
  async getCbtTokenUri(tokenId: BigNumberish): Promise<Result<string>> | never {
    const uri = await this.cbtContract.uri(tokenId)

    return {
      data: uri,
    }
  }
}
