import { type Address, encodeAbiParameters } from 'viem'
import { autoSwitchMainnet } from '../decorators'
import { type Mira } from '../abi'
import { type TipsWithFee } from '../abi/tips-with-fee'
import {
  type Numberish,
  type ReadOverrides,
  type Result,
  type WriteOverrides,
} from '../../types'
import { type BaseContract } from './base'

export class TipsWithFeeContract {
  constructor(private base: BaseContract) {}

  /**
   * This tips a character with $MIRA token.
   *
   * @category TipsWithFeeContract
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async tipCharacter(
    {
      fromCharacterId,
      toCharacterId,
      amount,
      feeReceiver,
    }: {
      /** The character ID of the character that is tipping. */
      fromCharacterId: Numberish
      /** The character ID of the character that is being tipped. */
      toCharacterId: Numberish
      /** The amount of $MIRA token to tip. Unit: wei. */
      amount: Numberish
      /** Fee receiver address. */
      feeReceiver: Address
    },
    overrides: WriteOverrides<Mira, 'send'> = {},
  ): Promise<Result<undefined, true>> {
    const data = encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }, { type: 'address' }],
      [BigInt(fromCharacterId), BigInt(toCharacterId), feeReceiver],
    )

    const hash = await this.base.miraContract.write.send(
      [this.base.options.address.tipsWithFeeContract, BigInt(amount), data],
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
   * This tips a character for a note with $MIRA token.
   *
   * @category TipsWithFeeContract
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async tipCharacterForNote(
    {
      fromCharacterId,
      toCharacterId,
      toNoteId,
      amount,
      feeReceiver,
    }: {
      /** The character ID of the character that is tipping. */
      fromCharacterId: Numberish
      /** The character ID of the character that is being tipped. */
      toCharacterId: Numberish
      /** The note ID of the note that is being tipped. */
      toNoteId: Numberish
      /** The amount of $MIRA token to tip. Unit: wei. */
      amount: Numberish
      /** Fee receiver address. */
      feeReceiver: Address
    },
    overrides: WriteOverrides<Mira, 'send'> = {},
  ): Promise<Result<undefined, true>> {
    const data = encodeAbiParameters(
      [
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'address' },
      ],
      [
        BigInt(fromCharacterId),
        BigInt(toCharacterId),
        BigInt(toNoteId),
        feeReceiver,
      ],
    )

    const hash = await this.base.miraContract.write.send(
      [this.base.options.address.tipsWithFeeContract, BigInt(amount), data],
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
   * This gets the fee percentage of specific <receiver, note>.
   *
   * @category TipsWithFeeContract
   * @returns The fee percentage of specific <receiver, note>.
   */
  async getFeeFraction(
    feeReceiver: Address,
    characterId: Numberish,
    noteId: Numberish,
    overrides: ReadOverrides<TipsWithFee, 'getFeeFraction'> = {},
  ): Promise<Result<bigint>> {
    const res = await this.base.tipsWithFeeContract.read.getFeeFraction(
      [feeReceiver, BigInt(characterId), BigInt(noteId)],
      overrides,
    )

    return {
      data: res,
    }
  }

  /**
   * This gets the fee is owed by <feeFraction, tipAmount>.
   *
   * @category TipsWithFeeContract
   * @returns The fee is owed by <feeFraction, tipAmount>.
   */
  async getFeeAmount(
    feeReceiver: Address,
    characterId: Numberish,
    noteId: Numberish,
    tipAmount: Numberish,
    overrides: ReadOverrides<TipsWithFee, 'getFeeAmount'> = {},
  ): Promise<Result<bigint>> {
    const res = await this.base.tipsWithFeeContract.read.getFeeAmount(
      [feeReceiver, BigInt(characterId), BigInt(noteId), BigInt(tipAmount)],
      overrides,
    )

    return {
      data: res,
    }
  }
}
