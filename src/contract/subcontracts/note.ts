import { ethers } from 'ethers'
import { BaseContract } from './base'
import {
  Result,
  Note,
  NoteMetadata,
  LinkItem,
  LinkItemAnyUri,
  LinkItemERC721,
  PostNoteOptions,
  LinkItemProfile,
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
   * @param profileId - The profile ID of the owner who post this note. Must be your own profile, otherwise it will be rejected.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postNote(
    profileId: string,
    metadataOrUri: NoteMetadata | string,
    { locked = false }: PostNoteOptions = {},
  ): Promise<Result<{ noteId: string }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const tx = await this.contract.postNote({
      profileId: profileId,
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
        noteId: log.args.noteId.toNumber().toString(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for any target uri.
   * @category Note
   * @param profileId - The profile ID of the owner who post this note. Must be your own profile, otherwise it will be rejected.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @param targetUri - The target uri of the note.
   * @param options - Options for the note.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postNoteForAnyUri(
    profileId: string,
    metadataOrUri: NoteMetadata | string,
    targetUri: string,
    { locked = false }: PostNoteOptions = {},
  ): Promise<Result<{ noteId: string }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const tx = await this.contract.postNote4AnyUri(
      {
        profileId: profileId,
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
        noteId: log.args.noteId.toNumber().toString(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets a note's metadata (URI).
   * @category Note
   * @param profileId - The profile ID of the owner who post this note. Must be your own profile, otherwise it will be rejected.
   * @param noteId - The id of the note you want to set the metadata.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async setNoteUri(
    profileId: string,
    noteId: string,
    metadataOrUri: NoteMetadata | string,
  ): Promise<Result<{ uri: string; metadata: NoteMetadata }, true>> | never {
    const { uri, metadata } = await Ipfs.parseMetadataOrUri(
      'note',
      metadataOrUri,
      true,
    )

    const tx = await this.contract.setNoteUri(profileId, noteId, uri)

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
   * @param profileId - The profile ID of the user you want to set the URI for.
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
    profileId: string,
    noteId: string,
    modifier: (metadata?: NoteMetadata) => NoteMetadata,
  ) {
    const note = await this.getNote(profileId, noteId)

    const metadata = modifier(note.data.metadata)
    if (typeof metadata === 'undefined') {
      throw new Error('The modified metadata is undefined. Did you return it?')
    }

    if (!metadata.type) {
      metadata.type = 'note'
    }

    return this.setNoteMetadata(profileId, noteId, metadata)
  }

  /**
   * This is the same as {@link setNoteUri}
   * @category Note
   */
  async setNoteMetadata(
    profileId: string,
    noteId: string,
    metadata: NoteMetadata,
  ) {
    return this.setNoteUri(profileId, noteId, metadata)
  }

  /**
   * This returns the info of a note.
   * @category Note
   * @param profileId - The profile ID of the address who owns the note.
   * @param noteId - The id of the note you want to get the info for.
   * @returns The info of the note.
   */
  async getNote<T = undefined>(
    profileId: string,
    noteId: string,
  ): Promise<Result<Note<undefined>>> | never
  async getNote<T = LinkItemERC721>(
    profileId: string,
    noteId: string,
    linkItemType: 'ERC721',
  ): Promise<Result<Note<LinkItemERC721>>> | never
  async getNote<T = LinkItemAnyUri>(
    profileId: string,
    noteId: string,
    linkItemType: 'AnyUri',
  ): Promise<Result<Note<LinkItemAnyUri>>> | never
  async getNote<T = LinkItemAnyUri>(
    profileId: string,
    noteId: string,
    linkItemType: 'Profile',
  ): Promise<Result<Note<LinkItemProfile>>> | never
  async getNote<T = LinkItemAnyUri>(
    profileId: string,
    noteId: string,
    linkItemType: 'Address',
  ): Promise<Result<Note<LinkItemAddress>>> | never
  async getNote<T = LinkItemAnyUri>(
    profileId: string,
    noteId: string,
    linkItemType: 'Note',
  ): Promise<Result<Note<LinkItemNote>>> | never
  async getNote<T = LinkItemAnyUri>(
    profileId: string,
    noteId: string,
    linkItemType: 'Linklist',
  ): Promise<Result<Note<LinkItemLinklist>>> | never
  @autoSwitchMainnet()
  async getNote<T extends LinkItem>(
    profileId: string,
    noteId: string,
    linkItemType?: Note['linkItemTypeString'],
  ): Promise<Result<Note<T>>> | never {
    const data = await this.contract.getNote(profileId, noteId)

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
    } else if (linkItemType === 'Profile') {
      const profileId = await this.peripheryContract.getLinkingProfileId(
        data.linkKey,
      )
      linkItem = {
        profileId: profileId.toString(),
      } as T
    } else if (linkItemType === 'Note') {
      const noteId = await this.peripheryContract.getLinkingNote(data.linkKey)
      linkItem = {
        noteId: noteId.toString(),
      } as T
    } else if (linkItemType === 'Linklist') {
      const linklistId = await this.peripheryContract.getLinkingLinklistId(
        data.linkKey,
      )
      linkItem = {
        linklistId: linklistId.toString(),
      } as T
    } else {
      linkItem = undefined as unknown as T
    }

    return {
      data: {
        profileId: profileId,
        noteId: noteId,
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
   * @param profileId - The profile ID of the owner who post this note. Must be your own profile, otherwise it will be rejected.
   * @param noteId - The id of the note you want to delete.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async deleteNote(
    profileId: string,
    noteId: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.deleteNote(profileId, noteId)

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
   * @param profileId  - The profile ID of the owner who post this note. Must be your own profile, otherwise it will be rejected.
   * @param noteId - The id of the note you want to lock.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async lockNote(
    profileId: string,
    noteId: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.lockNote(profileId, noteId)

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This mints a note as an NFT.
   * @category Note
   * @param profileId - The profile ID of the address who owns the note.
   * @param noteId - The id of the note you want to get the info for.
   * @param toAddress - The address you want to mint the note to.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async mintNote(
    profileId: string,
    noteId: string,
    toAddress: string,
  ):
    | Promise<Result<{ contractAddress: string; tokenId: string }, true>>
    | never {
    const tx = await this.contract.mintNote({
      profileId: profileId,
      noteId: noteId,
      to: toAddress,
      mintModuleData: NIL_ADDRESS,
    })

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'mintNote')

    return {
      data: {
        contractAddress: log.args.tokenAddress,
        tokenId: log.args.tokenId.toNumber().toString(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  getLinkKeyForProfile(toProfileId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint'],
      ['Profile', toProfileId],
    )
  }

  getLinkKeyForAddress(toAddress: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'address'],
      ['Address', toAddress],
    )
  }

  getLinkKeyForNote(toProfileId: string, toNoteId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint', 'uint'],
      ['Note', toProfileId, toNoteId],
    )
  }

  getLinkKeyForERC721(toContractAddress: string, toTokenId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'address', 'uint'],
      ['ERC721', toContractAddress, toTokenId],
    )
  }

  getLinkKeyForLinklist(toLinkListId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint'],
      ['Linklist', toLinkListId],
    )
  }

  getLinkKeyForAnyUri(toUri: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'string'],
      ['AnyUri', toUri],
    )
  }
}
