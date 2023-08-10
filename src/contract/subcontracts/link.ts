import { type Address, type Hex, stringToHex } from 'viem'
import {
  NIL_ADDRESS,
  parseLog,
  validateAddress,
  waitForTransactionReceiptWithRetry,
} from '../../utils'
import { autoSwitchMainnet } from '../decorators'
import { type Entry, type Linklist, type Periphery } from '../abi'
import {
  type Character,
  type Numberish,
  type ReadOverrides,
  type Result,
  type WriteOverrides,
} from '../../types'
import { type BaseContract } from './base'
import { type CharacterContract } from './character'

export class LinkContract {
  constructor(private base: BaseContract & { character: CharacterContract }) {}

  /**
   * This links a character to another character with a given link type.
   * @category Link
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkCharacter(
    {
      fromCharacterId,
      toCharacterId,
      linkType,
      data,
    }: {
      /** The character ID of the character that is linking to another character. Must be your own character, otherwise it will be rejected. */
      fromCharacterId: Numberish
      /** The character ID of the character you want to link to. */
      toCharacterId: Numberish
      /** The type of link. */
      linkType: string
      /** The data to be passed to the link module if the character has one. */
      data?: Hex
    },
    overrides: WriteOverrides<Entry, 'linkCharacter'> = {},
  ): Promise<Result<bigint, true>> {
    const hash = await this.base.contract.write.linkCharacter(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toCharacterId: BigInt(toCharacterId),
          linkType: stringToHex(linkType, { size: 32 }),
          data: data ?? NIL_ADDRESS,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const parser = parseLog(receipt.logs, 'LinkCharacter')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This links a character to multiple characters with a given link type in batch.
   *
   * This could be considered a bulk version of {@link linkCharacter} & {@link createThenLinkCharacter}
   *
   * @category Link
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkCharactersInBatch(
    {
      fromCharacterId,
      toCharacterIds,
      toAddresses,
      linkType,
      data,
    }: {
      /** The character ID of the character that is linking to another character. Must be your own character, otherwise it will be rejected. */
      fromCharacterId: Numberish
      /** The character IDs of the character you want to link to. */
      toCharacterIds: Numberish[]
      /** The addresses of the characters you want to link to (who don't have a character). See more on {@link createThenLinkCharacter} */
      toAddresses: Address[]
      /** The type of link. */
      linkType: string
      /** The data to be passed to the link module if the character has one. It should has the same length as `toCharacterIds`. */
      data?: Address[]
    },
    overrides: WriteOverrides<Periphery, 'linkCharactersInBatch'> = {},
  ): Promise<Result<bigint, true>> {
    toAddresses.forEach((address) => {
      validateAddress(address)
    })

    const hash = await this.base.peripheryContract.write.linkCharactersInBatch(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toCharacterIds: toCharacterIds.map((id) => BigInt(id)),
          toAddresses,
          linkType: stringToHex(linkType, { size: 32 }),
          data: data ?? toCharacterIds.map(() => NIL_ADDRESS),
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const log = parseLog(receipt.logs, 'LinkCharacter', {
      throwOnMultipleLogsFound: false,
    })

    return {
      data: log.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This gets the linklist id of a {@link linkCharacter} transaction.
   * @category Link
   * @returns The linklist id of the transaction.
   */
  async getLinklistIdByTransaction({
    hash,
  }: {
    /** The transaction hash of the transaction you want to get the linklist id of. */
    hash: Address
  }): Promise<Result<bigint>> {
    const receipt = await this.base.publicClient.getTransactionReceipt({ hash })
    const parser = parseLog(receipt.logs, 'LinkCharacter')

    return {
      data: parser.args.linklistId,
    }
  }

  /**
   * This creates a character for an target address and links the fromCharacter to it.
   *
   * This should be only called when the target address doesn't have any character.
   * When called on an address that already has a character, this will fail.
   * When called, this will create a new character for the target address
   * and set the new character as the primary character for this address.
   * The new character's handle will be set to the address of the target address.
   *
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain, the toCharacterId and linklistId.
   */
  @autoSwitchMainnet()
  async createThenLinkCharacter(
    {
      fromCharacterId,
      toAddress,
      linkType,
    }: {
      /** The character ID of the character that is creating the new character. Must be your own character, otherwise it will be rejected. */
      fromCharacterId: Numberish
      /** The address of the character you want to link to. */
      toAddress: Address
      /** The type of link you want to create. This is a string. */
      linkType: string
    },
    overrides: WriteOverrides<Entry, 'createThenLinkCharacter'> = {},
  ): Promise<Result<{ toCharacterId: bigint; linklistId: bigint }, true>> {
    validateAddress(toAddress)

    const hash = await this.base.contract.write.createThenLinkCharacter(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          to: toAddress,
          linkType: stringToHex(linkType, { size: 32 }),
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const createCharacterParser = parseLog(receipt.logs, 'CharacterCreated')
    const linkCharacterParser = parseLog(receipt.logs, 'LinkCharacter')

    return {
      data: {
        toCharacterId: createCharacterParser.args.characterId,
        linklistId: linkCharacterParser.args.linklistId,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to another character.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkCharacter(
    {
      fromCharacterId,
      toCharacterId,
      linkType,
    }: {
      /** The character ID of the character that is linking to another character. */
      fromCharacterId: Numberish
      /** The character you want to link to. */
      toCharacterId: Numberish
      /** The type of link. */
      linkType: string
    },
    overrides: WriteOverrides<Entry, 'unlinkCharacter'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.unlinkCharacter(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toCharacterId: BigInt(toCharacterId),
          linkType: stringToHex(linkType, { size: 32 }),
        },
      ],
      overrides,
    )
    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the *attached* linked character ID of a character
   * with a given link type or with a given linklist id.
   *
   * @example
   * ```ts
   * // Get the linked character ids of a character
   * const linkedCharacterIds = await contract.link.getLinkingCharacterIds({ linklistId })
   * ```
   *
   * @example
   * ```ts
   * // Get the linked character ids of a character with a given link type
   * const linkedCharacterIds = await contract.link.getLinkingCharacterIds({ fromCharacterId, linkType })
   * ```
   *
   * Note that you can either pass in:
   * - `linklistId`
   * - or `fromCharacterId` and `linkType`
   * as the first argument.
   *
   * @category Link
   * @returns An array of character ids that are linked to the character id passed in.
   */
  async getLinkingCharacterIds(
    {
      linklistId,
    }: {
      /** The linklist ID of the linklist you want to get the linked characters from. */
      linklistId: Numberish
    },
    overrides?: ReadOverrides<Linklist, 'getLinkingCharacterIds'>,
  ): Promise<Result<bigint[]>>
  async getLinkingCharacterIds(
    {
      fromCharacterId,
      linkType,
    }: {
      /** The character ID of the character you want to get the linked characters from. */
      fromCharacterId: Numberish
      /** The type of link you want to get. */
      linkType: string
    },
    overrides?: ReadOverrides<Periphery, 'getLinkingCharacterIds'>,
  ): Promise<Result<bigint[]>>
  async getLinkingCharacterIds(
    {
      linklistId,
      fromCharacterId,
      linkType,
    }:
      | {
          linklistId: never
          fromCharacterId: Numberish
          linkType: string
        }
      | {
          linklistId: Numberish
          fromCharacterId: never
          linkType: never
        },
    overrides:
      | ReadOverrides<Periphery, 'getLinkingCharacterIds'>
      | ReadOverrides<Linklist, 'getLinkingCharacterIds'> = {},
  ): Promise<Result<bigint[]>> {
    if (linklistId) {
      const linklist =
        await this.base.linklistContract.read.getLinkingCharacterIds(
          [BigInt(linklistId)],
          overrides,
        )
      return {
        data: linklist.map((link) => link),
      }
    }

    const linklist =
      await this.base.peripheryContract.read.getLinkingCharacterIds(
        [BigInt(fromCharacterId), stringToHex(linkType, { size: 32 })],
        overrides,
      )
    return {
      data: linklist.map((link) => link),
    }
  }

  /**
   * This returns the *attached* linked character of a character with a given link type.
   * @category Link
   * @returns An array of character that are linked to the character id passed in.
   */
  async getLinkingCharacters(
    {
      fromCharacterId,
      linkType,
    }: {
      /** The character ID of the character you want to get the linked characters from. */
      fromCharacterId: Numberish
      /** The type of link you want to get. */
      linkType: string
    },
    overrides: ReadOverrides<Periphery, 'getLinkingCharacterIds'> = {},
  ): Promise<Result<Character[]>> {
    const ids = await this.base.peripheryContract.read.getLinkingCharacterIds(
      [BigInt(fromCharacterId), stringToHex(linkType, { size: 32 })],
      overrides,
    )
    const characters = await Promise.all(
      ids.map((ids) => this.base.character.get({ characterId: ids })),
    )
    return {
      data: characters.map((character) => character.data),
    }
  }

  /** link address */

  /**
   * This links a character to an address with a given link type.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain, and the linklistId.
   */
  @autoSwitchMainnet()
  async linkAddress(
    {
      fromCharacterId,
      toAddress,
      linkType,
      data = NIL_ADDRESS,
    }: {
      /** The character ID of the character that is linking to the address. */
      fromCharacterId: Numberish
      /** The address of the character you want to link to. */
      toAddress: Address
      /** The type of link. */
      linkType: string
      /** The data to be passed to the link module if the address has one. */
      data: Address
    },
    overrides: WriteOverrides<Entry, 'linkAddress'> = {},
  ): Promise<Result<bigint, true>> {
    const hash = await this.base.contract.write.linkAddress(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          ethAddress: toAddress,
          linkType: stringToHex(linkType, { size: 32 }),
          data,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const parser = parseLog(receipt.logs, 'LinkAddress')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to an address.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkAddress(
    {
      fromCharacterId,
      toAddress,
      linkType,
    }: {
      /** The character ID of the character that is linking to another character. */
      fromCharacterId: Numberish
      /** The address you want to unlink from. */
      toAddress: Address
      /** The type of link. */
      linkType: string
    },
    overrides: WriteOverrides<Entry, 'unlinkAddress'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.unlinkAddress(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          ethAddress: toAddress,
          linkType: stringToHex(linkType, { size: 32 }),
        },
      ],
      overrides,
    )
    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** link any */

  /**
   * This links a character to any uri with a given link type.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain, and the linklistId.
   */
  @autoSwitchMainnet()
  async linkAnyUri(
    {
      fromCharacterId,
      toUri,
      linkType,
      data = NIL_ADDRESS,
    }: {
      /** The character ID of the character that is linking to the address. */
      fromCharacterId: Numberish
      /** The uri of the character you want to link to. */
      toUri: string
      /** The type of link. */
      linkType: string
      /** The data to be passed to the link module if the address has one. */
      data: Address
    },
    overrides: WriteOverrides<Entry, 'linkAnyUri'> = {},
  ): Promise<Result<bigint, true>> {
    const hash = await this.base.contract.write.linkAnyUri(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toUri,
          linkType: stringToHex(linkType, { size: 32 }),
          data,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const parser = parseLog(receipt.logs, 'LinkAnyUri')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to an uri.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkAnyUri(
    {
      fromCharacterId,
      toUri,
      linkType,
    }: {
      /** The character ID of the character that is linking to another character. */
      fromCharacterId: Numberish
      /** The uri you want to unlink from. */
      toUri: string
      /** The type of link. */
      linkType: string
    },
    overrides: WriteOverrides<Entry, 'unlinkAnyUri'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.unlinkAnyUri(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toUri,
          linkType: stringToHex(linkType, { size: 32 }),
        },
      ],
      overrides,
    )
    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** link ERC721 token */

  /**
   * This links a character to any uri with a given link type.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain, and the linklistId.
   */
  @autoSwitchMainnet()
  async linkErc721(
    {
      fromCharacterId,
      toContractAddress,
      toTokenId,
      linkType,
      data = NIL_ADDRESS,
    }: {
      /** The character ID of the character that is linking to the address. */
      fromCharacterId: Numberish
      /** The address of the ERC721 contract. */
      toContractAddress: Address
      /** The token id of the ERC721 token. */
      toTokenId: Numberish
      /** The type of link. */
      linkType: string
      /** The data to be passed to the link module if the address has one. */
      data: Address
    },
    overrides: WriteOverrides<Entry, 'linkERC721'> = {},
  ): Promise<Result<bigint, true>> {
    const hash = await this.base.contract.write.linkERC721(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          tokenAddress: toContractAddress,
          tokenId: BigInt(toTokenId),
          linkType: stringToHex(linkType, { size: 32 }),
          data,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const parser = parseLog(receipt.logs, 'LinkAnyUri')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to an Erc721 token.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkErc721(
    {
      fromCharacterId,
      toContractAddress,
      toTokenId,
      linkType,
    }: {
      /** The character ID of the character that is linking to another character. */
      fromCharacterId: Numberish
      /** The address of the ERC721 contract. */
      toContractAddress: Address
      /** The token id of the ERC721 token. */
      toTokenId: Numberish
      /** The type of link. */
      linkType: string
    },
    overrides: WriteOverrides<Entry, 'unlinkERC721'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.unlinkERC721(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          tokenAddress: toContractAddress,
          tokenId: BigInt(toTokenId),
          linkType: stringToHex(linkType, { size: 32 }),
        },
      ],
      overrides,
    )
    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** link note */

  /**
   * This links a character to another note with a given link type.
   * @category Link
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkNote(
    {
      fromCharacterId,
      toCharacterId,
      toNoteId,
      linkType,
      data,
    }: {
      /** The character ID of the character that is linking to another note. Must be your own character, otherwise it will be rejected. */
      fromCharacterId: Numberish
      /** The character ID of the character you want to link to. */
      toCharacterId: Numberish
      /** The note ID of the note you want to link to. */
      toNoteId: Numberish
      /** The type of link. */
      linkType: string
      /** The data to be passed to the link module if the character has one. */
      data?: Address
    },
    overrides: WriteOverrides<Entry, 'linkNote'> = {},
  ): Promise<Result<bigint, true>> {
    const hash = await this.base.contract.write.linkNote(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toCharacterId: BigInt(toCharacterId),
          toNoteId: BigInt(toNoteId),
          linkType: stringToHex(linkType, { size: 32 }),
          data: data ?? NIL_ADDRESS,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const parser = parseLog(receipt.logs, 'LinkNote')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to another note.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkNote(
    {
      fromCharacterId,
      toCharacterId,
      toNoteId,
      linkType,
    }: {
      /** The character ID of the character that is linking to another note. */
      fromCharacterId: Numberish
      /** The character you want to unlink to. */
      toCharacterId: Numberish
      /** The note ID of the note you want to unlink to. */
      toNoteId: Numberish
      /** The type of link. */
      linkType: string
    },
    overrides: WriteOverrides<Entry, 'unlinkNote'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.unlinkNote(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toCharacterId: BigInt(toCharacterId),
          toNoteId: BigInt(toNoteId),
          linkType: stringToHex(linkType, { size: 32 }),
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** link linklist */

  /**
   * This links a character to a linklist with a given link type.
   * @category Link
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkLinklist(
    {
      fromCharacterId,
      toLinkListId,
      linkType,
      data = NIL_ADDRESS,
    }: {
      /** The character ID of the character that is linking to another note. Must be your own character, otherwise it will be rejected. */
      fromCharacterId: Numberish
      /** The linklist ID of the linklist you want to link to. */
      toLinkListId: Numberish
      /** The type of link. */
      linkType: string
      /** The data to be passed to the link module if the character has one. */
      data: Address
    },
    overrides: WriteOverrides<Entry, 'linkLinklist'> = {},
  ): Promise<Result<bigint, true>> {
    const hash = await this.base.contract.write.linkLinklist(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toLinkListId: BigInt(toLinkListId),
          linkType: stringToHex(linkType, { size: 32 }),
          data,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const parser = parseLog(receipt.logs, 'LinkNote')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to a linklist.
   * @category Link
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkLinklist(
    {
      fromCharacterId,
      toLinklistId,
      linkType,
    }: {
      /** The character ID of the character that is linking to another note. */
      fromCharacterId: Numberish
      /** The linklist ID of the linklist you want to unlink to. */
      toLinklistId: Numberish
      /** The type of link. */
      linkType: string
    },
    overrides: WriteOverrides<Entry, 'unlinkLinklist'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.unlinkLinklist(
      [
        {
          fromCharacterId: BigInt(fromCharacterId),
          toLinkListId: BigInt(toLinklistId),
          linkType: stringToHex(linkType, { size: 32 }),
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  async setLinklistUri(
    { fromCharacterId, uri }: { fromCharacterId: Numberish; uri: string },
    overrides: WriteOverrides<Entry, 'setLinklistUri'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.setLinklistUri(
      [BigInt(fromCharacterId), uri],
      overrides,
    )
    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  async getLinklistUri(
    { fromCharacterId }: { fromCharacterId: string },
    overrides: ReadOverrides<Entry, 'getLinklistUri'> = {},
  ): Promise<Result<string>> {
    const uri = await this.base.contract.read.getLinklistUri(
      [BigInt(fromCharacterId)],
      overrides,
    )
    return {
      data: uri,
    }
  }
}
