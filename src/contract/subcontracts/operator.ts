import { type Address } from 'viem'
import { autoSwitchMainnet } from '../decorators'
import {
  type CharacterPermissionKey,
  type Numberish,
  type ReadOverrides,
  type Result,
  type WriteOverrides,
} from '../../types'
import {
  parseLog,
  validateAddress,
  waitForTransactionReceiptWithRetry,
} from '../../utils'
import { warn } from '../../utils/logger'
import { type Entry } from '../abi'
import { type BaseContract } from './base'

// https://github.com/Crossbell-Box/CIPs/blob/main/CIPs/CIP-7.md

export class OperatorContract {
  constructor(private base: BaseContract) {}

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
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async grantForCharacter(
    {
      characterId,
      operator,
      permissions,
    }: {
      /** The id of the character. */
      characterId: Numberish
      /** The address of the operator. */
      operator: Address
      /** The permissions of the operator. */
      permissions: CharacterPermissionKey[]
    },
    overrides: WriteOverrides<Entry, 'grantOperatorPermissions'> = {},
  ): Promise<Result<{ bitmapUint256: bigint }, true>> {
    validateAddress(operator)

    const permissionUint256 =
      this.convertPermissionsToUint256ForCharacter(permissions)

    const hash = await this.base.contract.write.grantOperatorPermissions(
      [BigInt(characterId), operator, permissionUint256],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const log = parseLog(receipt.logs, 'GrantOperatorPermissions')

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
   * Each time an operator is granted permissions, its previous operators are overwritten.
   *
   * To completely remove an operator, pass an empty array (`[]`) to the `permissions` parameter.
   *
   * @category Operator
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async grantForNote(
    {
      characterId,
      noteId,
      allowlist,
      blocklist = [],
    }: {
      /** The id of the character. */
      characterId: Numberish
      /** The id of the note. */
      noteId: Numberish
      /** Operators that are allowed to operate the note. */
      allowlist: Address[]
      /**
       * Operators that are not allowed to operate the note.
       * (Used to override the character permission and allowlist.)
       */
      blocklist: Address[]
    },
    overrides: WriteOverrides<Entry, 'grantOperators4Note'> = {},
  ): Promise<Result<{}, true>> {
    validateAddress(allowlist)
    validateAddress(blocklist)

    const hash = await this.base.contract.write.grantOperators4Note(
      [BigInt(characterId), BigInt(noteId), blocklist, allowlist],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    // const log = parseLog(receipt.logs, 'grantOperators4Note')

    return {
      data: {},
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns operators of the character.
   *
   * @category Operator
   * @returns The operators of the character.
   */
  async getForCharacter(
    {
      characterId,
    }: {
      /** The id of the character. */
      characterId: Numberish
    },
    overrides: ReadOverrides<Entry, 'getOperators'> = {},
  ): Promise<Result<readonly Address[], false>> {
    const operators = await this.base.contract.read.getOperators(
      [BigInt(characterId)],
      overrides,
    )
    return {
      data: operators,
    }
  }

  /**
   * This returns operators of the note.
   *
   * @category Operator
   */
  async getForNote(
    {
      characterId,
      noteId,
    }: {
      /** The id of the character. */
      characterId: Numberish
      /** The id of the note. */
      noteId: Numberish
    },
    overrides: ReadOverrides<Entry, 'getOperators4Note'> = {},
  ): Promise<
    Result<
      { allowlist: readonly Address[]; blocklist: readonly Address[] },
      false
    >
  > {
    const [allowlist, blocklist] =
      await this.base.contract.read.getOperators4Note(
        [BigInt(characterId), BigInt(noteId)],
        overrides,
      )
    return {
      data: {
        allowlist,
        blocklist,
      },
    }
  }

  /**
   * This checks if an operator is allowed to operate a note.
   *
   * @category Operator
   * @returns Whether the operator is allowed to operate the note.
   */
  async isAllowedForNote(
    {
      characterId,
      noteId,
      operator,
    }: {
      /** The id of the character. */
      characterId: Numberish
      /** The id of the note. */
      noteId: Numberish
      /** The address of the operator. */
      operator: Address
    },
    overrides: ReadOverrides<Entry, 'isOperatorAllowedForNote'> = {},
  ): Promise<Result<boolean, false>> {
    const isAllowed = await this.base.contract.read.isOperatorAllowedForNote(
      [BigInt(characterId), BigInt(noteId), operator],
      overrides,
    )
    return {
      data: isAllowed,
    }
  }

  /**
   * This returns the permissions of an operator for a character.
   *
   * @category Operator
   * @returns The permissions of the operator.
   */
  async getPermissionsForCharacter(
    {
      characterId,
      operator,
    }: {
      /** The id of the character. */
      characterId: Numberish
      /** The address of the operator. */
      operator: Address
    },
    overrides: ReadOverrides<Entry, 'getOperatorPermissions'> = {},
  ): Promise<Result<CharacterPermissionKey[], false>> {
    const permissionUint256 =
      await this.base.contract.read.getOperatorPermissions(
        [BigInt(characterId), operator],
        overrides,
      )

    const permissions =
      this.convertUint256ToPermissionsForCharacter(permissionUint256)

    return {
      data: permissions,
    }
  }

  /**
   * This converts the character operator permission constants array to a uint256.
   *
   * @category Operator
   * @returns The uint256.
   */
  convertPermissionsToUint256ForCharacter(
    permissions: CharacterPermissionKey[],
  ): bigint {
    const bits = permissions.map((permission) => {
      const bit = Object.entries(CHARACTER_PERMISSION_BITMAP).find(
        ([, value]) => value === permission,
      )![0]
      return Number.parseInt(bit)
    })

    const uint256Array = Array.from<number>({ length: 256 }).fill(0)

    bits.forEach((bit) => {
      uint256Array[bit] = 1
    })

    uint256Array.reverse()

    const uint256Decimal = this.#convertBinaryBitsToUint256(uint256Array)

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
    permissionUint256: bigint,
  ): CharacterPermissionKey[] {
    const binaryBits = this.#convertUint256ToBinaryBits(permissionUint256)

    const permissions = binaryBits
      .reverse()
      .map((bit, index) => {
        if (bit === 1) {
          if (this.#isPermissionBitForCharacter(index)) {
            return CHARACTER_PERMISSION_BITMAP[index]
          } else {
            warn('Found invalid permission bit.', index)
          }
        }
        return undefined
      })
      .filter(Boolean) as CharacterPermissionKey[]

    return permissions
  }

  /**
   * This converts binary bits array to a uint256 in decimal.
   *
   * @category Operator
   * @param bits - The binary bits array.
   * @returns The uint256 in decimal.
   */
  #convertBinaryBitsToUint256(bits: number[]): bigint {
    const n = bits
      .join('')
      .replace(/^0+/, '')
      .split('')
      .reverse()
      .reduce((acc, bit, index) => {
        if (bit === '1') {
          return acc + 2n ** BigInt(index)
        } else {
          return acc
        }
      }, 0n)

    return n
  }

  /**
   * This converts a uint256 in decimal to binary bits array.
   *
   * @category Operator
   * @param uint256 - The uint256 in decimal.
   * @returns The binary bits array of length 256.
   */
  #convertUint256ToBinaryBits(uint256: bigint) {
    return uint256
      .toString(2)
      .padStart(256, '0')
      .split('')
      .map((bit) => Number.parseInt(bit) as 0 | 1)
  }

  /**
   * This checks if the permission bit is for character.
   *
   * @category Operator
   * @param bit - The permission bit.
   * @returns true if the permission bit is for character; otherwise, false.
   */
  #isPermissionBitForCharacter(
    bit: number,
  ): bit is keyof typeof CHARACTER_PERMISSION_BITMAP {
    return Object.keys(CHARACTER_PERMISSION_BITMAP).includes(bit.toString())
  }
}

const CHARACTER_PERMISSION_BITMAP = {
  0: 'SET_HANDLE',
  1: 'SET_SOCIAL_TOKEN',
  2: 'GRANT_OPERATOR_PERMISSIONS',
  3: 'GRANT_OPERATORS_FOR_NOTE',
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
  187: 'LINK_ANY_URI',
  188: 'UNLINK_ANY_URI',
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
  203: 'POST_NOTE_FOR_ANY_URI',
  236: 'POST_NOTE',
} as const
