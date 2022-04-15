export type IAvailableNetwork = 'rinkeby' | 'crossbell'

export class Network {
  static #CONTRACT_ROPSTEN = '0x30094AFd225BF4723B72c42748FdDe2D86cA3671'
  static #CONTRACT_CROSSBELL = '0x0' // TODO: mainnet is not supported yet

  static #currentNetwork: IAvailableNetwork = 'rinkeby'
  static readonly #availableNetworks: IAvailableNetwork[] = [
    'rinkeby',
    'crossbell',
  ]

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
      case 'rinkeby':
        return 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      case 'crossbell':
        return //
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
      case 'rinkeby':
        return this.#CONTRACT_ROPSTEN
      case 'crossbell':
        return this.#CONTRACT_CROSSBELL
      default:
        throw new Error(`Network ${this.getNetwork()} is not available`)
    }
  }
}
