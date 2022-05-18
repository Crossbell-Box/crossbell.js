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
  @autoSwitchMainnet()
  async getBalance(owner: string): Promise<Result<string>> | never {
    const balance = await this.contract.provider.getBalance(owner)
    return {
      data: balance.toString(),
    }
  }
}
