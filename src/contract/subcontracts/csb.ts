import { type Address, type Hex } from 'viem'
import { autoSwitchMainnet } from '../decorators'
import { type Numberish, type Result } from '../../types'
import {
  validateAddress,
  waitForTransactionReceiptWithRetry,
} from '../../utils'
import { type BaseContract } from './base'

export class CsbContract {
  constructor(private base: BaseContract) {}

  /**
   * It returns the $CSB balance of the owner.
   * @category CSB
   * @returns The $CSB balance of the owner.
   */
  async getBalance({
    owner,
  }: {
    /** The address of the account to get the $CSB balance of. */
    owner: Address
  }): Promise<Result<bigint>> {
    validateAddress(owner)
    const balance = await this.base.publicClient.getBalance({ address: owner })
    return {
      data: balance,
    }
  }

  /**
   * It sends $CSB to the address.
   * @category CSB
   * @returns The $CSB balance of the owner.
   */
  @autoSwitchMainnet()
  async transfer({
    toAddress,
    amount,
  }: {
    /** The address to send $CSB to. */
    toAddress: Hex
    /** The amount of $CSB to send. (in wei) */
    amount: Numberish
  }): Promise<Result<{}, true>> {
    validateAddress(toAddress)

    const hash = await this.base.walletClient!.sendTransaction({
      account: this.base.account!,
      to: toAddress,
      value: BigInt(amount),
    })
    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }
}
