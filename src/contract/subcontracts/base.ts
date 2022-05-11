import { ethers } from 'ethers'
import { Network } from '../../network'
import { type Abi, Abi__factory } from '../abi/types'

const logTopics = {
  linkProfile:
    '0xbc914995d574dd9ef2df364e4eee2b85deda3ba35d054a62425fba1b97275716',
  createProfile:
    '0xa5802a04162552328d75eaac538a033704a7c3beab65d0a83e52da1c8c9b7cdf',
} as const

export class BaseContract {
  private _providerOrPrivateKey?:
    | ethers.providers.ExternalProvider
    | ethers.providers.JsonRpcFetchFunc
    | string
  private _signerOrProvider!: ethers.Signer | ethers.providers.Provider

  private _contract!: Abi

  private _hasConnected: boolean = false

  protected get contract(): Abi {
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

    return this._contract
  }

  protected set contract(contract: Abi) {
    this._contract = contract
  }

  /**
   * This creates a new Contract instance to interact with.
   * @param providerOrPrivateKey - The provider or private key to connect to the contract.
   * @returns The Contract instance.
   *
   * @example Connect with Metamask
   * ```
   * import { Contract } from 'crossbell.js'
   * const provider = window.ethereum // the metamask provider
   * const contract = new Contract(provider)
   * ```
   *
   * @example Connect with Private Key
   * ```
   * import { Contract } from 'crossbell.js'
   * const privateKey = '0xabcdef0123456789012345678901234567890123456789012345678901234'
   * const contract = new Contract(privateKey)
   * ```
   *
   * @example Connect with a Readonly Contract
   * ```
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

    this.contract = Abi__factory.connect(
      Network.getContractAddress(),
      this._signerOrProvider,
    )

    this._hasConnected = true
  }

  protected parseLog<T>(
    logs: ethers.providers.Log[],
    filterTopic: keyof typeof logTopics,
  ) {
    const _logs = logs.filter((log) => log.topics[0] === logTopics[filterTopic])

    if (_logs.length === 0) {
      throw new Error(`Log with topic ${filterTopic} not found`)
    }

    if (_logs.length > 1) {
      throw new Error(`More than one log with topic ${filterTopic} found`)
    }

    const log = _logs[0]

    return this.contract.interface.parseLog(log) as unknown as T
  }

  private getDefaultProvider(): ethers.providers.JsonRpcProvider {
    const provider = new ethers.providers.JsonRpcProvider(
      Network.getJsonRpcAddress(),
    )
    provider.pollingInterval = 500

    return provider
  }

  private getExternalProvider(
    externalProvider:
      | ethers.providers.ExternalProvider
      | ethers.providers.JsonRpcFetchFunc,
  ): ethers.providers.Web3Provider {
    const provider = new ethers.providers.Web3Provider(externalProvider)
    provider.pollingInterval = 500

    return provider
  }
}
