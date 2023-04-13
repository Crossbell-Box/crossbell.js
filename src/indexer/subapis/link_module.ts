import { BaseIndexer } from './base'
import type {
  LinkModuleEntity,
  LinkModuleTargetItemType,
  ListResponse,
} from '../../types/indexer'
import { createSearchParamsString } from '../../utils'

export class LinkModuleIndexer extends BaseIndexer {
  /**
   * This returns a list of link modules.
   *
   * @category LinkModule
   * @param options - The options to send to the indexer.
   * @returns The list of link modules.
   */
  async getLinkModules({
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
    toAddress?: string
    /** The character ID of the target item. */
    toCharacterId?: bigint
    /** The note ID of the target item. */
    toNoteId?: bigint
    /** The contract address of the target item. */
    toContractAddress?: string
    /** The token ID of the target item. */
    toTokenId?: bigint
    /** The linklist ID of the target item. */
    toLinklistId?: bigint
    /** The limit of the number of items to return. */
    limit?: number
    /** Used for pagination. */
    cursor?: string
  } = {}): Promise<ListResponse<LinkModuleEntity>> {
    let url = `${this.endpoint}/link-modules?`
    url += createSearchParamsString({
      targetItemType,
      toAddress,
      toCharacterId,
      toNoteId,
      toContractAddress,
      toTokenId,
      toLinklistId,
      limit,
      cursor,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<LinkModuleEntity>
  }

  /**
   * This returns a specific link module.
   *
   * @category LinkModule
   * @param targetItemType - The targetItemType of the link module.
   * @param linkValue - The linkValue of the link module.
   * @returns The link module.
   */
  async getLinkModule(
    targetItemType: LinkModuleTargetItemType,
    linkValue: bigint,
  ): Promise<LinkModuleEntity | null> {
    const url = `${this.endpoint}/link-modules/${targetItemType}/${linkValue}`
    const res = await this.fetch(url).then((res) => res.json())

    return res as LinkModuleEntity
  }
}
