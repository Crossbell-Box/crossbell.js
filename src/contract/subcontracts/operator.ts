import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Overrides, Result } from '../../types/contract'
import { BigNumber, BigNumberish, CallOverrides } from 'ethers'
import BN from 'bn.js'
import { CharacterPermissionKey, NotePermissionKey } from '../../types'

// https://github.com/Crossbell-Box/CIPs/blob/main/CIPs/CIP-7.md

export class OperatorContract extends BaseContract {
  private CHARACTER_PERMISSION_BITMAP = {
    0: 'SET_HANDLE',
    1: 'SET_SOCIAL_TOKEN',
    2: 'GRANT_OPERATOR_PERMISSIONS',
    176: 'SET_CHARACTER_URI',
    177: 'SET_LINKLIST_URI',
    178: 'LINK_CHARACTER',
    179: 'UNLINK_CHARACTER',
    180: 'CREATE_THEN_LINK_CHARACTER',
    181: 'LINK_NOTE',
    182: 'UNLINK_NOTE',
    183: 'LINK_ERC721',
    184: 'UNLINK_ERC721',
    185: 'LINK_ADDRESS',
    186: 'UNLINK_ADDRESS',
    187: 'LINK_ANYURI',
    188: 'UNLINK_ANYURI',
    189: 'LINK_LINKLIST',
    190: 'UNLINK_LINKLIST',
    191: 'SET_LINK_MODULE_FOR_CHARACTER',
    192: 'SET_LINK_MODULE_FOR_NOTE',
    193: 'SET_LINK_MODULE_FOR_LINKLIST',
    194: 'SET_MINT_MODULE_FOR_NOTE',
    195: 'SET_NOTE_URI',
    196: 'LOCK_NOTE',
    197: 'DELETE_NOTE',
    198: 'POST_NOTE_FOR_CHARACTER',
    199: 'POST_NOTE_FOR_ADDRESS',
    200: 'POST_NOTE_FOR_LINKLIST',
    201: 'POST_NOTE_FOR_NOTE',
    202: 'POST_NOTE_FOR_ERC721',
    203: 'POST_NOTE_FOR_ANYURI',
    236: 'POST_NOTE',
  } as const

  private NOTE_PERMISSION_BITMAP = {
    0: 'SET_LINK_MODULE_FOR_NOTE',
    1: 'SET_MINT_MODULE_FOR_NOTE',
    2: 'SET_NOTE_URI',
    3: 'LOCK_NOTE',
    4: 'DELETE_NOTE',
  } as const

  /**
   * This grants permissions to an operator for a character.
   *
   * Each character can have multiple operators.
   * An operator can be any address.
   * It can then be used to operate transactions in behalf of the character's owner.
   *
   * Each time an operator is granted permissions, its previous permissions are overwritten.
   *
   * To completely remove an operator, pass an empty array (`[]`) to the `permissions` parameter.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @param operator - The address of the operator.
   * @param permissions - The permissions of the operator.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async grantOperatorPermissionsForCharacter(
    characterId: BigNumberish,
    operator: string,
    permissions: CharacterPermissionKey[],
    overrides: Overrides = {},
  ): Promise<Result<{ bitmapUint256: BigNumber }, true>> | never {
    this.validateAddress(operator)

    const permissionUint256 =
      this.convertPermissionsToUint256ForCharacter(permissions)

    const tx = await this.contract.grantOperatorPermissions(
      characterId,
      operator,
      permissionUint256,
      overrides,
    )

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'grantOperatorPermissions')

    return {
      data: {
        bitmapUint256: log.args.permissionBitMap,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This grants permission to an operator for a note.
   *
   * Each note can have multiple operators.
   * An operator can be any address.
   * It can then be used to operate transactions in behalf of the note's owner.
   *
   * Each time an operator is granted permissions, its previous permissions are overwritten.
   *
   * To completely remove an operator, pass an empty array (`[]`) to the `permissions` parameter.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @param noteId - The id of the note.
   * @param operator - The address of the operator.
   * @param permissions - The permissions of the operator.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async grantOperatorPermissionsForNote(
    characterId: BigNumberish,
    noteId: BigNumberish,
    operator: string,
    permissions: NotePermissionKey[],
    overrides: Overrides = {},
  ): Promise<Result<{ bitmapUint256: BigNumber }, true>> | never {
    this.validateAddress(operator)

    const permissionUint256 =
      this.convertPermissionsToUint256ForNote(permissions)
    const tx = await this.contract.grantOperatorPermissions4Note(
      characterId,
      noteId,
      operator,
      permissionUint256,
      overrides,
    )

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'grantOperatorPermissions4Note')

    return {
      data: {
        bitmapUint256: log.args.permissionBitMap,
      },
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
  async getOperatorsForCharacter(
    characterId: BigNumberish,
    overrides: CallOverrides = {},
  ): Promise<Result<string[], false>> | never {
    const operators = await this.contract.getOperators(characterId, overrides)
    return {
      data: operators,
    }
  }

  /**
   * This returns the permissions of an operator for a character.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @param operator - The address of the operator.
   * @returns The permissions of the operator.
   */
  async getOperatorPermissionsForCharacter(
    characterId: BigNumberish,
    operator: string,
    overrides: CallOverrides = {},
  ): Promise<Result<CharacterPermissionKey[], false>> | never {
    const permissionUint256 = await this.contract.getOperatorPermissions(
      characterId,
      operator,
      overrides,
    )

    const permissions =
      this.convertUint256ToPermissionsForCharacter(permissionUint256)

    return {
      data: permissions,
    }
  }

  /**
   * This returns the permissions of an operator for a note.
   *
   * @category Operator
   * @param characterId - The id of the character.
   * @param noteId - The id of the note.
   * @param operator - The address of the operator.
   * @returns The permissions of the operator.
   */
  async getOperatorPermissionsForNote(
    characterId: BigNumberish,
    noteId: BigNumberish,
    operator: string,
    overrides: CallOverrides = {},
  ): Promise<Result<NotePermissionKey[], false>> | never {
    const permissionUint256 = await this.contract.getOperatorPermissions4Note(
      characterId,
      noteId,
      operator,
      overrides,
    )

    const permissions =
      this.convertUint256ToPermissionsForNote(permissionUint256)

    return {
      data: permissions,
    }
  }

  /**
   * This returns the operator utils.
   *
   * @category Operator
   * @returns The operator utils.
   */
  // readonly operatorUtils = {
  //   convertPermissionsToUint256ForCharacter:
  //     this.convertPermissionsToUint256ForCharacter.bind(this),
  //   convertPermissionsToUint256ForNote:
  //     this.convertPermissionsToUint256ForNote.bind(this),
  //   convertUint256ToPermissionsForCharacter:
  //     this.convertUint256ToPermissionsForCharacter.bind(this),
  //   convertUint256ToPermissionsForNote:
  //     this.convertUint256ToPermissionsForNote.bind(this),
  // }

  /**
   * This converts the character operator permission constants array to a uint256.
   *
   * @category Operator
   * @param permissions - The permission constants array.
   * @returns The uint256.
   */
  convertPermissionsToUint256ForCharacter(
    permissions: CharacterPermissionKey[],
  ): BigNumber {
    const bits = permissions.map((permission) => {
      const bit = Object.entries(this.CHARACTER_PERMISSION_BITMAP).find(
        ([, value]) => value === permission,
      )![0]
      return parseInt(bit)
    })

    const uint256Array = Array<number>(256).fill(0)

    bits.forEach((bit) => {
      uint256Array[bit] = 1
    })

    uint256Array.reverse()

    const uint256Decimal = this.convertsBinaryBitsToUint256(uint256Array)

    return uint256Decimal
  }

  /**
   * This converts the note operator permission constants array to a uint256.
   *
   * @category Operator
   * @param permissions - The permission constants array.
   * @returns The uint256.
   */
  convertPermissionsToUint256ForNote(
    permissions: NotePermissionKey[],
  ): BigNumber {
    const bits = permissions.map((permission) => {
      const bit = Object.entries(this.NOTE_PERMISSION_BITMAP).find(
        ([, value]) => value === permission,
      )![0]
      return parseInt(bit)
    })

    const uint256Array = Array<number>(256).fill(0)

    bits.forEach((bit) => {
      uint256Array[bit] = 1
    })

    uint256Array.reverse()

    const uint256Decimal = this.convertsBinaryBitsToUint256(uint256Array)

    return uint256Decimal
  }

  /**
   * This converts the uint256 to the character operator permission constants array.
   *
   * @category Operator
   * @param permissionUint256 - The uint256.
   * @returns The permission constants array.
   */
  convertUint256ToPermissionsForCharacter(
    permissionUint256: BigNumberish,
  ): CharacterPermissionKey[] {
    const binaryBits = this.convertUint256ToBinaryBits(permissionUint256)

    const permissions = binaryBits
      .reverse()
      .map((bit, index) => {
        if (bit === 1) {
          if (this.isPermissionBitForCharacter(index)) {
            return this.CHARACTER_PERMISSION_BITMAP[index]
          } else {
            console.warn('Found invalid permission bit.', index)
            return
          }
        }
      })
      .filter(Boolean) as CharacterPermissionKey[]

    return permissions
  }

  /**
   * This converts the uint256 to the note operator permission constants array.
   *
   * @category Operator
   * @param permissionUint256 - The uint256.
   * @returns The permission constants array.
   */
  convertUint256ToPermissionsForNote(
    permissionUint256: BigNumberish,
  ): NotePermissionKey[] {
    const binaryBits = this.convertUint256ToBinaryBits(permissionUint256)

    const permissions = binaryBits
      .reverse()
      .map((bit, index) => {
        if (bit === 1) {
          if (this.isPermissionBitForNote(index)) {
            return this.NOTE_PERMISSION_BITMAP[index]
          } else {
            console.warn('Found invalid permission bit.', index)
            return
          }
        }
      })
      .filter(Boolean) as NotePermissionKey[]

    return permissions
  }

  /**
   * This converts binary bits array to a uint256 in decimal.
   *
   * @category Utility
   * @param bits - The binary bits array.
   * @returns The uint256 in decimal.
   */
  private convertsBinaryBitsToUint256(bits: number[]): BigNumber {
    const n = bits
      .join('')
      .replace(/^0+/, '')
      .split('')
      .reverse()
      .reduce((acc, bit, index) => {
        if (bit === '1') {
          return acc.add(BigNumber.from(2).pow(index))
        } else {
          return acc
        }
      }, BigNumber.from(0))

    return n
  }

  /**
   * This converts a uint256 in decimal to binary bits array.
   * @param uint256 - The uint256 in decimal.
   * @returns The binary bits array of length 256.
   */
  private convertUint256ToBinaryBits(uint256: BigNumberish): number[] {
    const bn = BigNumber.from(uint256).toString()
    return new BN(bn, 10)
      .toString(2)
      .padStart(256, '0')
      .split('')
      .map((bit) => parseInt(bit))
  }

  private isPermissionBitForCharacter(
    bit: number,
  ): bit is keyof OperatorContract['CHARACTER_PERMISSION_BITMAP'] {
    return Object.keys(this.CHARACTER_PERMISSION_BITMAP).includes(
      bit.toString(),
    )
  }

  private isPermissionBitForNote(
    bit: number,
  ): bit is keyof OperatorContract['NOTE_PERMISSION_BITMAP'] {
    return Object.keys(this.NOTE_PERMISSION_BITMAP).includes(bit.toString())
  }
}
