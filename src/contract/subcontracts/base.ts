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
import { validateIsInSdn } from '../../utils/sdn'
import { Logger } from '../../utils/logger'

const logTopics = {
  createCharacter: 'CharacterCreated(uint256,address,address,string,uint256)',
  linkCharacter: 'LinkCharacter(address,uint256,uint256,bytes32,uint256)',
  linkNote: 'LinkNote(uint256,uint256,uint256,bytes32,uint256)',
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
  'PostNote(uint256,uint256,bytes32,bytes32,bytes)': PostNoteEvent
  'MintNote(address,uint256,uint256,address,uint256)': MintNoteEvent
  'Mint(uint256,uint256,uint256)': MintEvent
  'GrantOperatorPermissions(uint256,address,uint256)': GrantOperatorPermissionsEvent
  'GrantOperators4Note(uint256,uint256,address[],address[])': GrantOperators4NoteEvent
}

type ContractOptions = {
  entryContractAddress: string
  peripheryContractAddress: string
  cbtContractAddress?: string
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

  private _contract!: EntryAbi
  private _peripheryContract!: PeripheryAbi
  private _cbtContract!: CbtAbi
  private _newbieVillaContract!: NewbieVillaAbi
  private _tipsContract!: TipsAbi
  private _miraContract!: MiraAbi
  private _linklistContract!: LinklistAbi

  private _hasConnected: boolean = false

  protected options: ContractOptions

  /**
   * Returns the internal contract.
   * @category Internal Contract
   */
  get contract(): EntryAbi {
    this.checkConnection()

    return this._contract
  }

  set contract(contract: EntryAbi) {
    this._contract = contract
  }

  /**
   * Returns the internal periphery contract.
   * @category Internal Contract
   */
  get peripheryContract(): PeripheryAbi {
    this.checkConnection()

    return this._peripheryContract
  }

  set peripheryContract(contract: PeripheryAbi) {
    this._peripheryContract = contract
  }

  /**
   * Returns the internal cbt contract.
   * @category Internal Contract
   */
  get cbtContract(): CbtAbi {
    this.checkConnection()

    return this._cbtContract
  }

  set cbtContract(contract: CbtAbi) {
    this._cbtContract = contract
  }

  /**
   * Returns the internal cbt contract.
   */
  get tipsContract(): TipsAbi {
    this.checkConnection()

    return this._tipsContract
  }

  set tipsContract(contract: TipsAbi) {
    this._tipsContract = contract
  }

  /**
   * Returns the internal mira contract.
   */
  get miraContract(): MiraAbi {
    this.checkConnection()

    return this._miraContract
  }

  set miraContract(contract: MiraAbi) {
    this._miraContract = contract
  }

  /**
   * Returns the internal linklist contract.
   */
  get linklistContract(): LinklistAbi {
    this.checkConnection()

    return this._linklistContract
  }

  set linklistContract(contract: LinklistAbi) {
    this._linklistContract = contract
  }

  /**
   * Returns the internal newbie villa contract.
   * @category Internal Contract
   */
  get newbieVillaContract(): NewbieVillaAbi {
    this.checkConnection()

    return this._newbieVillaContract
  }

  set newbieVillaContract(contract: NewbieVillaAbi) {
    this._newbieVillaContract = contract
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
  }

  initOptions(options?: Partial<ContractOptions>): ContractOptions {
    return {
      entryContractAddress:
        options?.entryContractAddress ?? Network.getContractAddress(),
      peripheryContractAddress:
        options?.peripheryContractAddress ??
        Network.getPeripheryContractAddress(),
      cbtContractAddress: options?.cbtContractAddress,
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
   */
  async connect() {
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
        await provider.send('eth_requestAccounts', [])
      } catch (e) {
        Logger.warn(
          'Provider may not support eth_requestAccounts. Fallback to provider.enable()',
          e,
        )

        // @ts-ignore
        if (typeof this._providerOrPrivateKey.enable === 'function') {
          // @ts-ignore
          await this._providerOrPrivateKey.enable()
        } else {
          throw new Error(
            'Provider does not support eth_requestAccounts and does not support enable()',
          )
        }
      }
      this._signerOrProvider = provider.getSigner()
    }

    this.contract = EntryAbi__factory.connect(
      this.options.entryContractAddress,
      this._signerOrProvider,
    )

    this.peripheryContract = PeripheryAbi__factory.connect(
      this.options.peripheryContractAddress,
      this._signerOrProvider,
    )

    if (this.options.cbtContractAddress) {
      this.cbtContract = CbtAbi__factory.connect(
        this.options.cbtContractAddress,
        this._signerOrProvider,
      )
    }

    this._newbieVillaContract = NewbieVillaAbi__factory.connect(
      this.options.newbieVillaContractAddress,
      this._signerOrProvider,
    )

    this._tipsContract = TipsAbi__factory.connect(
      this.options.tipsContractAddress,
      this._signerOrProvider,
    )

    this._miraContract = MiraAbi__factory.connect(
      this.options.miraContractAddress,
      this._signerOrProvider,
    )

    this._linklistContract = LinklistAbi__factory.connect(
      this.options.linklistContractAddress,
      this._signerOrProvider,
    )

    this._hasConnected = true
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
      // @ts-ignore https://github.com/ChainSafe/web3.js/tree/1.x/packages/web3-providers-ws#usage
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

  private checkConnection() {
    if (!this._hasConnected) {
      throw new Error(
        'Contract not connected. Please call contract.connect() first.',
      )
    }

    // if (this._signerOrProvider instanceof ethers.providers.Web3Provider) {
    //   if (
    //     this._signerOrProvider.network.chainId !==
    //     Network.getCrossbellNetworkInfo().chainId
    //   ) {
    //     throw new Error(
    //       `Wrong network. Expected ${
    //         Network.getCrossbellNetworkInfo().chainId
    //       } but got ${this._signerOrProvider.network.chainId}`,
    //     )
    //   }
    // }
  }

  protected validateAddress(address: string | string[]) {
    if (Array.isArray(address)) {
      address.forEach((addr) => this.validateAddress(addr))
    } else {
      validateIsInSdn(address)
    }
  }
}
