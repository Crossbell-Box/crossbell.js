import {
  WalletClient,
  PublicClient,
  getContract,
  Address,
  Hex,
  GetContractReturnType,
  Account,
  Transport,
  Chain,
  isAddressEqual,
  encodeAbiParameters,
} from 'viem'
import { Network } from '../../network'
import {
  createWalletClientFromPrivateKey,
  createWalletClientFromCustom,
  getProviderAddress,
  createDefaultPublicClient,
} from '../../utils/viem'
import { MintOrLinkModule, MintOrLinkModuleConfig } from '../../types'
import { NIL_ADDRESS } from '../../utils'
import * as Abi from '../abi'
import { Overwrite } from '../../types/utils'
import type { EIP1193Provider } from 'eip1193-types'
import { privateKeyToAccount } from 'viem/accounts'
import { decodeAbiParameters } from 'viem'

interface AccountOptions {
  account: Account | Address
}
interface AddressOptions {
  entryContract: Address
  peripheryContract: Address
  cbtContract: Address
  newbieVillaContract: Address
  tipsContract: Address
  miraContract: Address
  linklistContract: Address
}
export interface ContractOptions extends Partial<AccountOptions> {
  address?: Partial<AddressOptions>
}

export type ResolvedContractOptions = Overwrite<
  ContractOptions,
  { address: AddressOptions }
>

export class BaseContract {
  publicClient: PublicClient = createDefaultPublicClient()
  walletClient: WalletClient<Transport, Chain, Account> | undefined
  #account: Address | Account | undefined

  get account() {
    return this.#account!
  }
  set account(value) {
    this.#account = value
    if (this.walletClient)
      this.walletClient.account =
        typeof value === 'string' ? { type: 'json-rpc', address: value } : value
  }
  options: ResolvedContractOptions

  contract!: GetContractReturnType<
    Abi.Entry,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  newbieVillaContract!: GetContractReturnType<
    Abi.NewbieVilla,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  peripheryContract!: GetContractReturnType<
    Abi.Periphery,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  cbtContract!: GetContractReturnType<
    Abi.Cbt,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  miraContract!: GetContractReturnType<
    Abi.Mira,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  tipsContract!: GetContractReturnType<
    Abi.Tips,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >

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
    providerOrPrivateKey?: Hex | EIP1193Provider,
    options?: Partial<ContractOptions>,
  ) {
    if (typeof providerOrPrivateKey === 'string') {
      const account = privateKeyToAccount(providerOrPrivateKey)
      this.#account = account
      this.walletClient = createWalletClientFromPrivateKey(account)
    } else if (providerOrPrivateKey) {
      const provider = providerOrPrivateKey
      this.#account = options?.account || getProviderAddress(provider)
      if (!options?.account) {
        provider.on('accountsChanged', (accounts) => {
          this.account = accounts[0]
        })
      }
      this.walletClient = createWalletClientFromCustom(provider, this.account)
    }
    this.options = this.#resolveOptions(options)
    this.#initContract()
  }

  #resolveOptions(options?: ContractOptions): ResolvedContractOptions {
    return {
      account: this.account,
      address: {
        entryContract: Network.getContractAddress(),
        peripheryContract: Network.getPeripheryContractAddress(),
        cbtContract: Network.getCbtContractAddress(),
        tipsContract: Network.getTipsContractAddress(),
        miraContract: Network.getMiraContractAddress(),
        newbieVillaContract: Network.getNewbieVillaContractAddress(),
        linklistContract: Network.getLinklistContractAddress(),
        ...options?.address,
      },
    }
  }

  #initContract() {
    this.contract = getContract({
      address: this.options.address.entryContract,
      abi: Abi.entry,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.newbieVillaContract = getContract({
      address: this.options.address.newbieVillaContract,
      abi: Abi.newbieVilla,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.peripheryContract = getContract({
      address: this.options.address.peripheryContract,
      abi: Abi.periphery,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.cbtContract = getContract({
      address: this.options.address.cbtContract,
      abi: Abi.cbt,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.miraContract = getContract({
      address: this.options.address.miraContract,
      abi: Abi.mira,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.tipsContract = getContract({
      address: this.options.address.tipsContract,
      abi: Abi.tips,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
  }

  // module

  #moduleResponseCache: MintOrLinkModule[] | undefined = undefined
  #lastModuleResponseCacheTime = 0

  protected async getModules<T extends MintOrLinkModule['type']>({
    type,
  }: { type?: T } = {}): Promise<MintOrLinkModule<T>[]> {
    const now = Date.now()
    const isMoreThanOneMinute =
      now - this.#lastModuleResponseCacheTime > 60 * 1000

    let res: MintOrLinkModule<T>[] = []
    if (!this.#moduleResponseCache || isMoreThanOneMinute) {
      res = (await fetch(
        'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/deployments/modules.json',
      ).then((res) => res.json())) as MintOrLinkModule<T>[]
      this.#moduleResponseCache = res
      this.#lastModuleResponseCacheTime = now
    } else {
      res = this.#moduleResponseCache as MintOrLinkModule<T>[]
    }

    if (type) {
      return res.filter((module) => module.type === type)
    }

    return res
  }

  protected async getModule(address: Address) {
    const modules = await this.getModules()
    return modules.find((module) => isAddressEqual(module.address, address))
  }

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

  async getModuleConfig(m?: MintOrLinkModuleConfig) {
    if (!m) {
      return {
        address: NIL_ADDRESS,
        initData: NIL_ADDRESS,
      }
    }

    const module = await this.getModule(m.address)
    if (!module) {
      throw new Error('Invalid module address ' + m.address)
    }

    const initData = encodeAbiParameters(
      module.initDataStructure.map((item) => ({
        type: item.type,
      })),
      m.data,
    )

    return {
      address: m.address,
      initData,
    }
  }

  async encodeModuleInitData(moduleAddress: Address, data: any[]) {
    const module = await this.getModule(moduleAddress)
    if (!module) {
      throw new Error('Invalid module address ' + moduleAddress)
    }

    const result = encodeAbiParameters(
      module.initDataStructure.map((item) => ({ type: item.type })),
      data,
    )

    return result
  }

  async decodeModuleInitData(moduleAddress: Address, initData: Hex) {
    const module = await this.getModule(moduleAddress)
    if (!module) {
      throw new Error('Invalid module address ' + moduleAddress)
    }

    const result = decodeAbiParameters(
      module.initDataStructure.map((item) => ({ type: item.type })),
      initData,
    )

    return result
  }
}
