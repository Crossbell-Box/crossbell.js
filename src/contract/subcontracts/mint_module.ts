import { BigNumberish } from 'ethers'
import { MintOrLinkModuleConfig, Overrides, Result } from '../../types'
import { autoSwitchMainnet } from '../decorators'
import { BaseContract } from './base'

export class MintModuleContract extends BaseContract {
  /**
   * This sets the mint module for a note.
   * @category MintModule
   * @param characterId The character ID to set the mint module for.
   * @param noteId The note ID to set the mint module for.
   * @param mintModule The link module to set.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async setMintModuleForNote(
    characterId: BigNumberish,
    noteId: BigNumberish,
    mintModule: MintOrLinkModuleConfig,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const moduleConfig = await this.getModuleConfig(mintModule)

    const tx = await this.contract.setMintModule4Note(
      {
        characterId,
        noteId,
        mintModule: moduleConfig.address,
        mintModuleInitData: moduleConfig.initData,
      },
      overrides,
    )

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }
}
