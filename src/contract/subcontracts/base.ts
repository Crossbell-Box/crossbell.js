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
   */

  async connect() {
    if (typeof this._providerOrPrivateKey === 'undefined') {
      this._signerOrProvider = new ethers.providers.JsonRpcProvider(
        Network.getJsonRpcAddress(),
      )
    } else if (typeof this._providerOrPrivateKey === 'string') {
      this._signerOrProvider = new ethers.Wallet(
        this._providerOrPrivateKey,
        new ethers.providers.JsonRpcProvider(Network.getJsonRpcAddress()),
      )
    } else {
      const provider = new ethers.providers.Web3Provider(
        this._providerOrPrivateKey,
      )
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
    const log = logs.filter(
      (log) => log.topics[0] === logTopics[filterTopic],
    )[0]

    if (!log) {
      throw new Error(`Log with topic ${filterTopic} not found`)
    }

    return this.contract.interface.parseLog(log) as unknown as T
  }
}
