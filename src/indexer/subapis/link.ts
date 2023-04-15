import { type Address } from 'viem'
import { createSearchParamsString } from '../../utils'
import {
  type LinkEntity,
  type LinkItemType,
  type ListResponse,
  type Numberish,
} from '../../types'
import { BaseIndexer } from './base'

export class LinkIndexer extends BaseIndexer {
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
  async getLinks(
    characterId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      linkItemType,
      fromCharacterId,
      toCharacterId,
      toAddress,
      toNoteId,
      toContractAddress,
      toTokenId,
      toLinklistId,
      toUri,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The link item type to filter by. e.g. 'Character' */
      linkItemType?: LinkItemType
      /** The fromCharacterId to filter by. */
      fromCharacterId?: string
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
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/links?`
    url += createSearchParamsString({
      limit,
      cursor,
      linkType,
      linkItemType,
      fromCharacterId,
      toCharacterId,
      toAddress,
      toNoteId,
      toContractAddress,
      toTokenId,
      toLinklistId,
      toUri,
      order,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
  }

  /**
   * This returns a list of links ends at a specific character.
   *
   * @category Link
   * @param characterId - The characterId of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  async getBacklinksOfCharacter(
    characterId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/backlinks?`
    url += createSearchParamsString({ limit, cursor, linkType, order })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
  }

  /**
   * This returns a list of links ends at a specific address.
   *
   * @category Link
   * @param address - The address of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  async getBacklinksOfAddress(
    address: Address,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/addresses/${address}/backlinks?`
    url += createSearchParamsString({ limit, cursor, linkType, order })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
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
  async getBacklinksOfNote(
    characterId: Numberish,
    noteId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/notes/${characterId}/${noteId}/backlinks?`
    url += createSearchParamsString({ limit, cursor, linkType, order })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
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
  async getBacklinksOfErc721(
    contractAddress: Numberish,
    tokenId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/erc721s/${contractAddress}/${tokenId}/backlinks?`
    url += createSearchParamsString({ limit, cursor, linkType, order })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
  }

  /**
   * This returns a list of links ends at a specific linklist.
   *
   * @category Link
   * @param linklistId - The linklistId of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  async getBacklinksOfLinklist(
    linklistId: Numberish,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/linklists/${linklistId}/backlinks?`
    url += createSearchParamsString({ limit, cursor, linkType, order })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
  }

  /**
   * This returns a list of links ends at a specific uri.
   *
   * @category Link
   * @param uri - The uri of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  async getBacklinksOfAnyUri(
    uri: string,
    {
      limit = 20,
      cursor,
      linkType,
      order,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The order to sort by. */
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/anyuris/${uri}/backlinks?`
    url += createSearchParamsString({ limit, cursor, linkType, order })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
  }
}
