import { autoSwitchMainnet } from '../decorators'
import type {
  ReadOverrides,
  WriteOverrides,
  Result,
} from '../../types/contract'
import { BaseContract } from './base'
import { Cbt } from '../abi'

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
    characterId: bigint,
    tokenId: bigint,
    overrides: WriteOverrides<Cbt, 'mint'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.cbtContract.write.mint(
      [characterId, tokenId],
      overrides,
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
  async setTokenUri(
    tokenId: bigint,
    uri: string,
    overrides: WriteOverrides<Cbt, 'setTokenURI'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.cbtContract.write.setTokenURI(
      [tokenId, uri],
      overrides,
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
  async getTokenUri(
    tokenId: bigint,
    overrides: ReadOverrides<Cbt, 'uri'> = {},
  ): Promise<Result<string>> | never {
    const uri = await this.base.cbtContract.read.uri([tokenId], overrides)

    return {
      data: uri,
    }
  }
}
