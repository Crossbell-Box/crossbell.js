import { ethers } from 'ethers'
import { Mixin } from 'ts-mixer'
import { network } from '../network'
import { type Abi, Abi__factory } from './abi/types'
import { LinkContract } from './link'
import { ProfileContract } from './profile'

const Contracts = Mixin(ProfileContract, LinkContract)

export class Contract extends Contracts {
  private readonly CONTRACT_ROPSTEN =
    '0x773E3e94Fc4a7A5262e2fE366689B73415E58063'
  private readonly CONTRACT_CROSSBELL = '0x0' // TODO: mainnet is not supported yet

  protected readonly contract!: Abi

  constructor(
    providerOrPrivateKey:
      | ethers.providers.ExternalProvider
      | ethers.providers.JsonRpcFetchFunc
      | string,
  ) {
    super()

    const web3Provider =
      typeof providerOrPrivateKey === 'string'
        ? new ethers.Wallet(
            providerOrPrivateKey,
            new ethers.providers.JsonRpcProvider(network.getJsonRpcAddress()),
          )
        : new ethers.providers.Web3Provider(providerOrPrivateKey)

    this.contract = Abi__factory.connect(
      this.getContractAddress(),
      web3Provider,
    )
  }

  private getContractAddress() {
    switch (network.getNetwork()) {
      case 'ropsten':
        return this.CONTRACT_ROPSTEN
      case 'crossbell':
        return this.CONTRACT_CROSSBELL
      default:
        throw new Error(`Network ${network.getNetwork()} is not available`)
    }
  }
}
