import { type Address, encodeAbiParameters, isAddressEqual } from 'viem'
import { autoSwitchMainnet } from '../decorators'
import { type Entry, type Mira, type NewbieVilla, type Tips } from '../abi'
import {
  type Numberish,
  type ReadOverrides,
  type Result,
  type WriteOverrides,
} from '../../types'
import { waitForTransactionReceiptWithRetry } from '../../utils'
import { type BaseContract } from './base'

export class TipsContract {
  constructor(private base: BaseContract) {}

  /**
   * This tips a character with $MIRA token.
   *
   * @category TipsContract
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async tipCharacter(
    {
      fromCharacterId,
      toCharacterId,
      amount,
    }: {
      /** The character ID of the character that is tipping. */
      fromCharacterId: Numberish
      /** The character ID of the character that is being tipped. */
      toCharacterId: Numberish
      /** The amount of $MIRA token to tip. Unit: wei. */
      amount: Numberish
    },
    overrides: WriteOverrides<Mira, 'send'> = {},
  ): Promise<Result<undefined, true>> {
    const data = encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }],
      [BigInt(fromCharacterId), BigInt(toCharacterId)],
    )

    const hash = await this.base.miraContract.write.send(
      [this.base.options.address.tipsContract, BigInt(amount), data],
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

  @autoSwitchMainnet()
  async tipCharacterFromNewbieVilla(
    {
      fromCharacterId,
      toCharacterId,
      amount,
    }: {
      fromCharacterId: Numberish
      toCharacterId: Numberish
      amount: Numberish
    },
    overrides: WriteOverrides<NewbieVilla, 'tipCharacter'> = {},
  ) {
    const hash = await this.base.newbieVillaContract.write.tipCharacter(
      [BigInt(fromCharacterId), BigInt(toCharacterId), BigInt(amount)],
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

  @autoSwitchMainnet()
  async tipCharacterForNoteFromNewbieVilla(
    fromCharacterId: Numberish,
    toCharacterId: Numberish,
    toNoteId: Numberish,
    amount: Numberish,
    overrides: WriteOverrides<NewbieVilla, 'tipCharacterForNote'> = {},
  ) {
    const hash = await this.base.newbieVillaContract.write.tipCharacterForNote(
      [
        BigInt(fromCharacterId),
        BigInt(toCharacterId),
        BigInt(toNoteId),
        BigInt(amount),
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

  /**
   * This tips a character for a note with $MIRA token.
   *
   * @category TipsContract
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async tipCharacterForNote(
    {
      fromCharacterId,
      toCharacterId,
      toNoteId,
      amount,
    }: {
      /** The character ID of the character that is tipping. */
      fromCharacterId: Numberish
      /** The character ID of the character that is being tipped. */
      toCharacterId: Numberish
      /** The note ID of the note that is being tipped. */
      toNoteId: Numberish
      /** The amount of $MIRA token to tip. Unit: wei. */
      amount: Numberish
    },
    overrides: WriteOverrides<Mira, 'send'> = {},
  ): Promise<Result<undefined, true>> {
    const data = encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }],
      [BigInt(fromCharacterId), BigInt(toCharacterId), BigInt(toNoteId)],
    )

    const hash = await this.base.miraContract.write.send(
      [this.base.options.address.tipsContract, BigInt(amount), data],
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
   * This gets the balance of $MIRA token of a character.
   *
   * If it is a normal character, this returns the balance of the address of the character.
   * If it is a newbie-village character, this returns the balance of the character in the contract.
   *
   * This throws if the character is not found.
   *
   * @category TipsContract
   * @returns The balance of $MIRA token of the address. Unit: wei.
   */
  async getBalanceOfCharacter(
    {
      characterId,
    }: {
      /** The character ID to get the balance of. */
      characterId: Numberish
    },
    overrides: ReadOverrides<Entry, 'ownerOf' | 'balanceOf'> = {},
  ): Promise<Result<bigint>> {
    const address = await this.base.contract.read.ownerOf(
      [BigInt(characterId)],
      overrides,
    )

    const balance = isAddressEqual(
      address,
      this.base.options.address.newbieVillaContract,
    )
      ? await this.base.newbieVillaContract.read.balanceOf(
          [BigInt(characterId)],
          overrides,
        )
      : await this.base.miraContract.read.balanceOf([address], overrides)

    return { data: balance }
  }

  /**
   * This gets the balance of $MIRA token of an address.
   *
   * @category TipsContract
   * @returns The balance of $MIRA token of the address. Unit: wei.
   */
  async getBalance(
    {
      address,
    }: {
      /** The address to get the balance of. */
      address: Address
    },
    overrides: ReadOverrides<Entry, 'balanceOf'> = {},
  ): Promise<Result<bigint>> {
    const balance = await this.base.miraContract.read.balanceOf(
      [address],
      overrides,
    )

    return {
      data: balance,
    }
  }

  /**
   * This gets the token address of $MIRA.
   *
   * @category TipsContract
   * @returns The token address of $MIRA.
   */
  async getTokenAddress(
    overrides: ReadOverrides<Tips, 'getToken'> = {},
  ): Promise<Result<Address>> {
    const res = await this.base.tipsContract.read.getToken(overrides)

    return {
      data: res,
    }
  }

  /**
   * This gets the token decimals of $MIRA.
   *
   * @category TipsContract
   * @returns The token decimals of $MIRA.
   */
  async getTokenDecimals(
    overrides: ReadOverrides<Mira, 'decimals'> = {},
  ): Promise<Result<number>> {
    const res = await this.base.miraContract.read.decimals(overrides)

    return {
      data: res,
    }
  }
}
