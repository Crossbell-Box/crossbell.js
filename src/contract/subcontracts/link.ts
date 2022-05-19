import { ethers } from 'ethers'
import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import { NIL_ADDRESS } from '../utils'
import type { Profile, Result } from '../../types/contract'

export class LinkContract extends BaseContract {
  /**
   * This links a profile to another profile with a given link type.
   * @category Link
   * @param fromProfileId - The profile ID of the profile that is linking to another profile. Must be your own profile, otherwise it will be rejected.
   * @param toProfileId - The profile ID of the profile you want to link to.
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the profile has one.
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkProfile(
    fromProfileId: string,
    toProfileId: string,
    linkType: string,
    data?: string,
  ): Promise<Result<string, true>> | never {
    const tx = await this.contract.linkProfile({
      fromProfileId: fromProfileId,
      toProfileId: toProfileId,
      linkType: ethers.utils.formatBytes32String(linkType),
      data: data ?? NIL_ADDRESS,
    })

    const receipt = await tx.wait()

    const parser = this.parseLog(receipt.logs, 'linkProfile')

    return {
      data: parser.args.linklistId.toString(),
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This links a profile to multiple profiles with a given link type in batch.
   *
   * This could be considered a bulk version of {@link linkProfile} & {@link createThenLinkProfile}
   *
   * @category Link
   * @param fromProfileId - The profile ID of the profile that is linking to another profile. Must be your own profile, otherwise it will be rejected.
   * @param toProfileIds - The profile IDs of the profile you want to link to.
   * @param toAddresses - The addresses of the profiles you want to link to (who don't have a profile). See more on {@link createThenLinkProfile}
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the profile has one. It should has the same length as `toProfileIds`.
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkProfilesInBatch(
    fromProfileId: string,
    toProfileIds: string[],
    toAddresses: string[],
    linkType: string,
    data?: string[],
  ): Promise<Result<string, true>> | never {
    const tx = await this.peripheryContract.linkProfilesInBatch({
      fromProfileId: fromProfileId,
      toProfileIds,
      toAddresses,
      linkType: ethers.utils.formatBytes32String(linkType),
      data: data ?? toProfileIds.map(() => NIL_ADDRESS),
    })

    const receipt = await tx.wait()

    const parser = this.parseLog(receipt.logs, 'linkProfile')

    return {
      data: parser.args.linklistId.toString(),
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This gets the linklist id of a {@link linkProfile} transaction.
   * @category Link
   * @param txHash - The transaction hash of the transaction you want to get the linklist id of.
   * @returns The linklist id of the transaction.
   */
  @autoSwitchMainnet()
  async getLinklistIdByTransaction(
    txHash: string,
  ): Promise<Result<string>> | never {
    const receipt = await this.contract.provider.getTransactionReceipt(txHash)

    const parser = this.parseLog(receipt.logs, 'linkProfile')

    return {
      data: parser.args.linklistId.toString(),
    }
  }

  /**
   * This creates a profile for an target address and links the fromProfile to it.
   *
   * This should be only called when the target address doesn't have any profile.
   * When called on an address that already has a profile, this will fail.
   * When called, this will create a new profile for the target address
   * and set the new profile as the primary profile for this address.
   * The new profile's handle will be set to the address of the target address.
   *
   * @category Link
   * @param fromProfileId - The profile ID of the profile that is creating the new profile. Must be your own profile, otherwise it will be rejected.
   * @param toAddress - The address of the profile you want to link to.
   * @param linkType - The type of link you want to create. This is a string.
   * @returns The transaction hash of the transaction that was sent to the blockchain, the toProfileId and linklistId.
   */
  @autoSwitchMainnet()
  async createThenLinkProfile(
    fromProfileId: string,
    toAddress: string,
    linkType: string,
  ):
    | Promise<Result<{ toProfileId: string; linklistId: string }, true>>
    | never {
    const tx = await this.contract.createThenLinkProfile({
      fromProfileId: fromProfileId,
      to: toAddress,
      linkType: ethers.utils.formatBytes32String(linkType),
    })

    const receipt = await tx.wait()

    const createProfileParser = this.parseLog(receipt.logs, 'createProfile')
    const linkProfileParser = this.parseLog(receipt.logs, 'linkProfile')

    return {
      data: {
        toProfileId: createProfileParser.args.profileId.toString(),
        linklistId: linkProfileParser.args.linklistId.toString(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a profile to another profile.
   * @category Link
   * @param fromProfileId - The profile ID of the profile that is linking to another profile.
   * @param toProfileId - The profile you want to link to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkProfile(
    fromProfileId: string,
    toProfileId: string,
    linkType: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.unlinkProfile({
      fromProfileId: fromProfileId,
      toProfileId: toProfileId,
      linkType: ethers.utils.formatBytes32String(linkType),
    })
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the *attached* linked profile ID of a profile with a given link type.
   * @category Link
   * @param fromProfileId - The profile ID of the profile you want to get the linked profiles from.
   * @param linkType - The type of link you want to get.
   * @returns An array of profile ids that are linked to the profile id passed in.
   */
  @autoSwitchMainnet()
  async getLinkingProfileIds(
    fromProfileId: string,
    linkType: string,
  ): Promise<Result<string[]>> | never {
    const linkList = await this.contract.getLinkingProfileIds(
      fromProfileId,
      ethers.utils.formatBytes32String(linkType),
    )
    return {
      data: linkList.map((link) => link.toNumber().toString()),
    }
  }

  /**
   * This returns the *attached* linked profile of a profile with a given link type.
   * @category Link
   * @param fromProfileId - The profile ID of the profile you want to get the linked profiles from.
   * @param linkType - The type of link you want to get.
   * @returns An array of profile that are linked to the profile id passed in.
   */
  @autoSwitchMainnet()
  async getLinkingProfiles(
    fromProfileId: string,
    linkType: string,
  ): Promise<Result<Profile[]>> | never {
    const ids = await this.contract.getLinkingProfileIds(
      fromProfileId,
      ethers.utils.formatBytes32String(linkType),
    )
    const profiles = await Promise.all(
      /// @ts-ignore
      ids.map((ids) => this.getProfile(ids.toString())),
    )
    return {
      data: profiles.map((profile) => profile.data),
    }
  }

  /** link address */

  /**
   * This links a profile to an address with a given link type.
   * @category Link
   * @param fromProfileId - The profile ID of the profile that is linking to the address.
   * @param toAddress - The address of the profile you want to link to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain, and the linklistId.
   */
  // TODO: next version
  // async linkAddress(
  //   fromProfileId: string,
  //   toAddress: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkAddress(
  //     fromProfileId,
  //     toAddress,
  //     linkType,
  //   )
  //   const receipt = await tx.wait()
  //   const linklistId = receipt.logs[0].topics[4] as BigNumberish
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** link any */

  /**
   * This links a profile to any URI with a given link type.
   * @category Link
   * @param fromProfileId - The profile ID of the profile that is linking to another profile.
   * @param toUri - The URI of the profile you want to link to.
   * @param linkType - The type of link you want to create. This is a string that you can define yourself.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  // TODO: next version
  // async linkAny(
  //   fromProfileId: string,
  //   toUri: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkAny(fromProfileId, toUri, linkType)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** link ERC721 token */

  /**
   * This links a profile to an ERC721 token with a given link type.
   * @category Link
   * @param fromProfileId - The profile ID of the profile you want to link from.
   * @param toTokenAddress - The address of the ERC721 token you want to link to.
   * @param toTokenId - The token ID of the ERC721 token you want to link to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  // TODO: next version
  // async linkErc721(
  //   fromProfileId: string,
  //   toTokenAddress: string,
  //   toTokenId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkERC721(
  //     fromProfileId,
  //     toTokenAddress,
  //     toTokenId,
  //     linkType,
  //   )
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** link note */
  // TODO: next version
  // async linkNote(
  //   fromProfileId: string,
  //   toNoteId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkNote(fromProfileId, toNoteId, linkType)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** link link */

  // TODO: next version
  // async linkLink(
  //   fromProfileId: string,
  //   toLinkId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkLink(fromProfileId, {})
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** link linklist */

  // TODO: next version
  // async linkLinklist(
  //   fromProfileId: string,
  //   toLinkListId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkLinklist(fromProfileId, {})
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** mint */

  // TODO: next version
  // async mintLink(
  //   toAddress: string,
  //   toLinkId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.mintLink({}, toAddress)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** linklist uri */

  // TODO: next version
  // async setLinklistUri(
  //   fromProfileId: string,
  //   uri: string, // Name: Atlas's follow links
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.setLinklistUri(fromProfileId, uri)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  // TODO: next version
  // async getLinklistUri(
  //   fromProfileId: string,
  //   linkType: string,
  // ): Promise<Result<string>> | never {
  //   const uri = await this.contract.getLinklistUri(fromProfileId, linkType)
  //   return {
  //     data: uri,
  //     transactionHash: undefined,
  //   }
  // }

  /** other methods */

  // TODO: next version
  // async attachLinklist(
  //   profileId: string,
  //   linklistId: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.attachLinklist(profileId, linklistId) // will not overwrite and throw error if already attached a same type
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  // TODO: next version
  // async detachLinklist(
  //   profileId: string,
  //   linklistId: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.detachLinklist(profileId, linklistId)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }
}
