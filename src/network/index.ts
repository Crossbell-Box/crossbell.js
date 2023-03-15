import { ethers } from 'ethers'

export type IAvailableNetwork = 'crossbell'

export class Network {
  static readonly #CONTRACT_CROSSBELL =
    '0xa6f969045641Cf486a747A2688F3a5A6d43cd0D8'
  static readonly #CONTRACT_CROSSBELL_PERIPHERY =
    '0x96e96b7af62d628ce7eb2016d2c1d2786614ea73'
  static readonly #CONTRACT_NEWBIE_VILLA =
    '0xD0c83f0BB2c61D55B3d33950b70C59ba2f131caA'
  static readonly #CONTRACT_TIPS = '0x0058be0845952D887D1668B5545de995E12e8783'
  static readonly #CONTRACT_MIRA = '0xAfB95CC0BD320648B3E8Df6223d9CDD05EbeDC64'
  static readonly #CONTRACT_LINKLIST =
    '0xFc8C75bD5c26F50798758f387B698f207a016b6A'

  static readonly #availableNetworks: IAvailableNetwork[] = ['crossbell']
  static #currentNetwork: IAvailableNetwork = 'crossbell'
  static #ipfsGateway = 'https://w3s.link/ipfs/'
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
   * This returns the contract address of the newbie villa contract
   * @returns The contract address of the newbie villa contract
   */
  static getNewbieVillaContractAddress() {
    return this.#CONTRACT_NEWBIE_VILLA
  }

  /**
   * This returns the contract address of the tips contract
   * @returns The contract address of the tips contract
   */
  static getTipsContractAddress() {
    return this.#CONTRACT_TIPS
  }

  /**
   * This returns the contract address of the mira contract
   * @returns The contract address of the mira contract
   */
  static getMiraContractAddress() {
    return this.#CONTRACT_MIRA
  }

  /**
   * This returns the contract address of the linklist contract
   * @returns The contract address of the linklist contract
   */
  static getLinklistContractAddress() {
    return this.#CONTRACT_LINKLIST
  }

  /**
   * This returns the IPFS gateway used for the metadata requests.
   * @default 'https://w3s.link/ipfs/'
   * @deprecated this is not used anymore
   * @returns The IPFS gateway.
   */
  static getIpfsGateway() {
    return this.#ipfsGateway
  }

  /**
   * This sets the IPFS gateway used for the metadata requests.
   * @default 'https://w3s.link/ipfs/'
   * @deprecated this is not used anymore
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
