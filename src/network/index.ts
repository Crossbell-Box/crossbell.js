import { ethers } from 'ethers'

export type IAvailableNetwork = 'crossbell'

// globalThis.process.env.CROSSBELL_RPC_ADDRESS = 'ws://137.184.70.176:8546' // TEST

export class Network {
  static readonly #CONTRACT_CROSSBELL =
    '0xa6f969045641Cf486a747A2688F3a5A6d43cd0D8'
  static readonly #CONTRACT_CROSSBELL_PERIPHERY =
    '0x96e96b7af62d628ce7eb2016d2c1d2786614ea73'

  static readonly #availableNetworks: IAvailableNetwork[] = ['crossbell']
  static #currentNetwork: IAvailableNetwork = 'crossbell'
  static #ipfsGateway = 'https://gateway.ipfs.io/ipfs/'
  static jsonRpcAddress =
    globalThis.process?.env.CROSSBELL_RPC_ADDRESS ?? 'https://rpc.crossbell.io'

  /**
   * This returns the current network.
   * @returns The current network
   */
  static getNetwork() {
    return this.#currentNetwork
  }

  /**
   * If the network passed in is available, set the current network to that network. If the network
   * passed in is not available, throw an error.
   * @param {IAvailableNetwork} network - this is the network that you want to set the provider to.
   */
  static setNetwork(network: IAvailableNetwork) {
    if (this.#availableNetworks.includes(network)) {
      this.#currentNetwork = network
    } else {
      throw new Error(`Network ${network} is not available`)
    }
  }

  /**
   * This returns the JSON-RPC address for the current network
   * @returns The address of the JSON RPC server for the current network.
   */
  static getJsonRpcAddress() {
    return this.jsonRpcAddress
  }

  /**
   * This returns the contract address of the main contract
   * @returns The contract address of the main contract
   */
  static getContractAddress() {
    return this.#CONTRACT_CROSSBELL
  }

  /**
   * This returns the contract address of the peripheral contract
   * @returns The contract address of the peripheral contract
   */
  static getPeripheryContractAddress() {
    return this.#CONTRACT_CROSSBELL_PERIPHERY
  }

  /**
   * This returns the IPFS gateway used for the metadata requests.
   * @default 'https://gateway.ipfs.io/ipfs/'
   * @returns The IPFS gateway.
   */
  static getIpfsGateway() {
    return this.#ipfsGateway
  }

  /**
   * This sets the IPFS gateway used for the metadata requests.
   * @default 'https://gateway.ipfs.io/ipfs/'
   * @param gateway - The IPFS gateway to use for the metadata requests.
   */
  static setIpfsGateway(gateway: string) {
    this.#ipfsGateway = gateway
  }

  /**
   * This returns an object with the properties of the Crossbell chain.
   * @returns An object with the properties of the Crossbell chain.
   */
  static getCrossbellMainnetInfo() {
    return {
      chainName: 'Crossbell',
      network: 'crossbell',
      chainId: 3737,
      tokenName: 'CSB',
      tokenSymbol: 'CSB',
      chainIdHex: '0x' + (3737).toString(16),
      rpc: 'https://rpc.crossbell.io',
      explorer: 'https://scan.crossbell.io',
      contract: this.#CONTRACT_CROSSBELL,
    }
  }

  /**
   * This checks if the current network is the Crossbell mainnet.
   * @param provider - The provider to check if it's the Crossbell mainnet.
   * @returns A boolean value indicating if the current network is the Crossbell mainnet.
   */
  static async isCrossbellMainnet(
    provider: ethers.providers.ExternalProvider | ethers.providers.Provider,
  ) {
    const { chainId } = this.getCrossbellMainnetInfo()
    if (
      provider instanceof ethers.providers.Web3Provider ||
      provider instanceof ethers.providers.Provider
    ) {
      return (await provider.getNetwork()).chainId === chainId
    } else {
      // ExternalProvider
      provider = new ethers.providers.Web3Provider(provider)
      return (await provider.getNetwork()).chainId === chainId
    }
  }

  /**
   * This adds the Crossbell chain to the wallet if it's not already there, and then switches to it.
   * @param provider - The provider that the wallet is connected to
   */
  static async switchToCrossbellMainnet(
    provider: ethers.providers.ExternalProvider | ethers.providers.Web3Provider,
  ) {
    if (provider instanceof ethers.providers.Web3Provider) {
      provider = provider.provider
    }

    if (typeof provider.request !== 'function') {
      throw new Error(
        'this provider does not follow EIP-1193 API signature. It does not have the provider.request function',
      )
    }

    const { chainIdHex, chainName, tokenName, tokenSymbol, rpc, explorer } =
      this.getCrossbellMainnetInfo()

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })
    } catch (e) {
      // if (e.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIdHex,
            chainName: chainName,
            nativeCurrency: {
              name: tokenName,
              symbol: tokenSymbol,
              decimals: 18,
            },
            rpcUrls: [rpc],
            blockExplorerUrls: [explorer],
          },
        ],
      })
      // }
    }
  }
}
