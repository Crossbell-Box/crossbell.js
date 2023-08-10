import { autoSwitchMainnet } from '../decorators'
import { type Cbt } from '../abi'
import {
  type Numberish,
  type ReadOverrides,
  type Result,
  type WriteOverrides,
} from '../../types'
import { waitForTransactionReceiptWithRetry } from '../../utils'
import { type BaseContract } from './base'

export class CbtContract {
  constructor(private base: BaseContract) {}

  /**
   * This mint a new CBT token to a character.
   *
   * @category CharacterBoundToken
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async mint(
    {
      characterId,
      tokenId,
    }: {
      /** The id of the character. */
      characterId: Numberish
      /**  The id of the token. */
      tokenId: Numberish
    },
    overrides: WriteOverrides<Cbt, 'mint'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.cbtContract.write.mint(
      [BigInt(characterId), BigInt(tokenId)],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets the URI of the token.
   *
   * @category CharacterBoundToken
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async setTokenUri(
    {
      tokenId,
      uri,
    }: {
      /** The id of the token.*/
      tokenId: Numberish
      /** The URI of the token. */
      uri: string
    },
    overrides: WriteOverrides<Cbt, 'setTokenURI'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.cbtContract.write.setTokenURI(
      [BigInt(tokenId), uri],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the URI of the token.
   * @category CharacterBoundToken
   * @returns The URI of the token.
   */
  async getTokenUri(
    {
      tokenId,
    }: {
      /** The id of the token. */
      tokenId: Numberish
    },
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
