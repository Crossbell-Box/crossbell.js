import { autoSwitchMainnet } from '../decorators'
import type {
  WriteOverrides,
  Result,
  ReadOverrides,
} from '../../types/contract'
import { BaseContract } from './base'
import { Address, encodeAbiParameters, isAddressEqual } from 'viem'
import { Entry, Mira, Tips } from '../abi'

export class TipsContract {
  constructor(private base: BaseContract) {}

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
    fromCharacterId: bigint,
    toCharacterId: bigint,
    amount: bigint | number,
    overrides: WriteOverrides<Mira, 'send'> = {},
  ): Promise<Result<undefined, true>> | never {
    const data = encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }],
      [fromCharacterId, toCharacterId],
    )

    const tx = await this.base.miraContract.write.send(
      [this.base.options.address.tipsContract, BigInt(amount), data],
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
    fromCharacterId: bigint,
    toCharacterId: bigint,
    toNoteId: bigint,
    amount: bigint | number,
    overrides: WriteOverrides<Mira, 'send'> = {},
  ): Promise<Result<undefined, true>> | never {
    const data = encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }],
      [fromCharacterId, toCharacterId, toNoteId],
    )

    const tx = await this.base.miraContract.write.send(
      [this.base.options.address.tipsContract, BigInt(amount), data],
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
   * This gets the balance of $MIRA token of a character.
   *
   * If it is a normal character, this returns the balance of the address of the character.
   * If it is a newbie-village character, this returns the balance of the character in the contract.
   *
   * This throws if the character is not found.
   *
   * @category TipsContract
   * @param characterId - The character ID to get the balance of.
   * @returns The balance of $MIRA token of the address. Unit: wei.
   */
  async getBalanceOfCharacter(
    characterId: bigint,
    overrides: ReadOverrides<Entry, 'ownerOf' | 'balanceOf'> = {},
  ): Promise<Result<bigint>> | never {
    const address = await this.base.contract.read.ownerOf(
      [characterId],
      overrides,
    )

    const balance = isAddressEqual(
      address,
      this.base.options.address.newbieVillaContract,
    )
      ? await this.base.newbieVillaContract.read.balanceOf(
          [characterId],
          overrides,
        )
      : await this.base.miraContract.read.balanceOf([address], overrides)

    return { data: balance }
  }

  /**
   * This gets the balance of $MIRA token of an address.
   *
   * @category TipsContract
   * @param address - The address to get the balance of.
   * @returns The balance of $MIRA token of the address. Unit: wei.
   */
  async getBalance(
    address: Address,
    overrides: ReadOverrides<Entry, 'balanceOf'> = {},
  ): Promise<Result<bigint>> | never {
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
  ): Promise<Result<Address>> | never {
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
  ): Promise<Result<number>> | never {
    const res = await this.base.miraContract.read.decimals(overrides)

    return {
      data: res,
    }
  }
}
