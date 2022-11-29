import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Overrides, Result } from '../../types/contract'
import { CallOverrides } from 'ethers'

export class OperatorContract extends BaseContract {
  /**
   * @deprecated Please use {@link addOperator} instead.
   *
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
    overrides?: Overrides,
  ): Promise<Result<{}, true>> | never {
    throw new Error(
      "Method 'setOperator' is deprecated. Please use 'addOperator' instead.",
    )

    this.validateAddress(operator)
    const tx = await this.contract.setOperator(characterId, operator, overrides)

    const receipt = await tx.wait()

    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * @deprecated Please use {@link getOperators} instead.
   *
   * This returns the operator of the character.
   *
   * @category Operator
   * @param characterId The id of the character.
   * @returns The operator of the character.
   * @default '0x0000000000000000000000000000000000000000'
   */
  async getOperator(
    characterId: number,
    overrides?: CallOverrides,
  ): Promise<Result<string, false>> | never {
    throw new Error(
      "Method 'getOperator' is deprecated. Please use 'getOperators' instead.",
    )

    const operator = await this.contract.getOperator(characterId, overrides)

    return {
      data: operator,
    }
  }

  /**
   * This adds an operator for the character.
   *
   * Each character can have multiple operators.
   * An operator can be any address.
   * It can then be used to operate transactions in behalf of the character's owner.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @param operator - The address of the operator.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async addOperator(
    characterId: number,
    operator: string,
    overrides?: Overrides,
  ): Promise<Result<{}, true>> | never {
    this.validateAddress(operator)
    const tx = await this.contract.addOperator(characterId, operator, overrides)

    const receipt = await tx.wait()

    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes an operator for the character.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @param operator - The address of the operator.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async removeOperator(
    characterId: number,
    operator: string,
    overrides?: Overrides,
  ): Promise<Result<{}, true>> | never {
    this.validateAddress(operator)
    const tx = await this.contract.removeOperator(
      characterId,
      operator,
      overrides,
    )

    const receipt = await tx.wait()

    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns operators of the character.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @returns The operators of the character.
   */
  async getOperators(
    characterId: number,
    overrides?: CallOverrides,
  ): Promise<Result<string[], false>> | never {
    const operators = await this.contract.getOperators(characterId, overrides)

    return {
      data: operators,
    }
  }

  /**
   * This checks if the address is an operator of the character.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @param operator - The address of the operator.
   * @returns True if the address is an operator of the character; otherwise, false.
   */
  async isOperator(
    characterId: number,
    operator: string,
    overrides?: CallOverrides,
  ): Promise<Result<boolean, false>> | never {
    const is = await this.contract.isOperator(characterId, operator, overrides)

    return {
      data: is,
    }
  }
}
