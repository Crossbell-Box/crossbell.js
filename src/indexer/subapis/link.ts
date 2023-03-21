import { BaseIndexer } from './base'
import type { LinkEntity, ListResponse } from '../../types/indexer'
import type { LinkItemType } from '../../types/contract'
import { type BigNumberish } from 'ethers'
import { createSearchParamsString } from '../../utils'

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
    characterId: BigNumberish,
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
      toCharacterId?: BigNumberish
      /** The toAddress to filter by. */
      toAddress?: string
      /** The toNoteId to filter by. */
      toNoteId?: BigNumberish
      /** The toContractAddress to filter by. */
      toContractAddress?: string
      /** The toTokenId to filter by. */
      toTokenId?: BigNumberish
      /** The toLinklistId to filter by. */
      toLinklistId?: BigNumberish
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
    characterId: BigNumberish,
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
    address: string,
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
    characterId: BigNumberish,
    noteId: BigNumberish,
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
    contractAddress: BigNumberish,
    tokenId: BigNumberish,
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
    linklistId: BigNumberish,
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
