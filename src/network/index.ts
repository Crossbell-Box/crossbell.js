export type IAvailableNetwork = 'ropsten' | 'crossbell'

export class Network {
  #currentNetwork: IAvailableNetwork = 'ropsten'
  #availableNetworks: IAvailableNetwork[] = ['ropsten', 'crossbell']

  constructor() {}

  getNetwork() {
    return this.#currentNetwork
  }

  setNetwork(network: IAvailableNetwork) {
    if (this.#availableNetworks.includes(network)) {
      this.#currentNetwork = network
    } else {
      throw new Error(`Network ${network} is not available`)
    }
  }

  getJsonRpcAddress() {
    switch (this.#currentNetwork) {
      case 'ropsten':
        return 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      case 'crossbell':
        return //
      default:
        throw new Error(`Network ${this.#currentNetwork} is not available`)
    }
  }
}

export const network = new Network()
