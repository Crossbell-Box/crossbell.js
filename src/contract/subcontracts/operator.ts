import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Result } from '../../types/contract'

export class OperatorContract extends BaseContract {
  /**
   * This sets the operator of the character.
   *
   * Each character can have only one operator.
   * The operator can be any address.
   * It can then be used to operate transactions in behalf of the character's owner.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @param operator - The address of the operator.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async setOperator(
    characterId: number,
    operator: string,
  ): Promise<Result<{}, true>> | never {
    this.validateAddress(operator)
    const tx = await this.contract.setOperator(characterId, operator)

    const receipt = await tx.wait()

    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the operator of the character.
   * 
   * @category Operator
   * @param characterId The id of the character.
   * @returns The operator of the character.
   * @default '0x0000000000000000000000000000000000000000'
   */
  async getOperator(
    characterId: number,
  ): Promise<Result<string, false>> | never {
    const operator = await this.contract.getOperator(characterId)

    return {
      data: operator,
    }
  }
}
