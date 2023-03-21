import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Result } from '../../types/contract'
import type { BigNumberish, providers } from 'ethers'

export class CsbContract extends BaseContract {
  /**
   * It returns the $CSB balance of the owner.
   * @category CSB
   * @param {string} owner - The address of the account to get the $CSB balance of.
   * @returns The $CSB balance of the owner.
   */
  async getBalance(owner: string): Promise<Result<string>> | never {
    this.validateAddress(owner)
    const balance = await this.getContract().provider.getBalance(owner)
    return {
      data: balance.toString(),
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
    toAddress: string,
    amount: BigNumberish,
  ): Promise<Result<{}, true>> | never {
    this.validateAddress(toAddress)
    // https://github.com/wagmi-dev/wagmi/blob/3e9145bdfc311f6eaeffe0747d03455f548d918c/packages/core/src/actions/transactions/sendTransaction.ts#L82-L100
    const signer = this.contract.signer
    const uncheckedSigner =
      (signer as providers.JsonRpcSigner).connectUnchecked?.() ?? signer
    const tx = await uncheckedSigner.sendTransaction({
      to: toAddress,
      value: amount,
    })
    const receipt = await tx.wait()
    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }
}
