import { type Address, type Chain, type WalletClient } from 'viem'

export type AvailableNetwork = 'crossbell'

export class Network {
  static readonly #CONTRACT_CROSSBELL =
    '0xa6f969045641Cf486a747A2688F3a5A6d43cd0D8'
  static readonly #CONTRACT_CROSSBELL_PERIPHERY =
    '0x96e96b7af62d628ce7eb2016d2c1d2786614ea73'
  static readonly #CONTRACT_NEWBIE_VILLA =
    '0xD0c83f0BB2c61D55B3d33950b70C59ba2f131caA'
  static readonly #CONTRACT_CBT = '0x3D1b588a6Bcd728Bb61570ced6656eA4C05e404f'
  static readonly #CONTRACT_TIPS = '0x0058be0845952D887D1668B5545de995E12e8783'
  static readonly #CONTRACT_MIRA = '0xAfB95CC0BD320648B3E8Df6223d9CDD05EbeDC64'
  static readonly #CONTRACT_LINKLIST =
    '0xFc8C75bD5c26F50798758f387B698f207a016b6A'

  static readonly #availableNetworks: AvailableNetwork[] = ['crossbell']
  static #currentNetwork: AvailableNetwork = 'crossbell'
  static #ipfsGateway = 'https://w3s.link/ipfs/'
  static jsonRpcAddress =
    // @ts-ignore
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
   * @param network - this is the network that you want to set the provider to.
   */
  static setNetwork(network: AvailableNetwork) {
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
  static getContractAddress(): Address {
    return this.#CONTRACT_CROSSBELL
  }

  /**
   * This returns the contract address of the peripheral contract
   * @returns The contract address of the peripheral contract
   */
  static getPeripheryContractAddress(): Address {
    return this.#CONTRACT_CROSSBELL_PERIPHERY
  }

  /**
   * This returns the contract address of the newbie villa contract
   * @returns The contract address of the newbie villa contract
   */
  static getNewbieVillaContractAddress(): Address {
    return this.#CONTRACT_NEWBIE_VILLA
  }

  static getCbtContractAddress(): Address {
    return this.#CONTRACT_CBT
  }

  /**
   * This returns the contract address of the tips contract
   * @returns The contract address of the tips contract
   */
  static getTipsContractAddress(): Address {
    return this.#CONTRACT_TIPS
  }

  /**
   * This returns the contract address of the mira contract
   * @returns The contract address of the mira contract
   */
  static getMiraContractAddress(): Address {
    return this.#CONTRACT_MIRA
  }

  /**
   * This returns the contract address of the linklist contract
   * @returns The contract address of the linklist contract
   */
  static getLinklistContractAddress(): Address {
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
      chainIdHex: `0x${(3737).toString(16)}` satisfies Address,
      rpc: 'https://rpc.crossbell.io',
      explorer: 'https://scan.crossbell.io',
      contract: this.#CONTRACT_CROSSBELL,
    } as const
  }

  static getChain() {
    return {
      name: 'Crossbell',
      network: 'crossbell',
      id: 3737,
      nativeCurrency: {
        name: 'CSB',
        symbol: 'CSB',
        decimals: 18,
      },
      rpcUrls: {
        public: { http: ['https://rpc.crossbell.io'] },
        default: { http: ['https://rpc.crossbell.io'] },
      },
      blockExplorers: {
        etherscan: { name: 'Crossbell', url: 'https://scan.crossbell.io' },
        default: { name: 'Crossbell', url: 'https://scan.crossbell.io' },
      },
      contracts: {
        multicall3: {
          address: this.#CONTRACT_CROSSBELL,
          blockCreated: 30548014,
        },
      },
    } as const satisfies Chain
  }

  /**
   * This checks if the current network is the Crossbell mainnet.
   * @param client - The provider to check if it's the Crossbell mainnet.
   * @returns A boolean value indicating if the current network is the Crossbell mainnet.
   */
  static async isCrossbellMainnet(client: WalletClient) {
    return (
      (await client.getChainId()) === this.getCrossbellMainnetInfo().chainId
    )
  }
}
