import { autoSwitchMainnet } from '../decorators'
import type { Overrides, Result } from '../../types/contract'
import { BaseContract } from './base'

export class CbtContract {
  constructor(private base: BaseContract) {}

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
    characterId: bigint,
    tokenId: bigint,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.cbtContract.write.mint(
      [characterId, tokenId],
      // overrides
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

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
    tokenId: bigint,
    uri: string,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.cbtContract.write.setTokenURI(
      [tokenId, uri],
      // overrides
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

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
  async getCbtTokenUri(
    tokenId: bigint,
    // overrides: CallOverrides = {},
  ): Promise<Result<string>> | never {
    const uri = await this.base.cbtContract.read.uri(
      [tokenId],
      // overrides
    )

    return {
      data: uri,
    }
  }
}
