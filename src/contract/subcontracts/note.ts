import { type BigNumberish, ethers } from 'ethers'
import { BaseContract } from './base'
import {
  Result,
  Note,
  NoteMetadata,
  LinkItem,
  LinkItemAnyUri,
  LinkItemERC721,
  PostNoteOptions,
  LinkItemCharacter,
  LinkItemAddress,
  LinkItemNote,
  LinkItemLinklist,
} from '../../types'
import { Ipfs } from '../../ipfs'
import { NIL_ADDRESS } from '../utils'
import { autoSwitchMainnet } from '../decorators'

export class NoteContract extends BaseContract {
  /**
   * This creates a new note.
   * @category Note
   * @param characterId - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postNote(
    characterId: BigNumberish,
    metadataOrUri: NoteMetadata | string,
    { locked = false }: PostNoteOptions = {},
  ): Promise<Result<{ noteId: number }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const tx = await this.contract.postNote({
      characterId: characterId,
      contentUri: uri,
      linkModule: NIL_ADDRESS, // TODO:
      linkModuleInitData: NIL_ADDRESS,
      mintModule: NIL_ADDRESS,
      mintModuleInitData: NIL_ADDRESS,
      locked: locked,
    })

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'postNote')

    return {
      data: {
        noteId: log.args.noteId.toNumber(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for any target uri.
   * @category Note
   * @param characterId - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @param targetUri - The target uri of the note.
   * @param options - Options for the note.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postNoteForAnyUri(
    characterId: BigNumberish,
    metadataOrUri: NoteMetadata | string,
    targetUri: string,
    { locked = false }: PostNoteOptions = {},
  ): Promise<Result<{ noteId: number }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const tx = await this.contract.postNote4AnyUri(
      {
        characterId: characterId,
        contentUri: uri,
        linkModule: NIL_ADDRESS, // TODO:
        linkModuleInitData: NIL_ADDRESS,
        mintModule: NIL_ADDRESS,
        mintModuleInitData: NIL_ADDRESS,
        locked: locked,
      },
      targetUri,
    )

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'postNote')

    return {
      data: {
        noteId: log.args.noteId.toNumber(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for a note.
   * @category Note
   * @param characterId - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @param targetUri - The target uri of the note.
   * @param options - Options for the note.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postNoteForNote(
    characterId: BigNumberish,
    metadataOrUri: NoteMetadata | string,
    targetCharacterId: BigNumberish,
    targetNoteId: BigNumberish,
    { locked = false }: PostNoteOptions = {},
  ): Promise<Result<{ noteId: number }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const tx = await this.contract.postNote4Note(
      {
        characterId: characterId,
        contentUri: uri,
        linkModule: NIL_ADDRESS, // TODO:
        linkModuleInitData: NIL_ADDRESS,
        mintModule: NIL_ADDRESS,
        mintModuleInitData: NIL_ADDRESS,
        locked: locked,
      },
      {
        characterId: targetCharacterId,
        noteId: targetNoteId,
      },
    )

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'postNote')

    return {
      data: {
        noteId: log.args.noteId.toNumber(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets a note's metadata (URI).
   * @category Note
   * @param characterId - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param noteId - The id of the note you want to set the metadata.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async setNoteUri(
    characterId: BigNumberish,
    noteId: BigNumberish,
    metadataOrUri: NoteMetadata | string,
  ): Promise<Result<{ uri: string; metadata: NoteMetadata }, true>> | never {
    const { uri, metadata } = await Ipfs.parseMetadataOrUri(
      'note',
      metadataOrUri,
      true,
    )

    const tx = await this.contract.setNoteUri(characterId, noteId, uri)

    const receipt = await tx.wait()

    return {
      data: {
        uri,
        metadata,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This changes a note's metadata (URI).
   * @category Note
   * @param characterId - The character ID of the user you want to set the URI for.
   * @param noteId - The id of the note you want to set the URI for.
   * @param modifier - The callback function that modifies the metadata.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   * @example change a note's metadata name and content
   *
   * ```js
   * await contract.changeNoteMetadata('42', '2', metadata => {
   *   if (metadata !== undefined) {
   *     metadata.title = 'Note Title'
   *     metadata.content = 'Hello, world'
   *   } else {
   *     metadata = {
   *       title: 'Note Title',
   *       content: 'Hello, world',
   *     }
   *   }
   *   return metadata
   * })
   * ```
   *
   * @example change a note's metadata title and content (using spread operator)
   *
   * ```js
   * await contract.changeNoteMetadata('42', '2', metadata => {
   *   metadata = {
   *     ...metadata,
   *     title: 'Note Title',
   *     content: 'Hello, world',
   *   }
   *   return metadata
   * })
   * ```
   */
  @autoSwitchMainnet()
  async changeNoteMetadata(
    characterId: BigNumberish,
    noteId: BigNumberish,
    modifier: (metadata?: NoteMetadata) => NoteMetadata,
  ) {
    const note = await this.getNote(characterId, noteId)

    const metadata = modifier(note.data.metadata)
    if (typeof metadata === 'undefined') {
      throw new Error('The modified metadata is undefined. Did you return it?')
    }

    if (!metadata.type) {
      metadata.type = 'note'
    }

    return this.setNoteMetadata(characterId, noteId, metadata)
  }

  /**
   * This is the same as {@link setNoteUri}
   * @category Note
   */
  async setNoteMetadata(
    characterId: BigNumberish,
    noteId: BigNumberish,
    metadata: NoteMetadata,
  ) {
    return this.setNoteUri(characterId, noteId, metadata)
  }

  /**
   * This returns the info of a note.
   * @category Note
   * @param characterId - The character ID of the address who owns the note.
   * @param noteId - The id of the note you want to get the info for.
   * @returns The info of the note.
   */
  async getNote<T = undefined>(
    characterId: BigNumberish,
    noteId: BigNumberish,
  ): Promise<Result<Note<undefined>>> | never
  async getNote<T = LinkItemERC721>(
    characterId: string,
    noteId: string,
    linkItemType: 'ERC721',
  ): Promise<Result<Note<LinkItemERC721>>> | never
  async getNote<T = LinkItemAnyUri>(
    characterId: string,
    noteId: string,
    linkItemType: 'AnyUri',
  ): Promise<Result<Note<LinkItemAnyUri>>> | never
  async getNote<T = LinkItemCharacter>(
    characterId: string,
    noteId: string,
    linkItemType: 'Character',
  ): Promise<Result<Note<LinkItemCharacter>>> | never
  async getNote<T = LinkItemAddress>(
    characterId: string,
    noteId: string,
    linkItemType: 'Address',
  ): Promise<Result<Note<LinkItemAddress>>> | never
  async getNote<T = LinkItemNote>(
    characterId: string,
    noteId: string,
    linkItemType: 'Note',
  ): Promise<Result<Note<LinkItemNote>>> | never
  async getNote<T = LinkItemLinklist>(
    characterId: string,
    noteId: string,
    linkItemType: 'Linklist',
  ): Promise<Result<Note<LinkItemLinklist>>> | never
  @autoSwitchMainnet()
  async getNote<T extends LinkItem>(
    characterId: BigNumberish,
    noteId: BigNumberish,
    linkItemType?: Note['linkItemTypeString'],
  ): Promise<Result<Note<T>>> | never {
    const data = await this.contract.getNote(characterId, noteId)

    const _linkItemType = ethers.utils.parseBytes32String(data.linkItemType)
    const linkItemTypeString =
      _linkItemType === ''
        ? undefined
        : (_linkItemType as Note['linkItemTypeString'])

    const metadata = data.contentUri
      ? await Ipfs.uriToMetadata<NoteMetadata>(data.contentUri)
      : undefined

    let linkItem: T
    if (linkItemType === 'AnyUri') {
      const uri = await this.peripheryContract.getLinkingAnyUri(data.linkKey)
      linkItem = {
        uri: uri,
      } as T
    } else if (linkItemType === 'ERC721') {
      const erc721 = await this.peripheryContract.getLinkingERC721(data.linkKey)
      linkItem = {
        contractAddress: erc721.tokenAddress.toString(),
        tokenId: erc721.erc721TokenId.toString(),
      } as T
    } else if (linkItemType === 'Address') {
      const address = await this.peripheryContract.getLinkingAddress(
        data.linkKey,
      )
      linkItem = {
        address: address.toString(),
      } as T
    } else if (linkItemType === 'Character') {
      const characterId = await this.peripheryContract.getLinkingCharacterId(
        data.linkKey,
      )
      linkItem = {
        characterId: characterId.toNumber(),
      } as T
    } else if (linkItemType === 'Note') {
      const ret = await this.peripheryContract.getLinkingNote(data.linkKey)
      linkItem = {
        characterId: ret.characterId.toNumber(),
        noteId: ret.noteId.toNumber(),
      } as T
    } else if (linkItemType === 'Linklist') {
      const linklistId = await this.peripheryContract.getLinkingLinklistId(
        data.linkKey,
      )
      linkItem = {
        linklistId: linklistId.toNumber(),
      } as T
    } else {
      linkItem = undefined as unknown as T
    }

    return {
      data: {
        characterId: Number(characterId),
        noteId: Number(noteId),
        contentUri: data.contentUri,
        metadata,
        linkItemType: data.linkItemType,
        linkItemTypeString: linkItemTypeString,
        linkItem,
        linkKey: data.linkKey,
        linkModule: data.linkModule,
        contractAddress: data.mintNFT,
        mintModule: data.mintModule,
        deleted: data.deleted,
        locked: data.locked,
      },
    }
  }

  /**
   * This deletes a note.
   *
   * Note: This only changes the note's `deleted` property to `true`. It can't really be deleted from the blockchain.
   *
   * @category Note
   * @param characterId - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param noteId - The id of the note you want to delete.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async deleteNote(
    characterId: BigNumberish,
    noteId: BigNumberish,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.deleteNote(characterId, noteId)

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This locks a note.
   *
   * When a note is locked, it can't be edited and unlocked anymore.
   * I.e., you can't change the content of the note using {@link setNoteUri} {@link setNoteMetadata} {@link changeNoteMetadata}.
   *
   * You can still delete the note using {@link deleteNote}.
   *
   * @category Note
   * @param characterId  - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param noteId - The id of the note you want to lock.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async lockNote(
    characterId: BigNumberish,
    noteId: BigNumberish,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.lockNote(characterId, noteId)

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This mints a note as an NFT.
   * @category Note
   * @param characterId - The character ID of the address who owns the note.
   * @param noteId - The id of the note you want to get the info for.
   * @param toAddress - The address you want to mint the note to.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async mintNote(
    characterId: BigNumberish,
    noteId: BigNumberish,
    toAddress: string,
  ):
    | Promise<Result<{ contractAddress: string; tokenId: number }, true>>
    | never {
    const tx = await this.contract.mintNote({
      characterId: characterId,
      noteId: noteId,
      to: toAddress,
      mintModuleData: NIL_ADDRESS,
    })

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'mintNote')

    return {
      data: {
        contractAddress: log.args.tokenAddress,
        tokenId: log.args.tokenId.toNumber(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the linkKey of a note linked to a character.
   * @category Note
   * @param toCharacterId - The character ID of the character you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForCharacter(toCharacterId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint'],
      ['Character', toCharacterId],
    )
  }

  /**
   * This returns the linkKey of a note linked to a note.
   * @category Note
   * @param toAddress - The address you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForAddress(toAddress: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'address'],
      ['Address', toAddress],
    )
  }

  /**
   * This returns the linkKey of a note linked to a note.
   * @category Note
   * @param toCharacterId - The character ID of the character you want to get the linkKey of.
   * @param toNoteId - The id of the note you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForNote(toCharacterId: string, toNoteId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint', 'uint'],
      ['Note', toCharacterId, toNoteId],
    )
  }

  /**
   * This returns the linkKey of a note linked to an ERC721 token.
   * @category Note
   * @param toContractAddress - The address of the ERC721 token you want to get the linkKey of.
   * @param toTokenId - The id of the ERC721 token you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForERC721(toContractAddress: string, toTokenId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'address', 'uint'],
      ['ERC721', toContractAddress, toTokenId],
    )
  }

  /**
   * This returns the linkKey of a note linked to a linklist.
   * @category Note
   * @param toLinkListId - The id of the linklist you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForLinklist(toLinkListId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint'],
      ['Linklist', toLinkListId],
    )
  }

  /**
   * This returns the linkKey of a note linked to an any uri.
   * @category Note
   * @param toUri - The uri you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForAnyUri(toUri: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'string'],
      ['AnyUri', toUri],
    )
  }
}
