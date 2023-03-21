import { BaseIndexer } from './base'
import type {
  MintModuleEntity,
  MintModuleTargetItemType,
  ListResponse,
} from '../../types/indexer'
import { type BigNumberish } from 'ethers'
import { createSearchParamsString } from '../../utils'

export class MintModuleIndexer extends BaseIndexer {
  /**
   * This returns a list of mint modules.
   *
   * @category MintModule
   * @param options - The options to send to the indexer.
   * @returns The list of mint modules.
   */
  async getMintModules({
    targetItemType,
    toCharacterId,
    toNoteId,
    limit,
    cursor,
  }: {
    /** The target item type of the mint module. */
    targetItemType?: MintModuleTargetItemType
    /** The character ID of the target item. */
    toCharacterId?: BigNumberish
    /** The note ID of the target item. */
    toNoteId?: BigNumberish
    /** The limit of the number of items to return. */
    limit?: number
    /** Used for pagination. */
    cursor?: string
  } = {}): Promise<ListResponse<MintModuleEntity>> {
    let url = `${this.endpoint}/mint-modules?`
    url += createSearchParamsString({
      targetItemType,
      toCharacterId,
      toNoteId,
      limit,
      cursor,
    })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<MintModuleEntity>
  }

  /**
   * This returns a specific mint module.
   *
   * @category MintModule
   * @param targetItemType - The targetItemType of the mint module.
   * @param linkValue - The linkValue of the mint module.
   * @returns The mint module.
   */
  async getMintModule(
    targetItemType: MintModuleTargetItemType,
    linkValue: BigNumberish,
  ): Promise<MintModuleEntity | null> {
    const url = `${this.endpoint}/mint-modules/${targetItemType}/${linkValue}`
    const res = await this.fetch(url).then((res) => res.json())

    return res as MintModuleEntity
  }
}
