import { type Address } from 'viem'
import {
  type MintOrLinkModuleConfig,
  type Result,
  type WriteOverrides,
} from '../../types'
import { getModuleConfig } from '../../utils'
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
    address: Address,
    linkModule: MintOrLinkModuleConfig,
    overrides: WriteOverrides<Entry, 'setLinkModule4Address'> = {},
  ): Promise<Result<undefined, true>> {
    const moduleConfig = await getModuleConfig(linkModule)

    const tx = await this.base.contract.write.setLinkModule4Address(
      [
        {
          account: address,
          linkModule: moduleConfig.address,
          linkModuleInitData: moduleConfig.initData,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

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
    linklistId: bigint,
    linkModule: MintOrLinkModuleConfig,
    overrides: WriteOverrides<Entry, 'setLinkModule4Linklist'> = {},
  ): Promise<Result<undefined, true>> {
    const moduleConfig = await getModuleConfig(linkModule)

    const tx = await this.base.contract.write.setLinkModule4Linklist(
      [
        {
          linklistId,
          linkModule: moduleConfig.address,
          linkModuleInitData: moduleConfig.initData,
        },
      ],
      overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }
}
