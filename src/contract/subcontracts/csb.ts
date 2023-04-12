import { Address, Hex } from 'viem'
import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Result } from '../../types/contract'
import { validateAddress } from '../../utils'

export class CsbContract {
  constructor(private base: BaseContract) {}

  /**
   * It returns the $CSB balance of the owner.
   * @category CSB
   * @param {string} owner - The address of the account to get the $CSB balance of.
   * @returns The $CSB balance of the owner.
   */
  async getBalance(owner: Address): Promise<Result<bigint>> | never {
    validateAddress(owner)
    const balance = await this.base.publicClient.getBalance({ address: owner })
    return {
      data: balance,
    }
  }

  /**
   * It sends $CSB to the address.
   * @category CSB
   * @param {string} toAddress - The address to send $CSB to.
   * @param {string} amount - The amount of $CSB to send. (in wei)
   * @returns The $CSB balance of the owner.
   */
  @autoSwitchMainnet()
  async transferCsb(
    toAddress: Hex,
    amount: bigint | number,
  ): Promise<Result<{}, true>> {
    validateAddress(toAddress)

    const hash = await this.base.walletClient!.sendTransaction({
      account: this.base.account!,
      to: toAddress,
      value: BigInt(amount),
    })
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash,
    })

    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }
}
