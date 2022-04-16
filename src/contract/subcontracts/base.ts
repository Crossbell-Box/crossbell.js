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
  #providerOrPrivateKey:
    | ethers.providers.ExternalProvider
    | ethers.providers.JsonRpcFetchFunc
    | string
  #signer!: ethers.Signer

  protected _contract!: Abi

  protected get contract(): Abi {
    if (this._contract === undefined) {
      throw new Error('Contract not connected. Please call connect() first.')
    } else {
      return this._contract
    }
  }

  protected set contract(contract: Abi) {
    this._contract = contract
  }

  constructor(
    providerOrPrivateKey:
      | ethers.providers.ExternalProvider
      | ethers.providers.JsonRpcFetchFunc
      | string,
  ) {
    this.#providerOrPrivateKey = providerOrPrivateKey
  }

  async connect() {
    if (typeof this.#providerOrPrivateKey === 'string') {
      this.#signer = new ethers.Wallet(
        this.#providerOrPrivateKey,
        new ethers.providers.JsonRpcProvider(Network.getJsonRpcAddress()),
      )
    } else {
      const provider = new ethers.providers.Web3Provider(
        this.#providerOrPrivateKey,
      )
      await provider.send('eth_requestAccounts', [])
      this.#signer = provider.getSigner()
    }

    this.contract = Abi__factory.connect(
      Network.getContractAddress(),
      this.#signer,
    )
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
