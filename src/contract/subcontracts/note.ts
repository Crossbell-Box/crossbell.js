import {
  type Address,
  encodeFunctionData,
  encodePacked,
  hexToString,
  keccak256,
} from 'viem'
import pLimit from 'p-limit'
import {
  type LinkItemMap,
  type LinkItemType,
  type Note,
  type NoteMetadata,
  type Numberish,
  type PostNoteOptions,
  type ReadOverrides,
  type Result,
  type WriteOverrides,
} from '../../types'
import { ipfsParseMetadataOrUri, ipfsUriToMetadata } from '../../ipfs'
import {
  NIL_ADDRESS,
  getModuleConfig,
  parseLog,
  validateAddress,
  waitForTransactionReceiptWithRetry,
} from '../../utils'
import { autoSwitchMainnet } from '../decorators'
import { type Entry, entry } from '../abi'
import { type BaseContract } from './base'

async function buildPostNoteData({
  linkModule,
  mintModule,
  characterId,
  metadataOrUri,
  locked = false,
}: PostNoteOptions) {
  const { uri } = await ipfsParseMetadataOrUri('note', metadataOrUri)
  const linkModuleConfig = await getModuleConfig(linkModule)
  const mintModuleConfig = await getModuleConfig(mintModule)

  return {
    characterId: BigInt(characterId),
    contentUri: uri,
    linkModule: linkModuleConfig.address,
    linkModuleInitData: linkModuleConfig.initData,
    mintModule: mintModuleConfig.address,
    mintModuleInitData: mintModuleConfig.initData,
    locked,
  }
}

export class NoteContract {
  constructor(private base: BaseContract) {}

  /**
   * This creates a new note.
   * @category Note
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async post(
    options: PostNoteOptions,
    overrides: WriteOverrides<Entry, 'postNote'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> {
    const data = await buildPostNoteData(options)
    const hash = await this.base.contract.write.postNote([data], overrides)

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

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
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postMany(
    {
      notes,
    }: {
      notes: {
        // TODO: move to options
        /** The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected. */
        characterId: Numberish
        /** The metadata or URI of the content you want to post. */
        metadataOrUri: NoteMetadata | string
        options?: PostNoteOptions
      }[]
    },
    overrides: WriteOverrides<Entry, 'multicall'> = {},
  ): Promise<Result<{ noteIds: bigint[] }, true>> {
    const limitedPromise = pLimit(10)
    const encodedDataArr = await Promise.all(
      notes.map(({ options, characterId, metadataOrUri }) => {
        return limitedPromise(async () => {
          const data = await buildPostNoteData({
            ...options,
            characterId,
            metadataOrUri,
          })

          return encodeFunctionData({
            abi: entry,
            functionName: 'postNote',
            args: [data],
          })
        })
      }),
    )

    const hash = await this.base.contract.write.multicall(
      [encodedDataArr],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const logs = parseLog(receipt.logs, 'PostNote', {
      throwOnMultipleLogsFound: false,
      returnMultipleLogs: true,
    })

    const noteIds = logs.map((log) => log.args.noteId)

    return {
      data: {
        noteIds,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for any target uri.
   * @category Note
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postForAnyUri(
    {
      targetUri,
      ...options
    }: PostNoteOptions & {
      /** The target uri of the note. */
      targetUri: string
    },
    overrides: WriteOverrides<Entry, 'postNote4AnyUri'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> {
    const data = await buildPostNoteData(options)

    const hash = await this.base.contract.write.postNote4AnyUri(
      [data, targetUri],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

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
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postForNote(
    {
      targetCharacterId,
      targetNoteId,
      ...options
    }: PostNoteOptions & {
      /** The target uri of the note. */
      targetCharacterId: Numberish
      targetNoteId: Numberish
    },
    overrides: WriteOverrides<Entry, 'postNote4Note'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> {
    const data = await buildPostNoteData(options)
    const hash = await this.base.contract.write.postNote4Note(
      [
        data,
        {
          characterId: BigInt(targetCharacterId),
          noteId: BigInt(targetNoteId),
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const log = parseLog(receipt.logs, 'PostNote')

    return {
      data: {
        noteId: log.args.noteId,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for a character.
   * @category Note
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postForCharacter(
    {
      toCharacterId,
      ...options
    }: PostNoteOptions & {
      /** The target characterId. */
      toCharacterId: Numberish
    },
    overrides: WriteOverrides<Entry, 'postNote4Character'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> {
    const data = await buildPostNoteData(options)
    const hash = await this.base.contract.write.postNote4Character(
      [data, BigInt(toCharacterId)],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const log = parseLog(receipt.logs, 'PostNote')

    return {
      data: {
        noteId: log.args.noteId,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for linklist.
   * @category Note
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postForLinklist(
    {
      toLinklistId,
      ...options
    }: PostNoteOptions & {
      /** The target linklistId. */
      toLinklistId: Numberish
    },
    overrides: WriteOverrides<Entry, 'postNote4Linklist'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> {
    const data = await buildPostNoteData(options)
    const hash = await this.base.contract.write.postNote4Linklist(
      [data, BigInt(toLinklistId)],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const log = parseLog(receipt.logs, 'PostNote')

    return {
      data: {
        noteId: log.args.noteId,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for linklist.
   * @category Note
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postForAddress(
    {
      toAddress,
      ...options
    }: PostNoteOptions & {
      /** The target address. */
      toAddress: Address
    },
    overrides: WriteOverrides<Entry, 'postNote4Address'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> {
    const data = await buildPostNoteData(options)

    const hash = await this.base.contract.write.postNote4Address(
      [data, toAddress],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    const log = parseLog(receipt.logs, 'PostNote')

    return {
      data: {
        noteId: log.args.noteId,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for ERC721.
   * @category Note
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postForERC721(
    {
      tokenAddress,
      tokenId,
      ...options
    }: PostNoteOptions & {
      tokenAddress: Address
      tokenId: Numberish
    },
    overrides: WriteOverrides<Entry, 'postNote4ERC721'> = {},
  ): Promise<Result<{ noteId: bigint }, true>> {
    const data = await buildPostNoteData(options)

    const hash = await this.base.contract.write.postNote4ERC721(
      [data, { tokenAddress, erc721TokenId: BigInt(tokenId) }],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

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
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async setUri(
    {
      characterId,
      noteId,
      metadataOrUri,
    }: {
      /** The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected. */
      characterId: Numberish
      /** The id of the note you want to set the metadata. */
      noteId: Numberish
      /** The metadata or URI of the content you want to post. */
      metadataOrUri: NoteMetadata | string
    },
    overrides: WriteOverrides<Entry, 'setNoteUri'> = {},
  ): Promise<Result<{ uri: string; metadata: NoteMetadata }, true>> {
    const { uri, metadata } = await ipfsParseMetadataOrUri(
      'note',
      metadataOrUri,
      true,
    )

    const hash = await this.base.contract.write.setNoteUri(
      [BigInt(characterId), BigInt(noteId), uri],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

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
    {
      characterId,
      noteId,
      modifier,
    }: {
      /** The character ID of the user you want to set the URI for. */
      characterId: Numberish
      /** The id of the note you want to set the URI for. */
      noteId: Numberish
      /** The callback function that modifies the metadata. */
      modifier: (metadata?: NoteMetadata) => NoteMetadata
    },
    overrides: WriteOverrides<Entry, 'setNoteUri'> = {},
  ) {
    const note = await this.get({ characterId, noteId })

    const metadata = modifier(note.data.metadata)
    if (typeof metadata === 'undefined') {
      throw new TypeError(
        'The modified metadata is undefined. Did you return it?',
      )
    }

    if (!metadata.type) {
      metadata.type = 'note'
    }

    return this.setMetadata({ characterId, noteId, metadata }, overrides)
  }

  /**
   * This is the same as {@link setUri}
   * @category Note
   */
  setMetadata(
    {
      characterId,
      noteId,
      metadata,
    }: {
      characterId: Numberish
      noteId: Numberish
      metadata: NoteMetadata
    },
    overrides: WriteOverrides<Entry, 'setNoteUri'> = {},
  ) {
    return this.setUri(
      { characterId, noteId, metadataOrUri: metadata },
      overrides,
    )
  }

  /**
   * This returns the info of a note.
   * @category Note
   * @returns The info of the note.
   */
  async get<T extends LinkItemType>(
    {
      characterId,
      noteId,
      linkItemType,
    }: {
      /** The character ID of the address who owns the note. */
      characterId: Numberish
      /** The id of the note you want to get the info for. */
      noteId: Numberish
      linkItemType?: T
    },
    overrides: ReadOverrides<Entry, 'getNote'> = {},
  ): Promise<Result<Note<LinkItemMap[T]>>> {
    const data = await this.base.contract.read.getNote(
      [BigInt(characterId), BigInt(noteId)],
      overrides,
    )

    const linkItemTypeString: LinkItemType | undefined =
      (hexToString(data.linkItemType, { size: 32 }) as LinkItemType) ||
      undefined
    const metadata = data.contentUri
      ? await ipfsUriToMetadata<NoteMetadata>(data.contentUri)
      : undefined

    let linkItem: LinkItemMap[T]
    const pc = this.base.peripheryContract.read
    if (linkItemType === 'AnyUri') {
      const uri = await pc.getLinkingAnyUri([data.linkKey])
      linkItem = { uri } satisfies LinkItemMap['AnyUri'] as LinkItemMap[T]
    } else if (linkItemType === 'ERC721') {
      const erc721 = await pc.getLinkingERC721([data.linkKey])
      linkItem = {
        contractAddress: erc721.tokenAddress,
        tokenId: erc721.erc721TokenId.toString(),
      } satisfies LinkItemMap['ERC721'] as LinkItemMap[T]
    } else if (linkItemType === 'Address') {
      const address = await pc.getLinkingAddress([data.linkKey])
      linkItem = {
        address,
      } satisfies LinkItemMap['Address'] as LinkItemMap[T]
    } else if (linkItemType === 'Character') {
      const characterId = await pc.getLinkingCharacterId([data.linkKey])
      linkItem = {
        characterId,
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
        linklistId,
      } satisfies LinkItemMap['Linklist'] as LinkItemMap[T]
    } else {
      linkItem = undefined as unknown as LinkItemMap[T]
    }

    return {
      data: {
        characterId: BigInt(characterId),
        noteId: BigInt(noteId),
        contentUri: data.contentUri,
        metadata,
        linkItemType: data.linkItemType,
        linkItemTypeString,
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
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async delete(
    {
      characterId,
      noteId,
    }: {
      /** The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected. */
      characterId: Numberish
      /** The id of the note you want to delete. */
      noteId: Numberish
    },
    overrides: WriteOverrides<Entry, 'deleteNote'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.deleteNote(
      [BigInt(characterId), BigInt(noteId)],
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
   * This locks a note.
   *
   * When a note is locked, it can't be edited and unlocked anymore.
   * I.e., you can't change the content of the note using {@link setUri} {@link setMetadata} {@link changeMetadata}.
   *
   * You can still delete the note using {@link delete}.
   *
   * @category Note
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async lock(
    {
      characterId,
      noteId,
    }: {
      /** The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected. */
      characterId: Numberish
      /** The id of the note you want to lock. */
      noteId: Numberish
    },
    overrides: WriteOverrides<Entry, 'lockNote'> = {},
  ): Promise<Result<undefined, true>> {
    const hash = await this.base.contract.write.lockNote(
      [BigInt(characterId), BigInt(noteId)],
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
   * This mints a note as an NFT.
   * @category Note
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async mint(
    {
      characterId,
      noteId,
      toAddress,
    }: {
      /** The character ID of the address who owns the note. */
      characterId: Numberish
      /** The id of the note you want to get the info for. */
      noteId: Numberish
      /** The address you want to mint the note to. */
      toAddress: Address
    },
    overrides: WriteOverrides<Entry, 'mintNote'> = {},
  ): Promise<Result<{ contractAddress: Address; tokenId: bigint }, true>> {
    validateAddress(toAddress)

    const hash = await this.base.contract.write.mintNote(
      [
        {
          characterId: BigInt(characterId),
          noteId: BigInt(noteId),
          to: toAddress,
          mintModuleData: NIL_ADDRESS,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

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
   * @returns The linkKey of the note.
   */
  getLinkKeyForCharacter({
    toCharacterId,
  }: {
    /** The character ID of the character you want to get the linkKey of. */
    toCharacterId: Numberish
  }): string {
    return keccak256(
      encodePacked(['string', 'uint'], ['Character', BigInt(toCharacterId)]),
    )
  }

  /**
   * This returns the linkKey of a note linked to a note.
   * @category Note
   * @returns The linkKey of the note.
   */
  getLinkKeyForAddress({
    toAddress,
  }: {
    /** The address you want to get the linkKey of. */
    toAddress: Address
  }): string {
    validateAddress(toAddress)

    return keccak256(
      encodePacked(['string', 'address'], ['Address', toAddress]),
    )
  }

  /**
   * This returns the linkKey of a note linked to a note.
   * @category Note
   * @returns The linkKey of the note.
   */
  getLinkKeyForNote({
    toCharacterId,
    toNoteId,
  }: {
    /** The character ID of the character you want to get the linkKey of. */
    toCharacterId: Numberish
    /** The id of the note you want to get the linkKey of. */
    toNoteId: Numberish
  }): string {
    return keccak256(
      encodePacked(
        ['string', 'uint', 'uint'],
        ['Note', BigInt(toCharacterId), BigInt(toNoteId)],
      ),
    )
  }

  /**
   * This returns the linkKey of a note linked to an ERC721 token.
   * @category Note
   * @returns The linkKey of the note.
   */
  getLinkKeyForERC721({
    toContractAddress,
    toTokenId,
  }: {
    /** The address of the ERC721 token you want to get the linkKey of. */
    toContractAddress: Address
    /** The id of the ERC721 token you want to get the linkKey of. */
    toTokenId: Numberish
  }): string {
    return keccak256(
      encodePacked(
        ['string', 'address', 'uint'],
        ['ERC721', toContractAddress, BigInt(toTokenId)],
      ),
    )
  }

  /**
   * This returns the linkKey of a note linked to a linklist.
   * @category Note
   * @returns The linkKey of the note.
   */
  getLinkKeyForLinklist({
    toLinkListId,
  }: {
    /** The id of the linklist you want to get the linkKey of. */
    toLinkListId: Numberish
  }): string {
    return keccak256(
      encodePacked(['string', 'uint'], ['Linklist', BigInt(toLinkListId)]),
    )
  }

  /**
   * This returns the linkKey of a note linked to an any uri.
   * @category Note
   * @returns The linkKey of the note.
   */
  getLinkKeyForAnyUri({
    toUri,
  }: {
    /** The uri you want to get the linkKey of. */
    toUri: string
  }): string {
    return keccak256(encodePacked(['string', 'string'], ['AnyUri', toUri]))
  }
}
