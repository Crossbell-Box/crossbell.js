import { autoSwitchMainnet } from '../decorators'
import type { Overrides, Result } from '../../types/contract'
import { BaseContract } from './base'
import { CallOverrides, type BigNumberish } from 'ethers'
import { isAddressEqual } from '../../utils'

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
  async getMiraBalanceOfCharacter(
    characterId: BigNumberish,
    overrides: CallOverrides = {},
  ): Promise<Result<string>> | never {
    const address = await this.getContract().ownerOf(characterId, overrides)

    const balance = isAddressEqual(
      address,
      this.options.newbieVillaContractAddress,
    )
      ? await this.getNewbieVillaContract().balanceOf(characterId, overrides)
      : await this.getMiraContract().balanceOf(address, overrides)

    return { data: balance.toString() }
  }

  /**
   * This gets the balance of $MIRA token of an address.
   *
   * @category TipsContract
   * @param address - The address to get the balance of.
   * @returns The balance of $MIRA token of the address. Unit: wei.
   */
  async getMiraBalance(
    address: string,
    overrides: CallOverrides = {},
  ): Promise<Result<string>> | never {
    const balance = await this.getMiraContract().balanceOf(address, overrides)

    return {
      data: balance.toString(),
    }
  }

  /**
   * This gets the token address of $MIRA.
   *
   * @category TipsContract
   * @returns The token address of $MIRA.
   */
  async getMiraTokenAddress(
    overrides: CallOverrides = {},
  ): Promise<Result<string>> | never {
    const res = await this.getTipsContract().getToken(overrides)

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
  async getMiraTokenDecimals(
    overrides: CallOverrides = {},
  ): Promise<Result<number>> | never {
    const res = await this.getMiraContract().decimals(overrides)

    return {
      data: res,
    }
  }
}
