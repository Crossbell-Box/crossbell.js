import { ethers } from 'ethers'
import { Network } from '../../network'
import WebsocketProvider from 'web3-providers-ws'
import {
  type Abi as EntryAbi,
  Abi__factory as EntryAbi__factory,
} from '../abis/entry/types'
import type {
  LinkCharacterEvent,
  MintNoteEvent,
  PostNoteEvent,
  CharacterCreatedEvent,
  LinkNoteEvent,
  GrantOperatorPermissionsEvent,
  GrantOperators4NoteEvent,
  LinkAddressEvent,
  LinkLinklistEvent,
  LinkERC721Event,
  LinkAnyUriEvent,
} from '../abis/entry/types/Abi'
import {
  type Abi as PeripheryAbi,
  Abi__factory as PeripheryAbi__factory,
} from '../abis/periphery/types'
import {
  type Abi as CbtAbi,
  Abi__factory as CbtAbi__factory,
} from '../abis/cbt/types'
import {
  type Abi as NewbieVillaAbi,
  Abi__factory as NewbieVillaAbi__factory,
} from '../abis/newbie-villa/types'
import {
  type Abi as TipsAbi,
  Abi__factory as TipsAbi__factory,
} from '../abis/tips/types'
import {
  type Abi as MiraAbi,
  Abi__factory as MiraAbi__factory,
} from '../abis/mira/types'
import {
  type Abi as LinklistAbi,
  Abi__factory as LinklistAbi__factory,
} from '../abis/linklist/types'
import type { MintEvent } from '../abis/cbt/types/Abi'
import { MintOrLinkModule, MintOrLinkModuleConfig } from '../../types'
import {
  isAddressEqual,
  NIL_ADDRESS,
  Logger,
  validateIsInSdn,
} from '../../utils'

const logTopics = {
  createCharacter: 'CharacterCreated(uint256,address,address,string,uint256)',
  linkCharacter: 'LinkCharacter(address,uint256,uint256,bytes32,uint256)',
  linkNote: 'LinkNote(uint256,uint256,uint256,bytes32,uint256)',
  linkAddress: 'LinkAddress(uint256,address,bytes32,uint256)',
  linkLinklist: 'LinkLinklist(uint256,uint256,bytes32,uint256)',
  linkERC721: 'LinkERC721(uint256,address,uint256,bytes32,uint256)',
  linkAnyUri: 'LinkAnyUri(uint256,string,bytes32,uint256)',
  postNote: 'PostNote(uint256,uint256,bytes32,bytes32,bytes)',
  mintNote: 'MintNote(address,uint256,uint256,address,uint256)',
  mint: 'Mint(uint256,uint256,uint256)',
  grantOperatorPermissions: 'GrantOperatorPermissions(uint256,address,uint256)',
  grantOperators4Note:
    'GrantOperators4Note(uint256,uint256,address[],address[])',
} as const satisfies Record<
  // keys
  string,
  // values
  | keyof EntryAbi['filters']
  | keyof PeripheryAbi['filters']
  | keyof CbtAbi['filters']
>

type LogEvents = {
  'CharacterCreated(uint256,address,address,string,uint256)': CharacterCreatedEvent
  'LinkCharacter(address,uint256,uint256,bytes32,uint256)': LinkCharacterEvent
  'LinkNote(uint256,uint256,uint256,bytes32,uint256)': LinkNoteEvent
  'LinkAddress(uint256,address,bytes32,uint256)': LinkAddressEvent
  'LinkLinklist(uint256,uint256,bytes32,uint256)': LinkLinklistEvent
  'LinkERC721(uint256,address,uint256,bytes32,uint256)': LinkERC721Event
  'LinkAnyUri(uint256,string,bytes32,uint256)': LinkAnyUriEvent
  'PostNote(uint256,uint256,bytes32,bytes32,bytes)': PostNoteEvent
  'MintNote(address,uint256,uint256,address,uint256)': MintNoteEvent
  'Mint(uint256,uint256,uint256)': MintEvent
  'GrantOperatorPermissions(uint256,address,uint256)': GrantOperatorPermissionsEvent
  'GrantOperators4Note(uint256,uint256,address[],address[])': GrantOperators4NoteEvent
}

type ContractOptions = {
  entryContractAddress: string
  peripheryContractAddress: string
  cbtContractAddress: string
  newbieVillaContractAddress: string
  tipsContractAddress: string
  miraContractAddress: string
  linklistContractAddress: string
}

export class BaseContract {
  private _providerOrPrivateKey?:
    | ethers.providers.ExternalProvider
    | ethers.providers.JsonRpcFetchFunc
    | string
  private _signerOrProvider!: ethers.Signer | ethers.providers.Provider

  protected options: ContractOptions

  /**
   * Returns the internal contract.
   * @category Internal Contract
   */
  get contract(): EntryAbi {
    return this.getContract(this._signerOrProvider)
  }

  protected getContract(
    signerOrProvider:
      | ethers.Signer
      | ethers.providers.Provider = this.getDefaultProvider(),
  ) {
    return EntryAbi__factory.connect(
      this.options.entryContractAddress,
      signerOrProvider,
    )
  }

  /**
   * Returns the internal periphery contract.
   * @category Internal Contract
   */
  get peripheryContract(): PeripheryAbi {
    return this.getPeripheryContract(this._signerOrProvider)
  }

  protected getPeripheryContract(
    signerOrProvider:
      | ethers.Signer
      | ethers.providers.Provider = this.getDefaultProvider(),
  ) {
    return PeripheryAbi__factory.connect(
      this.options.peripheryContractAddress,
      signerOrProvider,
    )
  }

  /**
   * Returns the internal cbt contract.
   * @category Internal Contract
   */
  get cbtContract(): CbtAbi {
    return this.getCbtContract(this._signerOrProvider)
  }

  protected getCbtContract(
    signerOrProvider:
      | ethers.Signer
      | ethers.providers.Provider = this.getDefaultProvider(),
  ) {
    return CbtAbi__factory.connect(
      this.options.cbtContractAddress,
      signerOrProvider,
    )
  }

  /**
   * Returns the internal cbt contract.
   */
  get tipsContract(): TipsAbi {
    return this.getTipsContract(this._signerOrProvider)
  }

  protected getTipsContract(
    signerOrProvider:
      | ethers.Signer
      | ethers.providers.Provider = this.getDefaultProvider(),
  ) {
    return TipsAbi__factory.connect(
      this.options.tipsContractAddress,
      signerOrProvider,
    )
  }

  /**
   * Returns the internal mira contract.
   */
  get miraContract(): MiraAbi {
    return this.getMiraContract(this._signerOrProvider)
  }

  protected getMiraContract(
    signerOrProvider:
      | ethers.Signer
      | ethers.providers.Provider = this.getDefaultProvider(),
  ) {
    return MiraAbi__factory.connect(
      this.options.miraContractAddress,
      signerOrProvider,
    )
  }

  /**
   * Returns the internal linklist contract.
   */
  get linklistContract(): LinklistAbi {
    return this.getLinklistContract(this._signerOrProvider)
  }

  protected getLinklistContract(
    signerOrProvider:
      | ethers.Signer
      | ethers.providers.Provider = this.getDefaultProvider(),
  ) {
    return LinklistAbi__factory.connect(
      this.options.linklistContractAddress,
      signerOrProvider,
    )
  }

  /**
   * Returns the internal newbie villa contract.
   * @category Internal Contract
   */
  get newbieVillaContract(): NewbieVillaAbi {
    return this.getNewbieVillaContract(this._signerOrProvider)
  }

  protected getNewbieVillaContract(
    signerOrProvider:
      | ethers.Signer
      | ethers.providers.Provider = this.getDefaultProvider(),
  ) {
    return NewbieVillaAbi__factory.connect(
      this.options.newbieVillaContractAddress,
      signerOrProvider,
    )
  }

  /**
   * This creates a new Contract instance to interact with.
   * @param providerOrPrivateKey - The provider or private key to connect to the contract.
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
    providerOrPrivateKey?:
      | ethers.providers.ExternalProvider
      | ethers.providers.JsonRpcFetchFunc
      | string,
    options?: Partial<ContractOptions>,
  ) {
    this._providerOrPrivateKey = providerOrPrivateKey
    this.options = this.initOptions(options)
    this._connect()
  }

  private _connect() {
    if (typeof this._providerOrPrivateKey === 'undefined') {
      const provider = this.getDefaultProvider()
      this._signerOrProvider = provider
    } else if (typeof this._providerOrPrivateKey === 'string') {
      const provider = this.getDefaultProvider()
      const wallet = new ethers.Wallet(this._providerOrPrivateKey, provider)
      this._signerOrProvider = wallet
    } else {
      const provider = this.getExternalProvider(this._providerOrPrivateKey)

      try {
        // @ts-ignore
        if (typeof this._providerOrPrivateKey.sendAsync !== 'function') {
          throw new Error('provider.sendAsync is not a function')
        }
        // @ts-ignore
        this._providerOrPrivateKey.sendAsync(
          { method: 'eth_requestAccounts', params: [] },
          () => {},
        )
      } catch (e) {
        // @ts-ignore
        if (typeof this._providerOrPrivateKey.request === 'function') {
          // @ts-ignore
          this._providerOrPrivateKey.request({
            method: 'eth_requestAccounts',
            params: [],
          })
        } else {
          throw new Error(
            'Provider does not support eth_requestAccounts and does not support send()',
          )
        }
      }
      this._signerOrProvider = provider.getSigner()
    }
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

  /**
   * Connects to the contract.
   * You need to call this before you can use the contract.
   * @category Basic
   * @deprecated You don't need to call this anymore.
   */
  async connect() {
    Logger.warn("connect() is deprecated. You don't need to call this anymore.")
  }

  protected parseLog<TopicName extends keyof typeof logTopics>(
    logs: ethers.providers.Log[],
    filterTopic: TopicName,
  ): LogEvents[(typeof logTopics)[TopicName]]
  protected parseLog<TopicName extends keyof typeof logTopics>(
    logs: ethers.providers.Log[],
    filterTopic: TopicName,
    {
      throwOnMultipleLogsFound,
      returnMultipleLogs,
    }: {
      throwOnMultipleLogsFound?: boolean
      returnMultipleLogs?: false
    },
  ): LogEvents[(typeof logTopics)[TopicName]]
  protected parseLog<TopicName extends keyof typeof logTopics>(
    logs: ethers.providers.Log[],
    filterTopic: TopicName,
    {
      throwOnMultipleLogsFound,
      returnMultipleLogs,
    }: {
      throwOnMultipleLogsFound?: boolean
      returnMultipleLogs?: true
    },
  ): LogEvents[(typeof logTopics)[TopicName]][]
  protected parseLog<TopicName extends keyof typeof logTopics>(
    logs: ethers.providers.Log[],
    filterTopic: TopicName,
    {
      throwOnMultipleLogsFound = true,
      returnMultipleLogs = false,
    }: {
      throwOnMultipleLogsFound?: boolean
      returnMultipleLogs?: boolean
    } = {},
  ):
    | LogEvents[(typeof logTopics)[TopicName]]
    | LogEvents[(typeof logTopics)[TopicName]][] {
    const targetTopicHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(logTopics[filterTopic]),
    )

    const _logs = logs.filter((log) => log.topics[0] === targetTopicHash)

    if (_logs.length === 0) {
      throw new Error(`Log with topic ${filterTopic} not found`)
    }

    if (throwOnMultipleLogsFound) {
      if (_logs.length > 1) {
        throw new Error(`More than one log with topic ${filterTopic} found`)
      }
    }

    if (returnMultipleLogs) {
      return _logs.map((log) =>
        this.contract.interface.parseLog(log),
      ) as unknown as LogEvents[(typeof logTopics)[TopicName]][]
    }

    const log = _logs[0]

    return this.contract.interface.parseLog(
      log,
    ) as unknown as LogEvents[(typeof logTopics)[TopicName]]
  }

  private getDefaultProvider():
    | ethers.providers.JsonRpcProvider
    | ethers.providers.Web3Provider {
    const addr = Network.getJsonRpcAddress()
    if (addr.startsWith('ws')) {
      // https://github.com/ChainSafe/web3.js/tree/1.x/packages/web3-providers-ws#usage
      const ws = new WebsocketProvider(addr, {
        timeout: 30_000,
        clientConfig: {
          keepalive: true,
          keepaliveInterval: 55_000,
          maxReceivedFrameSize: 1024 * 1000 * 500, // bytes - default: 1MiB
          maxReceivedMessageSize: 1024 * 1000 * 1000, // bytes - default: 8MiB
        },
        reconnect: {
          auto: true,
          delay: 5000,
          maxAttempts: 5,
          onTimeout: false,
        },
      })
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(ws)
      return provider
    } else {
      const provider = new ethers.providers.JsonRpcProvider(addr)
      provider.pollingInterval = 100
      return provider
    }
  }

  private getExternalProvider(
    externalProvider:
      | ethers.providers.ExternalProvider
      | ethers.providers.JsonRpcFetchFunc,
  ): ethers.providers.Web3Provider {
    const provider = new ethers.providers.Web3Provider(externalProvider)
    provider.pollingInterval = 100

    return provider
  }

  protected validateAddress(address: string | string[]) {
    if (Array.isArray(address)) {
      address.forEach((addr) => this.validateAddress(addr))
    } else {
      validateIsInSdn(address)
    }
  }

  //// module

  private _moduleResponseCache = undefined as MintOrLinkModule[] | undefined
  private _lastModuleResponseCacheTime = 0

  protected async getModules<T extends MintOrLinkModule['type']>({
    type,
  }: {
    type?: T
  } = {}): Promise<MintOrLinkModule<T>[]> {
    const now = Date.now()
    const isMoreThanOneMinute =
      now - this._lastModuleResponseCacheTime > 60 * 1000

    let res: MintOrLinkModule<T>[] = []
    if (!this._moduleResponseCache || isMoreThanOneMinute) {
      res = (await fetch(
        'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/deployments/modules.json',
      ).then((res) => res.json())) as MintOrLinkModule<T>[]
      this._moduleResponseCache = res
      this._lastModuleResponseCacheTime = now
    } else {
      res = this._moduleResponseCache as MintOrLinkModule<T>[]
    }

    if (type) {
      return res.filter((module) => module.type === type)
    }

    return res
  }

  protected async getModule(address: string) {
    const modules = await this.getModules()
    return modules.find((module) => isAddressEqual(module.address, address))
  }

  async getLinkModules() {
    return this.getModules({ type: 'link' })
  }

  async getLinkModule(address: string) {
    const modules = await this.getLinkModules()
    return modules.find(
      (module) =>
        isAddressEqual(module.address, address) && module.type === 'link',
    )
  }

  async getMintModules() {
    return this.getModules({ type: 'mint' })
  }

  async getMintModule(address: string) {
    const modules = await this.getMintModules()
    return modules.find(
      (module) =>
        isAddressEqual(module.address, address) && module.type === 'mint',
    )
  }

  protected async getModuleConfig(m?: MintOrLinkModuleConfig) {
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

    const initData = this.contract.interface._abiCoder.encode(
      module.initDataStructure.map((item) => item.type),
      m.data,
    )

    return {
      address: m.address,
      initData,
    }
  }

  async encodeModuleInitData(moduleAddress: string, data: any[]) {
    const module = await this.getModule(moduleAddress)
    if (!module) {
      throw new Error('Invalid module address ' + moduleAddress)
    }

    const result = this.contract.interface._abiCoder.encode(
      module.initDataStructure.map((item) => item.type),
      data,
    )

    return result
  }

  async decodeModuleInitData(moduleAddress: string, initData: string) {
    const module = await this.getModule(moduleAddress)
    if (!module) {
      throw new Error('Invalid module address ' + moduleAddress)
    }

    const result = this.contract.interface._abiCoder.decode(
      module.initDataStructure.map((item) => item.type),
      initData,
    )

    return result
  }
}
