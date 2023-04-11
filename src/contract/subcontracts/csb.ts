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

    console.log('do');
    
    this.walletClient!.sendTransaction({
      account: this.account!,
      chain: this.walletClient?.chain,
      to: toAddress,
      value: BigInt(amount),
    })

    // https://github.com/wagmi-dev/wagmi/blob/3e9145bdfc311f6eaeffe0747d03455f548d918c/packages/core/src/actions/transactions/sendTransaction.ts#L82-L100
    // const signer = this.contract.signer
    // const uncheckedSigner =
    //   (signer as providers.JsonRpcSigner).connectUnchecked?.() ?? signer
    // const tx = await uncheckedSigner.sendTransaction({
    //   to: toAddress,
    //   value: amount,
    // })
    // const receipt = await tx.wait()
    // this.walletClient!.sendTransaction({
    //   to: toAddress,
    //   value: BigInt(amount),
    // })
    // return {
    //   data: {},
    //   transactionHash: receipt.transactionHash,
    // }
  }
}
