import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Result } from '../../types/contract'

export class RevisionContract extends BaseContract {
  private CURRENT_SDK_REVISION = 4

  /**
   * This returns the remote latest revision of the contract.
   * @category Revision
   * @returns The remote latest revision of the contract.
   */
  @autoSwitchMainnet()
  async getLatestRevision(): Promise<Result<number, false>> | never {
    const revision = await this.contract.getRevision()

    return {
      data: revision.toNumber(),
    }
  }

  /**
   * This returns the local SDK revision of the contract.
   * @category Revision
   * @returns The local SDK revision of the contract.
   */
  async getCurrentRevision(): Promise<Result<number, false>> | never {
    return {
      data: this.CURRENT_SDK_REVISION,
    }
  }

  /**
   * This checks if the SDK is up-to-date with the contract.
   * Although the contract will update its revision from time to time, it will keep compatibility with
   * the old revision. I.e. Crossbell's developers ensured that there is not going to be any breaking changes
   * when introducing new features in the future.
   *
   * Therefore, this method is used to check if you need to update your SDK to use some new features.
   * @category Revision
   * @returns Whether the SDK is up-to-date with the contract and the local/remote revision.
   */
  async checkRevision():
    | Promise<
        Result<
          {
            isUpToDate: boolean
            currentRevision: number
            latestRevision: number
          },
          false
        >
      >
    | never {
    const { data: latestRevision } = await this.getLatestRevision()
    const currentRevision = this.CURRENT_SDK_REVISION
    const isUpToDate = latestRevision === currentRevision

    return {
      data: {
        isUpToDate,
        currentRevision,
        latestRevision,
      },
    }
  }
}
