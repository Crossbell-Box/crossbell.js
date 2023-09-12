import { type ReadOverrides, type Result } from '../../types/contract'
import { type Entry } from '../abi'
import { type BaseContract } from './base'

const CURRENT_SDK_REVISION = 4n
export class RevisionContract {
	constructor(private base: BaseContract) {}

	/**
	 * This returns the remote latest revision of the contract.
	 * @category Revision
	 * @returns The remote latest revision of the contract.
	 */
	async getLatest(
		overrides: ReadOverrides<Entry, 'getRevision'> = {},
	): Promise<Result<bigint, false>> {
		const revision = await this.base.contract.read.getRevision(overrides)

		return {
			data: revision,
		}
	}

	/**
	 * This returns the local SDK revision of the contract.
	 * @category Revision
	 * @returns The local SDK revision of the contract.
	 */
	getCurrent(): Result<bigint, false> {
		return {
			data: CURRENT_SDK_REVISION,
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
	async check(): Promise<
		Result<
			{
				isUpToDate: boolean
				currentRevision: bigint
				latestRevision: bigint
			},
			false
		>
	> {
		const { data: latestRevision } = await this.getLatest()
		const currentRevision = CURRENT_SDK_REVISION
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
