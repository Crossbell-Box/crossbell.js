import {
  type MintOrLinkModuleConfig,
  type Numberish,
  type Result,
  type WriteOverrides,
} from '../../types'
import {
  getModuleConfig,
  waitForTransactionReceiptWithRetry,
} from '../../utils'
import { type Entry } from '../abi'
import { autoSwitchMainnet } from '../decorators'
import { type BaseContract } from './base'

export class MintModuleContract {
  constructor(private base: BaseContract) {}

  /**
   * This sets the mint module for a note.
   * @category MintModule
   * @param characterId The character ID to set the mint module for.
   * @param noteId The note ID to set the mint module for.
   * @param mintModule The link module to set.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async setForNote(
    {
      characterId,
      noteId,
      mintModule,
    }: {
      characterId: Numberish
      noteId: Numberish
      mintModule: MintOrLinkModuleConfig
    },
    overrides: WriteOverrides<Entry, 'setMintModule4Note'> = {},
  ): Promise<Result<undefined, true>> {
    const moduleConfig = await getModuleConfig(mintModule)

    const hash = await this.base.contract.write.setMintModule4Note(
      [
        {
          characterId: BigInt(characterId),
          noteId: BigInt(noteId),
          mintModule: moduleConfig.address,
          mintModuleInitData: moduleConfig.initData,
        },
      ],
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
}
