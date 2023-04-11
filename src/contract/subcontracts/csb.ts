import { Address, Hex } from 'viem'
import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Result } from '../../types/contract'

export class CsbContract extends BaseContract {
  /**
   * It returns the $CSB balance of the owner.
   * @category CSB
   * @param {string} owner - The address of the account to get the $CSB balance of.
   * @returns The $CSB balance of the owner.
   */
  async getBalance(owner: Address): Promise<Result<bigint>> | never {
    this.validateAddress(owner)
    const balance = await this.publicClient.getBalance({ address: owner })
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
    this.validateAddress(toAddress)

    console.log(this, this.account)
    const hash = await this.walletClient!.sendTransaction({
      account: this.account!,
      to: toAddress,
      value: BigInt(amount),
    })
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash })

    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }
}
