import { ethers } from 'ethers'
import { Network } from '../../network'
import WebsocketProvider from 'web3-providers-ws'
import {
  type Abi as EntryAbi,
  Abi__factory as EntryAbi__factory,
} from '../abis/entry/types'
import {
  LinkCharacterEvent,
  MintNoteEvent,
  PostNoteEvent,
  CharacterCreatedEvent,
  LinkNoteEvent,
  SetOperatorEvent,
} from '../abis/entry/types/Abi'
import {
  type Abi as PeripheryAbi,
  Abi__factory as PeripheryAbi__factory,
} from '../abis/periphery/types'
import { validateIsInSdn } from '../../utils/sdn'

const logTopics: Record<
  | 'createCharacter'
  | 'linkCharacter'
  | 'postNote'
  | 'mintNote'
  | 'linkNote'
  | 'setOperator',
  keyof EntryAbi['filters']
> = {
  createCharacter: 'CharacterCreated(uint256,address,address,string,uint256)',
  linkCharacter: 'LinkCharacter(address,uint256,uint256,bytes32,uint256)',
  linkNote: 'LinkNote(uint256,uint256,uint256,bytes32,uint256)',
  postNote: 'PostNote(uint256,uint256,bytes32,bytes32,bytes)',
  mintNote: 'MintNote(address,uint256,uint256,address,uint256)',
  setOperator: 'SetOperator(uint256,address,uint256)',
} as const

export class BaseContract {
  private _providerOrPrivateKey?:
    | ethers.providers.ExternalProvider
    | ethers.providers.JsonRpcFetchFunc
    | string
  private _signerOrProvider!: ethers.Signer | ethers.providers.Provider

  private _contract!: EntryAbi
  private _peripheryContract!: PeripheryAbi

  private _hasConnected: boolean = false

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
  ) {
    this._providerOrPrivateKey = providerOrPrivateKey
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
        console.warn(
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
      Network.getContractAddress(),
      this._signerOrProvider,
    )

    this.peripheryContract = PeripheryAbi__factory.connect(
      Network.getPeripheryContractAddress(),
      this._signerOrProvider,
    )

    this._hasConnected = true
  }

  connectWithExistedProvider(provider: ethers.providers.Provider) {
    this._signerOrProvider = provider
    this.contract = EntryAbi__factory.connect(
      Network.getContractAddress(),
      this._signerOrProvider,
    )

    this.peripheryContract = PeripheryAbi__factory.connect(
      Network.getPeripheryContractAddress(),
      this._signerOrProvider,
    )

    this._hasConnected = true
  }

  protected parseLog<T = SetOperatorEvent>(
    logs: ethers.providers.Log[],
    filterTopic: 'setOperator',
  ): T
  protected parseLog<T = MintNoteEvent>(
    logs: ethers.providers.Log[],
    filterTopic: 'mintNote',
  ): T
  protected parseLog<T = CharacterCreatedEvent>(
    logs: ethers.providers.Log[],
    filterTopic: 'createCharacter',
  ): T
  protected parseLog<T = LinkCharacterEvent>(
    logs: ethers.providers.Log[],
    filterTopic: 'linkCharacter',
  ): T
  protected parseLog<T = LinkNoteEvent>(
    logs: ethers.providers.Log[],
    filterTopic: 'linkNote',
  ): T
  protected parseLog<T = PostNoteEvent>(
    logs: ethers.providers.Log[],
    filterTopic: 'postNote',
  ): T
  protected parseLog<T>(
    logs: ethers.providers.Log[],
    filterTopic: keyof typeof logTopics,
  ): T {
    const targetTopicHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(logTopics[filterTopic]),
    )

    const _logs = logs.filter((log) => log.topics[0] === targetTopicHash)

    if (_logs.length === 0) {
      throw new Error(`Log with topic ${filterTopic} not found`)
    }

    if (_logs.length > 1) {
      throw new Error(`More than one log with topic ${filterTopic} found`)
    }

    const log = _logs[0]

    return this.contract.interface.parseLog(log) as unknown as T
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

  protected validateAddress(address: string) {
    validateIsInSdn(address)
  }
}
