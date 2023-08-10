import { type Address } from 'viem'
import {
  type MintOrLinkModuleConfig,
  type Numberish,
  type Result,
  type WriteOverrides,
} from '../../types'
import {
  getModuleConfig,
  waitForTransactionReceiptWithRetry,
} from '../../utils'
import { type Entry } from '../abi'
import { autoSwitchMainnet } from '../decorators'
import { type BaseContract } from './base'

export class LinkModuleContract {
  constructor(private base: BaseContract) {}

  /**
   * This sets the link module for an address.
   * @category LinkModule
   * @param address The address to set the link module for.
   * @param linkModule The link module to set.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async setForAddress(
    {
      address,
      linkModule,
    }: { address: Address; linkModule: MintOrLinkModuleConfig },
    overrides: WriteOverrides<Entry, 'setLinkModule4Address'> = {},
  ): Promise<Result<undefined, true>> {
    const moduleConfig = await getModuleConfig(linkModule)

    const hash = await this.base.contract.write.setLinkModule4Address(
      [
        {
          account: address,
          linkModule: moduleConfig.address,
          linkModuleInitData: moduleConfig.initData,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets the link module for a linklist.
   * @category LinkModule
   * @param linklistId The linklist ID to set the link module for.
   * @param linkModule The link module to set.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async setForLinklist(
    {
      linklistId,
      linkModule,
    }: { linklistId: Numberish; linkModule: MintOrLinkModuleConfig },
    overrides: WriteOverrides<Entry, 'setLinkModule4Linklist'> = {},
  ): Promise<Result<undefined, true>> {
    const moduleConfig = await getModuleConfig(linkModule)

    const hash = await this.base.contract.write.setLinkModule4Linklist(
      [
        {
          linklistId: BigInt(linklistId),
          linkModule: moduleConfig.address,
          linkModuleInitData: moduleConfig.initData,
        },
      ],
      overrides,
    )

    const receipt = await waitForTransactionReceiptWithRetry(
      this.base.publicClient,
      hash,
    )

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }
}
