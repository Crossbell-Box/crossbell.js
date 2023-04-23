import { autoSwitchMainnet } from '../decorators'
import { type Cbt } from '../abi'
import {
  type Numberish,
  type ReadOverrides,
  type Result,
  type WriteOverrides,
} from '../../types'
import { type BaseContract } from './base'

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
  async mint(
    characterId: Numberish,
    tokenId: Numberish,
    overrides: WriteOverrides<Cbt, 'mint'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.cbtContract.write.mint(
      [BigInt(characterId), BigInt(tokenId)],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash,
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
  async setTokenUri(
    tokenId: Numberish,
    uri: string,
    overrides: WriteOverrides<Cbt, 'setTokenURI'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.cbtContract.write.setTokenURI(
      [BigInt(tokenId), uri],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash,
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
  async getTokenUri(
    tokenId: Numberish,
    overrides: ReadOverrides<Cbt, 'uri'> = {},
  ): Promise<Result<string>> {
    const uri = await this.base.cbtContract.read.uri(
      [BigInt(tokenId)],
      overrides,
    )

    return {
      data: uri,
    }
  }
}
