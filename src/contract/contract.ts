import { ethers } from 'ethers'
import { Mixin } from 'ts-mixer'
import { network } from '../network'
import { LinkContract } from './link'
import { ProfileContract } from './profile'
import type { ContractContext } from './abi/abi'
import abi from './abi/abi.json' // assert { type: 'json' } https://github.com/acornjs/acorn/issues/1111

const Contracts = Mixin(ProfileContract, LinkContract)

export class Contract extends Contracts {
  private readonly CONTACT_ROPSTEN =
    '0x16096669477Fa320660394E4ff6056b7b6849368'
  private readonly CONTACT_CROSSBELL = '0x0' // TODO: mainnet is not supported yet

  protected readonly contract!: ContractContext

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

    this.contract = new ethers.Contract(
      this.getContractAddress(),
      abi,
      web3Provider,
    ) as unknown as ContractContext
  }

  private getContractAddress() {
    switch (network.getNetwork()) {
      case 'ropsten':
        return this.CONTACT_ROPSTEN
      case 'crossbell':
        return this.CONTACT_CROSSBELL
      default:
        throw new Error(`Network ${network.getNetwork()} is not available`)
    }
  }
}
