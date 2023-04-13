import { MintOrLinkModuleConfig, Overrides, Result } from '../../types'
import { autoSwitchMainnet } from '../decorators'
import { BaseContract } from './base'

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
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const moduleConfig = await this.base.getModuleConfig(mintModule)

    const tx = await this.base.contract.write.setMintModule4Note(
      [
        {
          characterId,
          noteId,
          mintModule: moduleConfig.address,
          mintModuleInitData: moduleConfig.initData,
        },
      ],
      // overrides,
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
