import { BaseIndexer } from './base'
import queryString from 'query-string'
import type { LinkEntity, ListResponse } from '../../types/indexer'
import type { LinkItemType } from '../../types/contract'

export class LinkIndexer extends BaseIndexer {
  /**
   * This returns a list of links starts from a specific profile.
   *
   * Note that all links can only start from profiles, but can end to profiles, notes or other item types.
   *
   * @category Link
   * @param profileId - The profileId of the link owner.
   * @param options - The options to send to the indexer.
   * @returns The list of links.
   */
  async getLinks(
    profileId: string,
    {
      limit = 20,
      cursor,
      linkType,
      linkItemType,
      fromProfileId,
      toProfileId,
      toAddress,
      toNoteId,
      toContractAddress,
      toTokenId,
      toLinklistId,
      toUri,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
      /** The link item type to filter by. e.g. 'Profile' */
      linkItemType?: LinkItemType
      /** The fromProfileId to filter by. */
      fromProfileId?: string
      /** The toProfileId to filter by. */
      toProfileId?: string
      /** The toAddress to filter by. */
      toAddress?: string
      /** The toNoteId to filter by. */
      toNoteId?: string
      /** The toContractAddress to filter by. */
      toContractAddress?: string
      /** The toTokenId to filter by. */
      toTokenId?: string
      /** The toLinklistId to filter by. */
      toLinklistId?: string
      /** The toUri to filter by. */
      toUri?: string
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/profiles/${profileId}/links?`
    url += queryString.stringify({
      limit,
      cursor,
      linkType,
      linkItemType,
      fromProfileId,
      toProfileId,
      toAddress,
      toNoteId,
      toContractAddress,
      toTokenId,
      toLinklistId,
      toUri,
    })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
  }

  /**
   * This returns a list of links ends at a specific profile.
   *
   * @category Link
   * @param profileId - The profileId of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  async getBacklinksOfProfile(
    profileId: string,
    {
      limit = 20,
      cursor,
      linkType,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/profiles/${profileId}/backlinks?`
    url += queryString.stringify({ limit, cursor, linkType })

    const res = await fetch(url).then((res) => res.json())

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
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/addresses/${address}/backlinks?`
    url += queryString.stringify({ limit, cursor, linkType })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
  }

  /**
   * This returns a list of links ends at a specific notes.
   *
   * @category Link
   * @param profileId - The profileId of the note owner.
   * @param noteId - The noteId of the link ends to.
   * @param options - The options to send to the indexer.
   * @return The list of links.
   */
  async getBacklinksOfNote(
    profileId: string,
    noteId: string,
    {
      limit = 20,
      cursor,
      linkType,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/notes/${profileId}/${noteId}/backlinks?`
    url += queryString.stringify({ limit, cursor, linkType })

    const res = await fetch(url).then((res) => res.json())

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
    contractAddress: string,
    tokenId: string,
    {
      limit = 20,
      cursor,
      linkType,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/erc721s/${contractAddress}/${tokenId}/backlinks?`
    url += queryString.stringify({ limit, cursor, linkType })

    const res = await fetch(url).then((res) => res.json())

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
    linklistId: string,
    {
      limit = 20,
      cursor,
      linkType,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/linklists/${linklistId}/backlinks?`
    url += queryString.stringify({ limit, cursor, linkType })

    const res = await fetch(url).then((res) => res.json())

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
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
      /** The link type to filter by. e.g. 'follow' */
      linkType?: string
    } = {},
  ): Promise<ListResponse<LinkEntity>> {
    let url = `${this.endpoint}/anyuris/${uri}/backlinks?`
    url += queryString.stringify({ limit, cursor, linkType })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<LinkEntity>
  }
}
