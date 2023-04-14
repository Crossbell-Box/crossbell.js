import { type Address } from 'viem'
import {
  type LinkModuleEntity,
  type LinkModuleTargetItemType,
  type ListResponse,
} from '../../types'
import { type BaseIndexer } from './base'

export class LinkModuleIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This returns a list of link modules.
   *
   * @category LinkModule
   * @param options - The options to send to the indexer.
   * @returns The list of link modules.
   */
  getMany({
    targetItemType,
    toAddress,
    toCharacterId,
    toNoteId,
    toContractAddress,
    toTokenId,
    toLinklistId,
    limit,
    cursor,
  }: {
    /** The target item type of the link module. */
    targetItemType?: LinkModuleTargetItemType
    /** The address of the target item. */
    toAddress?: Address
    /** The character ID of the target item. */
    toCharacterId?: bigint
    /** The note ID of the target item. */
    toNoteId?: bigint
    /** The contract address of the target item. */
    toContractAddress?: Address
    /** The token ID of the target item. */
    toTokenId?: bigint
    /** The linklist ID of the target item. */
    toLinklistId?: bigint
    /** The limit of the number of items to return. */
    limit?: number
    /** Used for pagination. */
    cursor?: string
  } = {}) {
    const url = `/link-modules`
    return this.base.fetch<ListResponse<LinkModuleEntity>>(url, {
      params: {
        targetItemType,
        toAddress,
        toCharacterId,
        toNoteId,
        toContractAddress,
        toTokenId,
        toLinklistId,
        limit,
        cursor,
      },
    })
  }

  /**
   * This returns a specific link module.
   *
   * @category LinkModule
   * @param targetItemType - The targetItemType of the link module.
   * @param linkValue - The linkValue of the link module.
   * @returns The link module.
   */
  get(targetItemType: LinkModuleTargetItemType, linkValue: bigint) {
    const url = `/link-modules/${targetItemType}/${linkValue}`
    return this.base.fetch<LinkModuleEntity | null>(url)
  }
}
