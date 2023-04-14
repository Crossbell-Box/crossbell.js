import {
  type ListResponse,
  type MintModuleEntity,
  type MintModuleTargetItemType,
} from '../../types'
import { type BaseIndexer } from './base'

export class MintModuleIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This returns a list of mint modules.
   *
   * @category MintModule
   * @param options - The options to send to the indexer.
   * @returns The list of mint modules.
   */
  getMany({
    targetItemType,
    toCharacterId,
    toNoteId,
    limit,
    cursor,
  }: {
    /** The target item type of the mint module. */
    targetItemType?: MintModuleTargetItemType
    /** The character ID of the target item. */
    toCharacterId?: bigint
    /** The note ID of the target item. */
    toNoteId?: bigint
    /** The limit of the number of items to return. */
    limit?: number
    /** Used for pagination. */
    cursor?: string
  } = {}) {
    const url = `/mint-modules`
    return this.base.fetch<ListResponse<MintModuleEntity>>(url, {
      params: {
        targetItemType,
        toCharacterId,
        toNoteId,
        limit,
        cursor,
      },
    })
  }

  /**
   * This returns a specific mint module.
   *
   * @category MintModule
   * @param targetItemType - The targetItemType of the mint module.
   * @param linkValue - The linkValue of the mint module.
   * @returns The mint module.
   */
  get(targetItemType: MintModuleTargetItemType, linkValue: bigint) {
    const url = `/mint-modules/${targetItemType}/${linkValue}`
    return this.base.fetch<MintModuleEntity>(url)
  }
}
