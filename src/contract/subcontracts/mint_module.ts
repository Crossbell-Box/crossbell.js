import {
  type MintOrLinkModuleConfig,
  type Result,
  type WriteOverrides,
} from '../../types'
import { getModuleConfig } from '../../utils'
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
    characterId: bigint,
    noteId: bigint,
    mintModule: MintOrLinkModuleConfig,
    overrides: WriteOverrides<Entry, 'setMintModule4Note'> = {},
  ): Promise<Result<undefined, true>> {
    const moduleConfig = await getModuleConfig(mintModule)

    const tx = await this.base.contract.write.setMintModule4Note(
      [
        {
          characterId,
          noteId,
          mintModule: moduleConfig.address,
          mintModuleInitData: moduleConfig.initData,
        },
      ],
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
}
