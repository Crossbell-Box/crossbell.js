import {
  WalletClient,
  PublicClient,
  getContract,
  Address,
  Hex,
  Log,
  decodeEventLog,
  DecodeEventLogReturnType,
  GetContractReturnType,
} from 'viem'
import {
  ExtractAbiEvent,
  ExtractAbiEventNames,
  AbiTypeToPrimitiveType,
} from 'abitype'
import { Network } from '../../network'
import {
  createWalletClientFromPrivateKey,
  CustomProvider,
  createWalletClientFromCustom,
} from '../../utils/client'

import { MintOrLinkModuleConfig } from '../../types'
import {
  // isAddressEqual,
  NIL_ADDRESS,
  // Logger,
  validateIsInSdn,
} from '../../utils'
import * as Abi from '../abi'
import { createDefaultPublicClient } from '../../utils/client'

interface ContractOptions {
  entryContractAddress: Address
  peripheryContractAddress: Address
  cbtContractAddress: Address
  newbieVillaContractAddress: Address
  tipsContractAddress: Address
  miraContractAddress: Address
  linklistContractAddress: Address
}

type EventInputs<T extends ExtractAbiEventNames<Abi.Entry>> = ExtractAbiEvent<
  Abi.Entry,
  T
>['inputs']
type GetEventArg<T extends ExtractAbiEventNames<Abi.Entry>> = {
  [K in EventInputs<T>[number]['name']]: AbiTypeToPrimitiveType<
    Extract<EventInputs<T>[number], { name: K }>['type']
  >
}
type FixedEventReturn<T extends ExtractAbiEventNames<Abi.Entry>> = Omit<
  DecodeEventLogReturnType<Abi.Entry, T>,
  'args'
> & {
  args: GetEventArg<T>
}

export class BaseContract {
  public publicClient: PublicClient = createDefaultPublicClient()
  public walletClient: WalletClient | undefined
  protected options: ContractOptions

  /**
   * This creates a new Contract instance to interact with.
   * @param clientOrPrivateKey - The provider or private key to connect to the contract.
   * @returns The Contract instance.
   *
   * @example Connect with Metamask
   * ```js
   * import { Contract } from 'crossbell.js'
   * const provider = window.ethereum // the metamask provider
   * const contract = new Contract(provider)
   * ```
   *
   * @example Connect with Private Key
   * ```js
   * import { Contract } from 'crossbell.js'
   * const privateKey = '0xabcdef0123456789012345678901234567890123456789012345678901234'
   * const contract = new Contract(privateKey)
   * ```
   *
   * @example Connect with a Readonly Contract
   * ```js
   * import { Contract } from 'crossbell.js'
   * const contract = new Contract() // readonly contract
   * ```
   */
  constructor(
    walletClientOrPrivateKey?: Hex | CustomProvider,
    options?: Partial<ContractOptions>,
  ) {
    if (typeof walletClientOrPrivateKey === 'string') {
      this.walletClient = createWalletClientFromPrivateKey(
        walletClientOrPrivateKey,
      )
    } else if (walletClientOrPrivateKey) {
      this.walletClient = createWalletClientFromCustom(walletClientOrPrivateKey)
    }
    this.options = this.initOptions(options)
  }

  private initOptions(options?: Partial<ContractOptions>): ContractOptions {
    return {
      entryContractAddress:
        options?.entryContractAddress ?? Network.getContractAddress(),
      peripheryContractAddress:
        options?.peripheryContractAddress ??
        Network.getPeripheryContractAddress(),
      cbtContractAddress:
        options?.cbtContractAddress ?? Network.getCbtContractAddress(),
      tipsContractAddress:
        options?.tipsContractAddress ?? Network.getTipsContractAddress(),
      miraContractAddress:
        options?.miraContractAddress ?? Network.getMiraContractAddress(),
      newbieVillaContractAddress:
        options?.newbieVillaContractAddress ??
        Network.getNewbieVillaContractAddress(),
      linklistContractAddress:
        options?.linklistContractAddress ??
        Network.getLinklistContractAddress(),
    }
  }

  private _contractCache:
    | GetContractReturnType<Abi.Entry, PublicClient, WalletClient>
    | undefined = undefined
  get contract() {
    if (this._contractCache) return this._contractCache
    return (this._contractCache = getContract({
      address: this.options.entryContractAddress,
      abi: Abi.entry,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    }))
  }

  private _newbieVillaContractCache:
    | GetContractReturnType<Abi.NewbieVilla, PublicClient, WalletClient>
    | undefined = undefined
  get newbieVillaContract() {
    if (this._newbieVillaContractCache) return this._newbieVillaContractCache
    return (this._newbieVillaContractCache = getContract({
      address: this.options.newbieVillaContractAddress,
      abi: Abi.newbieVilla,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    }))
  }

  protected parseLog<T extends ExtractAbiEventNames<Abi.Entry>>(
    logs: Log[],
    filterTopic: T,
    options: { throwOnMultipleLogsFound?: boolean; returnMultipleLogs: true },
  ): FixedEventReturn<T>[]
  protected parseLog<T extends ExtractAbiEventNames<Abi.Entry>>(
    logs: Log[],
    filterTopic: T,
    options?: {
      throwOnMultipleLogsFound?: boolean
      returnMultipleLogs?: boolean
    },
  ): FixedEventReturn<T>
  protected parseLog<T extends ExtractAbiEventNames<Abi.Entry>>(
    logs: Log[],
    targetTopic: T,
    {
      throwOnMultipleLogsFound,
      returnMultipleLogs,
    }: {
      throwOnMultipleLogsFound?: boolean
      returnMultipleLogs?: boolean
    } = {},
  ): any {
    const parsedLogs = logs
      .map((log) => decodeEventLog({ abi: Abi.entry, ...log }))
      .filter(
        (log): log is DecodeEventLogReturnType<Abi.Entry, T> =>
          log.eventName === targetTopic,
      )

    if (parsedLogs.length === 0) {
      throw new Error(`Log with topic ${targetTopic} not found`)
    }

    if (throwOnMultipleLogsFound && parsedLogs.length > 1) {
      throw new Error(`More than one log with topic ${parsedLogs} found`)
    }

    if (returnMultipleLogs) return parsedLogs

    return parsedLogs[0]
  }

  protected validateAddress(address: string | string[]) {
    if (Array.isArray(address)) {
      address.forEach((addr) => this.validateAddress(addr))
    } else {
      validateIsInSdn(address)
    }
  }

  //// module

  // private _moduleResponseCache = undefined as MintOrLinkModule[] | undefined
  // private _lastModuleResponseCacheTime = 0

  // protected async getModules<T extends MintOrLinkModule['type']>({
  //   type,
  // }: {
  //   type?: T
  // } = {}): Promise<MintOrLinkModule<T>[]> {
  //   const now = Date.now()
  //   const isMoreThanOneMinute =
  //     now - this._lastModuleResponseCacheTime > 60 * 1000

  //   let res: MintOrLinkModule<T>[] = []
  //   if (!this._moduleResponseCache || isMoreThanOneMinute) {
  //     res = (await fetch(
  //       'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/deployments/modules.json',
  //     ).then((res) => res.json())) as MintOrLinkModule<T>[]
  //     this._moduleResponseCache = res
  //     this._lastModuleResponseCacheTime = now
  //   } else {
  //     res = this._moduleResponseCache as MintOrLinkModule<T>[]
  //   }

  //   if (type) {
  //     return res.filter((module) => module.type === type)
  //   }

  //   return res
  // }

  // protected async getModule(address: string) {
  //   const modules = await this.getModules()
  //   return modules.find((module) => isAddressEqual(module.address, address))
  // }

  // async getLinkModules() {
  //   return this.getModules({ type: 'link' })
  // }

  // async getLinkModule(address: string) {
  //   const modules = await this.getLinkModules()
  //   return modules.find(
  //     (module) =>
  //       isAddressEqual(module.address, address) && module.type === 'link',
  //   )
  // }

  // async getMintModules() {
  //   return this.getModules({ type: 'mint' })
  // }

  // async getMintModule(address: string) {
  //   const modules = await this.getMintModules()
  //   return modules.find(
  //     (module) =>
  //       isAddressEqual(module.address, address) && module.type === 'mint',
  //   )
  // }

  protected async getModuleConfig(m?: MintOrLinkModuleConfig) {
    //   if (!m) {
    return {
      address: NIL_ADDRESS,
      initData: NIL_ADDRESS,
    }
    //   }

    //   const module = await this.getModule(m.address)
    //   if (!module) {
    //     throw new Error('Invalid module address ' + m.address)
    //   }

    //   const initData = this.contract.interface._abiCoder.encode(
    //     module.initDataStructure.map((item) => item.type),
    //     m.data,
    //   )

    //   return {
    //     address: m.address,
    //     initData,
    //   }
  }

  // async encodeModuleInitData(moduleAddress: string, data: any[]) {
  //   const module = await this.getModule(moduleAddress)
  //   if (!module) {
  //     throw new Error('Invalid module address ' + moduleAddress)
  //   }

  //   const result = this.contract.interface._abiCoder.encode(
  //     module.initDataStructure.map((item) => item.type),
  //     data,
  //   )

  //   return result
  // }

  // async decodeModuleInitData(moduleAddress: string, initData: string) {
  //   const module = await this.getModule(moduleAddress)
  //   if (!module) {
  //     throw new Error('Invalid module address ' + moduleAddress)
  //   }

  //   const result = this.contract.interface._abiCoder.decode(
  //     module.initDataStructure.map((item) => item.type),
  //     initData,
  //   )

  //   return result
  // }
}
