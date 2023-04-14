import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import { NIL_ADDRESS, parseLog, validateAddress } from '../../utils'
import type {
  ReadOverrides,
  WriteOverrides,
  Character,
  Result,
} from '../../types/contract'
import { Address, Hex, pad, toHex } from 'viem'
import { Entry, Periphery } from '../abi'
import { CharacterContract } from './character'

export class LinkContract {
  constructor(private base: BaseContract & { character: CharacterContract }) {}

  /**
   * This links a character to another character with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another character. Must be your own character, otherwise it will be rejected.
   * @param toCharacterId - The character ID of the character you want to link to.
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the character has one.
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkCharacter(
    fromCharacterId: bigint,
    toCharacterId: bigint,
    linkType: string,
    data?: Hex,
    overrides: WriteOverrides<Entry, 'linkCharacter'> = {},
  ): Promise<Result<bigint, true>> | never {
    const hash = await this.base.contract.write.linkCharacter(
      [
        {
          fromCharacterId: fromCharacterId,
          toCharacterId: toCharacterId,
          linkType: pad(toHex(linkType), { dir: 'right' }),
          data: data ?? NIL_ADDRESS,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash,
    })

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
   * @param fromCharacterId - The character ID of the character that is linking to another character. Must be your own character, otherwise it will be rejected.
   * @param toCharacterIds - The character IDs of the character you want to link to.
   * @param toAddresses - The addresses of the characters you want to link to (who don't have a character). See more on {@link createThenLinkCharacter}
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the character has one. It should has the same length as `toCharacterIds`.
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkCharactersInBatch(
    fromCharacterId: bigint,
    toCharacterIds: bigint[],
    toAddresses: Address[],
    linkType: string,
    data?: Address[],
    overrides: WriteOverrides<Periphery, 'linkCharactersInBatch'> = {},
  ): Promise<Result<bigint, true>> | never {
    toAddresses.forEach((address) => {
      validateAddress(address)
    })

    const tx = await this.base.peripheryContract.write.linkCharactersInBatch(
      [
        {
          fromCharacterId: fromCharacterId,
          toCharacterIds,
          toAddresses,
          linkType: pad(toHex(linkType), { dir: 'right' }),
          data: data ?? toCharacterIds.map(() => NIL_ADDRESS),
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

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
   * @param hash - The transaction hash of the transaction you want to get the linklist id of.
   * @returns The linklist id of the transaction.
   */
  async getLinklistIdByTransaction(
    hash: Address,
  ): Promise<Result<bigint>> | never {
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
   * @param fromCharacterId - The character ID of the character that is creating the new character. Must be your own character, otherwise it will be rejected.
   * @param toAddress - The address of the character you want to link to.
   * @param linkType - The type of link you want to create. This is a string.
   * @returns The transaction hash of the transaction that was sent to the blockchain, the toCharacterId and linklistId.
   */
  @autoSwitchMainnet()
  async createThenLinkCharacter(
    fromCharacterId: bigint,
    toAddress: Address,
    linkType: string,
    overrides: WriteOverrides<Entry, 'createThenLinkCharacter'> = {},
  ):
    | Promise<Result<{ toCharacterId: bigint; linklistId: bigint }, true>>
    | never {
    validateAddress(toAddress)

    const tx = await this.base.contract.write.createThenLinkCharacter(
      [
        {
          fromCharacterId: fromCharacterId,
          to: toAddress,
          linkType: pad(toHex(linkType), { dir: 'right' }),
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

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
   * @param fromCharacterId - The character ID of the character that is linking to another character.
   * @param toCharacterId - The character you want to link to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkCharacter(
    fromCharacterId: bigint,
    toCharacterId: bigint,
    linkType: string,
    overrides: WriteOverrides<Entry, 'unlinkCharacter'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.unlinkCharacter(
      [
        {
          fromCharacterId: fromCharacterId,
          toCharacterId: toCharacterId,
          linkType: pad(toHex(linkType), { dir: 'right' }),
        },
      ],
      overrides,
    )
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the *attached* linked character ID of a character with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character you want to get the linked characters from.
   * @param linkType - The type of link you want to get.
   * @returns An array of character ids that are linked to the character id passed in.
   */
  async getLinkingCharacterIds(
    fromCharacterId: bigint,
    linkType: string,
    overrides: ReadOverrides<Periphery, 'getLinkingCharacterIds'> = {},
  ): Promise<Result<bigint[]>> | never {
    const linkList =
      await this.base.peripheryContract.read.getLinkingCharacterIds(
        [fromCharacterId, pad(toHex(linkType), { dir: 'right' })],
        overrides,
      )
    return {
      data: linkList.map((link) => link),
    }
  }

  /**
   * This returns the *attached* linked character of a character with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character you want to get the linked characters from.
   * @param linkType - The type of link you want to get.
   * @returns An array of character that are linked to the character id passed in.
   */
  async getLinkingCharacters(
    fromCharacterId: bigint,
    linkType: string,
    overrides: ReadOverrides<Periphery, 'getLinkingCharacterIds'> = {},
  ): Promise<Result<Character[]>> | never {
    const ids = await this.base.peripheryContract.read.getLinkingCharacterIds(
      [fromCharacterId, pad(toHex(linkType), { dir: 'right' })],
      overrides,
    )
    const characters = await Promise.all(
      ids.map((ids) => this.base.character.get(ids)),
    )
    return {
      data: characters.map((character) => character.data),
    }
  }

  /** link address */

  /**
   * This links a character to an address with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to the address.
   * @param toAddress - The address of the character you want to link to.
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the address has one.
   * @returns The transaction hash of the transaction that was sent to the blockchain, and the linklistId.
   */
  @autoSwitchMainnet()
  async linkAddress(
    fromCharacterId: bigint,
    toAddress: Address,
    linkType: string,
    data: Address = NIL_ADDRESS,
    overrides: WriteOverrides<Entry, 'linkAddress'> = {},
  ): Promise<Result<bigint, true>> | never {
    const tx = await this.base.contract.write.linkAddress(
      [
        {
          fromCharacterId,
          ethAddress: toAddress,
          linkType: pad(toHex(linkType), { dir: 'right' }),
          data,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const parser = parseLog(receipt.logs, 'LinkAddress')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to an address.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another character.
   * @param toAddress - The address you want to unlink from.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkAddress(
    fromCharacterId: bigint,
    toAddress: Address,
    linkType: string,
    overrides: WriteOverrides<Entry, 'unlinkAddress'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.unlinkAddress(
      [
        {
          fromCharacterId: fromCharacterId,
          ethAddress: toAddress,
          linkType: pad(toHex(linkType), { dir: 'right' }),
        },
      ],
      overrides,
    )
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** link any */

  /**
   * This links a character to any uri with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to the address.
   * @param toUri - The uri of the character you want to link to.
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the address has one.
   * @returns The transaction hash of the transaction that was sent to the blockchain, and the linklistId.
   */
  @autoSwitchMainnet()
  async linkAnyUri(
    fromCharacterId: bigint,
    toUri: string,
    linkType: string,
    data: Address = NIL_ADDRESS,
    overrides: WriteOverrides<Entry, 'linkAnyUri'> = {},
  ): Promise<Result<bigint, true>> | never {
    const tx = await this.base.contract.write.linkAnyUri(
      [
        {
          fromCharacterId,
          toUri,
          linkType: pad(toHex(linkType), { dir: 'right' }),
          data,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const parser = parseLog(receipt.logs, 'LinkAnyUri')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to an uri.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another character.
   * @param toUri - The uri you want to unlink from.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkAnyUri(
    fromCharacterId: bigint,
    toUri: string,
    linkType: string,
    overrides: WriteOverrides<Entry, 'unlinkAnyUri'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.unlinkAnyUri(
      [
        {
          fromCharacterId,
          toUri,
          linkType: pad(toHex(linkType), { dir: 'right' }),
        },
      ],
      overrides,
    )
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** link ERC721 token */

  /**
   * This links a character to any uri with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to the address.
   * @param toContractAddress - The address of the ERC721 contract.
   * @param toTokenId - The token id of the ERC721 token.
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the address has one.
   * @returns The transaction hash of the transaction that was sent to the blockchain, and the linklistId.
   */
  @autoSwitchMainnet()
  async linkErc721(
    fromCharacterId: bigint,
    toContractAddress: Address,
    toTokenId: bigint,
    linkType: string,
    data: Address = NIL_ADDRESS,
    overrides: WriteOverrides<Entry, 'linkERC721'> = {},
  ): Promise<Result<bigint, true>> | never {
    const tx = await this.base.contract.write.linkERC721(
      [
        {
          fromCharacterId,
          tokenAddress: toContractAddress,
          tokenId: toTokenId,
          linkType: pad(toHex(linkType), { dir: 'right' }),
          data,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const parser = parseLog(receipt.logs, 'LinkAnyUri')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to an Erc721 token.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another character.
   * @param toContractAddress - The address of the ERC721 contract.
   * @param toTokenId - The token id of the ERC721 token.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkErc721(
    fromCharacterId: bigint,
    toContractAddress: Address,
    toTokenId: bigint,
    linkType: string,
    overrides: WriteOverrides<Entry, 'unlinkERC721'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.unlinkERC721(
      [
        {
          fromCharacterId,
          tokenAddress: toContractAddress,
          tokenId: toTokenId,
          linkType: pad(toHex(linkType), { dir: 'right' }),
        },
      ],
      overrides,
    )
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** link note */

  /**
   * This links a character to another note with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another note. Must be your own character, otherwise it will be rejected.
   * @param toCharacterId - The character ID of the character you want to link to.
   * @param toNoteId - The note ID of the note you want to link to.
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the character has one.
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkNote(
    fromCharacterId: bigint,
    toCharacterId: bigint,
    toNoteId: bigint,
    linkType: string,
    data?: Address,
    overrides: WriteOverrides<Entry, 'linkNote'> = {},
  ): Promise<Result<bigint, true>> | never {
    const tx = await this.base.contract.write.linkNote(
      [
        {
          fromCharacterId: fromCharacterId,
          toCharacterId: toCharacterId,
          toNoteId: toNoteId,
          linkType: pad(toHex(linkType), { dir: 'right' }),
          data: data ?? NIL_ADDRESS,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const parser = parseLog(receipt.logs, 'LinkNote')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to another note.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another note.
   * @param toCharacterId - The character you want to unlink to.
   * @param toNoteId - The note ID of the note you want to unlink to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkNote(
    fromCharacterId: bigint,
    toCharacterId: bigint,
    toNoteId: bigint,
    linkType: string,
    overrides: WriteOverrides<Entry, 'unlinkNote'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.unlinkNote(
      [
        {
          fromCharacterId: fromCharacterId,
          toCharacterId: toCharacterId,
          toNoteId: toNoteId,
          linkType: pad(toHex(linkType), { dir: 'right' }),
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** link linklist */

  /**
   * This links a character to a linklist with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another note. Must be your own character, otherwise it will be rejected.
   * @param toLinklistId - The linklist ID of the linklist you want to link to.
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the character has one.
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkLinklist(
    fromCharacterId: bigint,
    toLinkListId: bigint,
    linkType: string,
    data: Address = NIL_ADDRESS,
    overrides: WriteOverrides<Entry, 'linkLinklist'> = {},
  ): Promise<Result<bigint, true>> | never {
    const tx = await this.base.contract.write.linkLinklist(
      [
        {
          fromCharacterId,
          toLinkListId,
          linkType: pad(toHex(linkType), { dir: 'right' }),
          data,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const parser = parseLog(receipt.logs, 'LinkNote')

    return {
      data: parser.args.linklistId,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to a linklist.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another note.
   * @param toLinklistId - The linklist ID of the linklist you want to unlink to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkLinklist(
    fromCharacterId: bigint,
    toLinklistId: bigint,
    linkType: string,
    overrides: WriteOverrides<Entry, 'unlinkLinklist'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.unlinkLinklist(
      [
        {
          fromCharacterId,
          toLinkListId: toLinklistId,
          linkType: pad(toHex(linkType), { dir: 'right' }),
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /** linklist uri */

  // TODO: next version
  // async setLinklistUri(
  //   fromCharacterId: string,
  //   uri: string, // Name: Atlas's follow links
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.base.contract.setLinklistUri(fromCharacterId, uri)
  //   const receipt = await this.base.publicClient.waitForTransactionReceipt({hash:tx})
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  // TODO: next version
  // async getLinklistUri(
  //   fromCharacterId: string,
  //   linkType: string,
  // ): Promise<Result<string>> | never {
  //   const uri = await this.base.contract.getLinklistUri(fromCharacterId, linkType)
  //   return {
  //     data: uri,
  //     transactionHash: undefined,
  //   }
  // }
}
