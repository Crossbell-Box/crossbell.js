import type { ContractContext } from './abi/abi'

export class LinkContract {
  protected readonly contract!: ContractContext

  // setPrimaryLinklist
  // setLinklistUri
  // getLinklistUri
  // linkAddress
  // linkAny
  // linkERC721
  // linkLink
  // linkLinklist
  // linkNote
  // mintLink

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

  async getLinkModule(profileId: string): Promise<string | null> | never {
    const linkModule = await this.contract.getLinkModule4Profile(profileId)
    return linkModule
  }

  async getLinkedProfileIds(
    fromProfileId: string,
    linkType: string,
  ): Promise<string[] | null> | never {
    const linkList = await this.contract.getLinking2ProfileIds(
      fromProfileId,
      linkType,
    )
    return linkList.map((link) => link.toNumber().toString())
  }
}
