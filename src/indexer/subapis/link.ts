import { type Address } from 'viem'
import {
  type LinkEntity,
  type LinkItemType,
  type ListResponse,
  type Numberish,
} from '../../types'
import { type BaseIndexer } from './base'

type LinksQuery = {
  /** Limit the count of items returned. */
  limit?: Numberish
  /** Used for pagination. */
  cursor?: string
  /** The link type to filter by. e.g. 'follow' */
  linkType?: string
  /** The link item type to filter by. e.g. 'Character' */
  linkItemType?: LinkItemType
  /** The fromCharacterId to filter by. */
  fromCharacterId?: Numberish
  /** The toCharacterId to filter by. */
  toCharacterId?: Numberish
  /** The toAddress to filter by. */
  toAddress?: Address
  /** The toNoteId to filter by. */
  toNoteId?: Numberish
  /** The toContractAddress to filter by. */
  toContractAddress?: Address
  /** The toTokenId to filter by. */
  toTokenId?: Numberish
  /** The toLinklistId to filter by. */
  toLinklistId?: Numberish
  /** The toUri to filter by. */
  toUri?: string
  /** The order to sort by. */
  order?: 'asc' | 'desc'
}

export class LinkIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This returns a list of links starts from a specific character.
   *
   * Note that all links can only start from characters, but can end to characters, notes or other item types.
   *
   * @category Link
   * @param characterId - The characterId of the link owner.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  getMany(characterId: Numberish, options: LinksQuery = {}) {
    const url = `/characters/${characterId}/links`
    return this.base.fetch<ListResponse<LinkEntity>>(url, {
      params: options,
    })
  }

  /**
   * This returns a list of links from a linklist.
   *
   * Note that all links can only start from characters, but can end to characters, notes or other item types.
   *
   * @category Link
   * @param linklistId - The id of the linklist.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  getManyByLinklistId(linklistId: Numberish, options: LinksQuery = {}) {
    const url = `/linklists/${linklistId}/links`
    return this.base.fetch<ListResponse<LinkEntity>>(url, {
      params: options,
    })
  }

  /**
   * This returns a list of links ends at a specific character.
   *
   * @category Link
   * @param characterId - The characterId of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  getBacklinksOfCharacter(
    characterId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ) {
    const url = `/characters/${characterId}/backlinks`
    return this.base.fetch<ListResponse<LinkEntity>>(url, {
      params: { limit, cursor, linkType, order },
    })
  }

  /**
   * This returns a list of links ends at a specific address.
   *
   * @category Link
   * @param address - The address of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  getBacklinksByAddress(
    address: Address,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ) {
    const url = `/addresses/${address}/backlinks`
    return this.base.fetch<ListResponse<LinkEntity>>(url, {
      params: {
        limit,
        cursor,
        linkType,
        order,
      },
    })
  }

  /**
   * This returns a list of links ends at a specific notes.
   *
   * @category Link
   * @param characterId - The characterId of the note owner.
   * @param noteId - The noteId of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  getBacklinksByNote(
    characterId: Numberish,
    noteId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ) {
    const url = `/notes/${characterId}/${noteId}/backlinks`
    return this.base.fetch<ListResponse<LinkEntity>>(url, {
      params: { limit, cursor, linkType, order },
    })
  }

  /**
   * This returns a list of links ends at a specific ERC721 token.
   *
   * @category Link
   * @param contractAddress - The contractAddress of the ERC721 token.
   * @param tokenId - The tokenId of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  getBacklinksByErc721(
    contractAddress: Numberish,
    tokenId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ) {
    const url = `/erc721s/${contractAddress}/${tokenId}/backlinks`
    return this.base.fetch<ListResponse<LinkEntity>>(url, {
      params: { limit, cursor, linkType, order },
    })
  }

  /**
   * This returns a list of links ends at a specific linklist.
   *
   * @category Link
   * @param linklistId - The linklistId of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  getBacklinksByLinklist(
    linklistId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ) {
    const url = `/linklists/${linklistId}/backlinks`
    return this.base.fetch<ListResponse<LinkEntity>>(url, {
      params: {
        limit,
        cursor,
        linkType,
        order,
      },
    })
  }

  /**
   * This returns a list of links ends at a specific uri.
   *
   * @category Link
   * @param uri - The uri of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  getBacklinksByAnyUri(
    uri: string,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: Numberish
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ) {
    const url = `/anyuris/${uri}/backlinks`
    return this.base.fetch<ListResponse<LinkEntity>>(url, {
      params: {
        limit,
        cursor,
        linkType,
        order,
      },
    })
  }
}
