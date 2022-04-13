import { ethers } from 'ethers'
import { network } from '../../network'
import type { ContractContext } from './abi'
import abi from './abi.json' // assert { type: 'json' } https://github.com/acornjs/acorn/issues/1111

export class Web3Entry {
  private readonly WEB3ENTRY_CONTACT_ROPSTEN =
    '0x9CA85bD2c54A9A94CE3d8Fe6b40C01Da8277216F'
  private readonly WEB3ENTRY_CONTACT_CROSSBELL = '0x0' // TODO: mainnet is not supported yet

  private readonly contract!: ContractContext

  constructor(
    providerOrPrivateKey:
      | ethers.providers.ExternalProvider
      | ethers.providers.JsonRpcFetchFunc
      | string,
  ) {
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

  async createProfile(
    owner: string,
    handle: string,
    metadataURI: string,
  ): Promise<string | null> | never {
    const tx = await this.contract.createProfile(owner, handle, metadataURI)
    const receipt = await tx.wait()
    // TODO: return profile id
    return receipt.transactionHash
  }

  async setHandle(
    profileId: string,
    handle: string,
  ): Promise<string | null> | never {
    const tx = await this.contract.setHandle(profileId, handle)
    const receipt = await tx.wait()
    return receipt.transactionHash
  }

  async setProfileMetadataURI(
    profileId: string,
    metadataUri: string,
  ): Promise<string | null> | never {
    const tx = await this.contract.setProfileMetadataURI(profileId, metadataUri)
    const receipt = await tx.wait()
    return receipt.transactionHash
  }

  async setPrimaryProfile(profileId: string): Promise<string | null> | never {
    const tx = await this.contract.setPrimaryProfile(profileId)
    const receipt = await tx.wait()
    return receipt.transactionHash
  }

  async linkProfile(
    fromProfileId: string,
    toProfileId: string,
    linkType: string,
  ) {
    const tx = await this.contract.linkProfile(
      fromProfileId,
      toProfileId,
      linkType,
    )
    const receipt = await tx.wait()
    return receipt.transactionHash
  }

  async unlinkProfile(
    fromProfileId: string,
    toProfileId: string,
    linkType: string,
  ) {
    const tx = await this.contract.unlinkProfile(
      fromProfileId,
      toProfileId,
      linkType,
    )
    const receipt = await tx.wait()
    return receipt.transactionHash
  }

  async getPrimaryProfileId(address: string): Promise<string | null> | never {
    const profileId = await this.contract.getPrimaryProfile(address)
    return profileId.toString()
  }

  async getProfileIdByHandle(handle: string): Promise<string | null> | never {
    const profileId = await this.contract.getProfileIdByHandle(handle)
    return profileId.toString()
  }

  async getHandle(profileId: string): Promise<string | null> | never {
    const handle = await this.contract.getHandle(profileId)
    return handle
  }

  async getProfileMetadataURI(
    profileId: string,
  ): Promise<string | null> | never {
    const metadataUri = await this.contract.getProfileMetadataURI(profileId)
    return metadataUri
  }

  async getLinkListByProfile(
    profileId: string,
    linkType: string,
  ): Promise<string[] | null> | never {
    const linkList = await this.contract.getLinkListByProfile(
      profileId,
      linkType,
    )
    return linkList.map((link) => link.toString())
  }

  async getProfile2ProfileLinkItems(
    fromProfileId: string,
    linkType: string,
  ): Promise<string[] | null> | never {
    const linkList = await this.contract.getProfile2ProfileLinkItems(
      fromProfileId,
      linkType,
    )
    return linkList.map((link) => link.toString())
  }

  private getContractAddress() {
    switch (network.getNetwork()) {
      case 'ropsten':
        return this.WEB3ENTRY_CONTACT_ROPSTEN
      case 'crossbell':
        return this.WEB3ENTRY_CONTACT_CROSSBELL
      default:
        throw new Error(`Network ${network.getNetwork()} is not available`)
    }
  }
}
