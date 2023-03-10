import { autoSwitchMainnet } from '../decorators'
import type { Overrides, Result } from '../../types/contract'
import { BaseContract } from './base'
import { type BigNumberish } from 'ethers'

export class TipsContract extends BaseContract {
  /**
   * This tips a character with $MIRA token.
   *
   * @category TipsContract
   * @param fromCharacterId - The character ID of the character that is tipping.
   * @param toCharacterId - The character ID of the character that is being tipped.
   * @param amount - The amount of $MIRA token to tip. Unit: wei.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async tipCharacter(
    fromCharacterId: BigNumberish,
    toCharacterId: BigNumberish,
    amount: BigNumberish,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const data = this.miraContract.interface._abiCoder.encode(
      ['uint256', 'uint256'],
      [fromCharacterId, toCharacterId],
    )

    const tx = await this.miraContract.send(
      this.options.tipsContractAddress,
      amount,
      data,
      overrides,
    )

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This tips a character for a note with $MIRA token.
   *
   * @category TipsContract
   * @param fromCharacterId - The character ID of the character that is tipping.
   * @param toCharacterId - The character ID of the character that is being tipped.
   * @param toNoteId - The note ID of the note that is being tipped.
   * @param amount - The amount of $MIRA token to tip. Unit: wei.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async tipCharacterForNote(
    fromCharacterId: BigNumberish,
    toCharacterId: BigNumberish,
    toNoteId: BigNumberish,
    amount: BigNumberish,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const data = this.miraContract.interface._abiCoder.encode(
      ['uint256', 'uint256', 'uint256'],
      [fromCharacterId, toCharacterId, toNoteId],
    )

    const tx = await this.miraContract.send(
      this.options.tipsContractAddress,
      amount,
      data,
      overrides,
    )

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }
}
