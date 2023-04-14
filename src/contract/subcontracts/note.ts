import { encodeFunctionData, encodePacked, fromHex, keccak256 } from 'viem'
import { BaseContract } from './base'
import {
  Result,
  Note,
  NoteMetadata,
  PostNoteOptions,
  ReadOverrides,
  WriteOverrides,
  LinkItemType,
  LinkItemMap,
} from '../../types'
import { Ipfs } from '../../ipfs'
import {
  NIL_ADDRESS,
  getModuleConfig,
  parseLog,
  validateAddress,
} from '../../utils'
import { autoSwitchMainnet } from '../decorators'
import pLimit from 'p-limit'
import { Address } from 'abitype'
import { Abi } from '../..'
import { Entry } from '../abi'

export class NoteContract {
  constructor(private base: BaseContract) {}

  /**
   * This creates a new note.
   * @category Note
   * @param characterId - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @param options - The options for this post.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async post(
    characterId: bigint,
    metadataOrUri: NoteMetadata | string,
    { locked = false, linkModule, mintModule }: PostNoteOptions = {},
    overrides: WriteOverrides<Entry, 'postNote'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const linkModuleConfig = await getModuleConfig(linkModule)
    const mintModuleConfig = await getModuleConfig(mintModule)

    const tx = await this.base.contract.write.postNote(
      [
        {
          characterId: characterId,
          contentUri: uri,
          linkModule: linkModuleConfig.address,
          linkModuleInitData: linkModuleConfig.initData,
          mintModule: mintModuleConfig.address,
          mintModuleInitData: mintModuleConfig.initData,
          locked: locked,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const log = parseLog(receipt.logs, 'PostNote')

    return {
      data: {
        noteId: log.args.noteId,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates multiple new notes.
   * @category Note
   * @param notes - The notes you want to post.
   * @param notes[].characterId - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param notes[].metadataOrUri - The metadata or URI of the content you want to post.
   * @param notes[].options - The options of the note.
   * @param notes[].options.locked - Whether the note is locked.
   * @param notes[].options.linkModule - The link module of the note.
   * @param notes[].options.mintModule - The mint module of the note.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postMulti(
    notes: {
      characterId: bigint
      metadataOrUri: NoteMetadata | string
      options?: PostNoteOptions
    }[],
    overrides: WriteOverrides<Entry, 'multicall'> = {},
  ): Promise<Result<{ noteIds: bigint[] }, true>> | never {
    const limitedPromise = pLimit(10)
    const encodedDataArr = await Promise.all(
      notes.map((note) => {
        return limitedPromise(async () => {
          const { uri } = await Ipfs.parseMetadataOrUri(
            'note',
            note.metadataOrUri,
          )
          const linkModuleConfig = await getModuleConfig(
            note.options?.linkModule,
          )
          const mintModuleConfig = await getModuleConfig(
            note.options?.mintModule,
          )

          return encodeFunctionData({
            abi: Abi.entry,
            functionName: 'postNote',
            args: [
              {
                characterId: note.characterId,
                contentUri: uri,
                linkModule: linkModuleConfig.address,
                linkModuleInitData: linkModuleConfig.initData,
                mintModule: mintModuleConfig.address,
                mintModuleInitData: mintModuleConfig.initData,
                locked: note.options?.locked ?? false,
              },
            ],
          })
        })
      }),
    )

    const tx = await this.base.contract.write.multicall(
      [encodedDataArr],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const logs = parseLog(receipt.logs, 'PostNote', {
      throwOnMultipleLogsFound: false,
      returnMultipleLogs: true,
    })

    const noteIds = logs.map((log) => log.args.noteId)

    return {
      data: {
        noteIds: noteIds,
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
  async postForAnyUri(
    characterId: bigint,
    metadataOrUri: NoteMetadata | string,
    targetUri: string,
    { locked = false, linkModule, mintModule }: PostNoteOptions = {},
    overrides: WriteOverrides<Entry, 'postNote4AnyUri'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const linkModuleConfig = await getModuleConfig(linkModule)
    const mintModuleConfig = await getModuleConfig(mintModule)

    const tx = await this.base.contract.write.postNote4AnyUri(
      [
        {
          characterId: characterId,
          contentUri: uri,
          linkModule: linkModuleConfig.address,
          linkModuleInitData: linkModuleConfig.initData,
          mintModule: mintModuleConfig.address,
          mintModuleInitData: mintModuleConfig.initData,
          locked: locked,
        },
        targetUri,
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const log = parseLog(receipt.logs, 'PostNote')

    return {
      data: {
        noteId: log.args.noteId,
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
  async postForNote(
    characterId: bigint,
    metadataOrUri: NoteMetadata | string,
    targetCharacterId: bigint,
    targetNoteId: bigint,
    { locked = false, linkModule, mintModule }: PostNoteOptions = {},
    overrides: WriteOverrides<Entry, 'postNote4Note'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const linkModuleConfig = await getModuleConfig(linkModule)
    const mintModuleConfig = await getModuleConfig(mintModule)

    const tx = await this.base.contract.write.postNote4Note(
      [
        {
          characterId: characterId,
          contentUri: uri,
          linkModule: linkModuleConfig.address,
          linkModuleInitData: linkModuleConfig.initData,
          mintModule: mintModuleConfig.address,
          mintModuleInitData: mintModuleConfig.initData,
          locked: locked,
        },
        {
          characterId: targetCharacterId,
          noteId: targetNoteId,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const log = parseLog(receipt.logs, 'PostNote')

    return {
      data: {
        noteId: log.args.noteId,
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
  async setUri(
    characterId: bigint,
    noteId: bigint,
    metadataOrUri: NoteMetadata | string,
    overrides: WriteOverrides<Entry, 'setNoteUri'> = {},
  ): Promise<Result<{ uri: string; metadata: NoteMetadata }, true>> | never {
    const { uri, metadata } = await Ipfs.parseMetadataOrUri(
      'note',
      metadataOrUri,
      true,
    )

    const tx = await this.base.contract.write.setNoteUri(
      [characterId, noteId, uri],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

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
  async changeMetadata(
    characterId: bigint,
    noteId: bigint,
    modifier: (metadata?: NoteMetadata) => NoteMetadata,
    overrides: WriteOverrides<Entry, 'setNoteUri'> = {},
  ) {
    const note = await this.get(characterId, noteId)

    const metadata = modifier(note.data.metadata)
    if (typeof metadata === 'undefined') {
      throw new Error('The modified metadata is undefined. Did you return it?')
    }

    if (!metadata.type) {
      metadata.type = 'note'
    }

    return this.setMetadata(characterId, noteId, metadata, overrides)
  }

  /**
   * This is the same as {@link setUri}
   * @category Note
   */
  async setMetadata(
    characterId: bigint,
    noteId: bigint,
    metadata: NoteMetadata,
    overrides: WriteOverrides<Entry, 'setNoteUri'> = {},
  ) {
    return this.setUri(characterId, noteId, metadata, overrides)
  }

  /**
   * This returns the info of a note.
   * @category Note
   * @param characterId - The character ID of the address who owns the note.
   * @param noteId - The id of the note you want to get the info for.
   * @returns The info of the note.
   */
  async get<T extends LinkItemType>(
    characterId: bigint,
    noteId: bigint,
    linkItemType?: T,
    overrides: ReadOverrides<Entry, 'getNote'> = {},
  ): Promise<Result<Note<LinkItemMap[T]>>> | never {
    const data = await this.base.contract.read.getNote(
      [characterId, noteId],
      overrides,
    )

    const linkItemTypeString: LinkItemType | undefined =
      (fromHex(data.linkItemType, 'string') as LinkItemType) || undefined
    const metadata = data.contentUri
      ? await Ipfs.uriToMetadata<NoteMetadata>(data.contentUri)
      : undefined

    let linkItem: LinkItemMap[T]
    const pc = this.base.peripheryContract.read
    if (linkItemType === 'AnyUri') {
      const uri = await pc.getLinkingAnyUri([data.linkKey])
      linkItem = { uri: uri } satisfies LinkItemMap['AnyUri'] as LinkItemMap[T]
    } else if (linkItemType === 'ERC721') {
      const erc721 = await pc.getLinkingERC721([data.linkKey])
      linkItem = {
        contractAddress: erc721.tokenAddress,
        tokenId: erc721.erc721TokenId.toString(),
      } satisfies LinkItemMap['ERC721'] as LinkItemMap[T]
    } else if (linkItemType === 'Address') {
      const address = await pc.getLinkingAddress([data.linkKey])
      linkItem = {
        address: address,
      } satisfies LinkItemMap['Address'] as LinkItemMap[T]
    } else if (linkItemType === 'Character') {
      const characterId = await pc.getLinkingCharacterId([data.linkKey])
      linkItem = {
        characterId: characterId,
      } satisfies LinkItemMap['Character'] as LinkItemMap[T]
    } else if (linkItemType === 'Note') {
      const ret = await pc.getLinkingNote([data.linkKey])
      linkItem = {
        characterId: ret.characterId,
        noteId: ret.noteId,
      } satisfies LinkItemMap['Note'] as LinkItemMap[T]
    } else if (linkItemType === 'Linklist') {
      const linklistId = await pc.getLinkingLinklistId([data.linkKey])
      linkItem = {
        linklistId: linklistId,
      } satisfies LinkItemMap['Linklist'] as LinkItemMap[T]
    } else {
      linkItem = undefined as unknown as LinkItemMap[T]
    }

    return {
      data: {
        characterId: characterId,
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
   * @param characterId - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param noteId - The id of the note you want to delete.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async delete(
    characterId: bigint,
    noteId: bigint,
    overrides: WriteOverrides<Entry, 'deleteNote'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.deleteNote(
      [characterId, noteId],
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
   * This locks a note.
   *
   * When a note is locked, it can't be edited and unlocked anymore.
   * I.e., you can't change the content of the note using {@link setUri} {@link setMetadata} {@link changeMetadata}.
   *
   * You can still delete the note using {@link delete}.
   *
   * @category Note
   * @param characterId  - The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected.
   * @param noteId - The id of the note you want to lock.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async lock(
    characterId: bigint,
    noteId: bigint,
    overrides: WriteOverrides<Entry, 'lockNote'> = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.lockNote(
      [characterId, noteId],
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
   * This mints a note as an NFT.
   * @category Note
   * @param characterId - The character ID of the address who owns the note.
   * @param noteId - The id of the note you want to get the info for.
   * @param toAddress - The address you want to mint the note to.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async mint(
    characterId: bigint,
    noteId: bigint,
    toAddress: Address,
    overrides: WriteOverrides<Entry, 'mintNote'> = {},
  ):
    | Promise<Result<{ contractAddress: Address; tokenId: bigint }, true>>
    | never {
    validateAddress(toAddress)

    const tx = await this.base.contract.write.mintNote(
      [
        {
          characterId: characterId,
          noteId: noteId,
          to: toAddress,
          mintModuleData: NIL_ADDRESS,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    const log = parseLog(receipt.logs, 'MintNote')

    return {
      data: {
        contractAddress: log.args.tokenAddress,
        tokenId: log.args.tokenId,
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
  getLinkKeyForCharacter(toCharacterId: bigint): string {
    return keccak256(
      encodePacked(['string', 'uint'], ['Character', toCharacterId]),
    )
  }

  /**
   * This returns the linkKey of a note linked to a note.
   * @category Note
   * @param toAddress - The address you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForAddress(toAddress: Address): string {
    validateAddress(toAddress)

    return keccak256(
      encodePacked(['string', 'address'], ['Address', toAddress]),
    )
  }

  /**
   * This returns the linkKey of a note linked to a note.
   * @category Note
   * @param toCharacterId - The character ID of the character you want to get the linkKey of.
   * @param toNoteId - The id of the note you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForNote(toCharacterId: bigint, toNoteId: bigint): string {
    return keccak256(
      encodePacked(
        ['string', 'uint', 'uint'],
        ['Note', toCharacterId, toNoteId],
      ),
    )
  }

  /**
   * This returns the linkKey of a note linked to an ERC721 token.
   * @category Note
   * @param toContractAddress - The address of the ERC721 token you want to get the linkKey of.
   * @param toTokenId - The id of the ERC721 token you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForERC721(toContractAddress: Address, toTokenId: bigint): string {
    return keccak256(
      encodePacked(
        ['string', 'address', 'uint'],
        ['ERC721', toContractAddress, toTokenId],
      ),
    )
  }

  /**
   * This returns the linkKey of a note linked to a linklist.
   * @category Note
   * @param toLinkListId - The id of the linklist you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForLinklist(toLinkListId: bigint): string {
    return keccak256(
      encodePacked(['string', 'uint'], ['Linklist', toLinkListId]),
    )
  }

  /**
   * This returns the linkKey of a note linked to an any uri.
   * @category Note
   * @param toUri - The uri you want to get the linkKey of.
   * @returns The linkKey of the note.
   */
  getLinkKeyForAnyUri(toUri: string): string {
    return keccak256(encodePacked(['string', 'string'], ['AnyUri', toUri]))
  }
}
