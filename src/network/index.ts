import { ethers } from 'ethers'

export type IAvailableNetwork = 'rinkeby' | 'crossbell'

export class Network {
  static readonly #CONTRACT_CROSSBELL =
    '0xa6f969045641Cf486a747A2688F3a5A6d43cd0D8'

  static readonly #availableNetworks: IAvailableNetwork[] = ['crossbell']
  static #currentNetwork: IAvailableNetwork = 'crossbell'

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
    switch (this.#currentNetwork) {
      // case 'ropsten':
      //   return 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      // case 'rinkeby':
      //   return 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      case 'crossbell':
        return 'https://rpc.crossbell.io'
      default:
        throw new Error(`Network ${this.#currentNetwork} is not available`)
    }
  }

  /**
   * This returns the contract address of the network that the user is currently connected to
   * @returns The contract address for the network that is being used.
   */
  static getContractAddress() {
    switch (this.getNetwork()) {
      // case 'rinkeby':
      //   return this.#CONTRACT_ROPSTEN
      case 'crossbell':
        return this.#CONTRACT_CROSSBELL
      default:
        throw new Error(`Network ${this.getNetwork()} is not available`)
    }
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
