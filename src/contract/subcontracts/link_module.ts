import { BigNumberish } from 'ethers'
import { MintOrLinkModuleConfig, Overrides, Result } from '../../types'
import { autoSwitchMainnet } from '../decorators'
import { BaseContract } from './base'

export class LinkModuleContract extends BaseContract {
  /**
   * This sets the link module for an address.
   * @category LinkModule
   * @param address The address to set the link module for.
   * @param linkModule The link module to set.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async setLinkModuleForAddress(
    address: string,
    linkModule: MintOrLinkModuleConfig,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const moduleConfig = await this.getModuleConfig(linkModule)

    const tx = await this.contract.setLinkModule4Address(
      {
        account: address,
        linkModule: moduleConfig.address,
        linkModuleInitData: moduleConfig.initData,
      },
      overrides,
    )

    const receipt = await tx.wait()

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
  async setLinkModuleForLinklist(
    linklistId: BigNumberish,
    linkModule: MintOrLinkModuleConfig,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const moduleConfig = await this.getModuleConfig(linkModule)

    const tx = await this.contract.setLinkModule4Linklist(
      {
        linklistId,
        linkModule: moduleConfig.address,
        linkModuleInitData: moduleConfig.initData,
      },
      overrides,
    )

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }
}
