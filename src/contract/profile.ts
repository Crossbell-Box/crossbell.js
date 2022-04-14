import { NIL_ADDRESS } from './utils'
import type { ContractContext } from './abi/abi'

export class ProfileContract {
  protected readonly contract!: ContractContext

  /** profile */

  /**
   * This creates a new profile for an address, and returns the ID of the newly created profile.
   * @param {string} owner - The Ethereum address of the profile owner.
   * @param {string} handle - The handle of the profile you want to create.
   * @param {string} metadataURI - The URI of the metadata file.
   * @returns The transaction hash and the profile ID.
   */
  async createProfile(
    owner: string,
    handle: string,
    metadataURI: string,
  ): Promise<Result<string>> | never {
    const tx = await this.contract.createProfile({
      to: owner,
      handle: handle,
      metadataUri: metadataURI,
      linkModule: NIL_ADDRESS,
      linkModuleInitData: NIL_ADDRESS, // TODO: ?
    })
    const receipt = await tx.wait()
    return {
      data: parseInt(receipt.logs[1].topics[1] as string, 16).toString(), // TODO: a better way to parse logs? https://github.com/ethers-io/ethers.js/issues/487#issuecomment-919616975
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This changes a profile's handle.
   * @param {string} profileId - The profile ID of the user you want to set the handle for.
   * @param {string} handle - The handle you want to set.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  async setHandle(
    profileId: string,
    handle: string,
  ): Promise<Result<undefined>> | never {
    const tx = await this.contract.setHandle(profileId, handle)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This changes a profile's metadata URI.
   * @param profileId - The profile ID of the user you want to set the metadata URI for.
   * @param metadataUri - The metadata URI you want to set.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  async setProfileMetadataUri(
    profileId: string,
    metadataUri: string,
  ): Promise<Result<undefined>> | never {
    const tx = await this.contract.setProfileMetadataUri(profileId, metadataUri)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets the social token for a profile
   * @param {string} profileId - The profile ID of the user you want to set the social token for.
   * @param {string} socialToken - The token address you want to set for the profile.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  async setSocialToken(
    profileId: string,
    socialToken: string,
  ): Promise<Result<undefined>> | never {
    const tx = await this.contract.setSocialToken(profileId, socialToken)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets the primary profile ID for the user.
   * @param {string} profileId - The profile ID of the profile you want to set as primary.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  async setPrimaryProfileId(
    profileId: string,
  ): Promise<Result<undefined>> | never {
    const tx = await this.contract.setPrimaryProfileId(profileId)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the primary profile ID of the given address.
   * @param {string} address - The address of the user you want to get the primary profile ID for.
   * @returns The profileId of the primary profile of the address.
   */
  async getPrimaryProfileId(address: string): Promise<Result<string>> | never {
    const profileId = await this.contract.getPrimaryProfileId(address)
    return {
      data: profileId.toNumber().toString(),
    }
  }

  /**
   * This returns a boolean indicating whether the profileId is the primary profileId
   * @param {string} profileId - The profile ID of the profile you want to check.
   * @returns A boolean value.
   */
  async isPrimaryProfileId(
    profileId: string,
  ): Promise<Result<boolean>> | never {
    const isPrimary = await this.contract.isPrimaryProfile(profileId)
    return {
      data: isPrimary,
    }
  }

  /**
   * This returns the profile of a user given their handle.
   * @param {string} handle - string - The handle of the profile you want to get the content of.
   * @returns The profile of the profile with the given handle.
   */
  async getProfileByHandle(handle: string): Promise<Result<Profile>> | never {
    const profile = await this.contract.getProfileByHandle(handle)
    return {
      data: {
        handle: profile.handle,
        metadataUri: profile.metadataUri,
        socialToken: profile.socialToken,
        noteCount: profile.noteCount.toNumber(),
      },
    }
  }

  /**
   * This returns the handle and metadataUri of the profile from the given profileId.
   * @param {string} profileId - The profile ID of the profile you want to get.
   * @returns The handle and metadataUri of the profile.
   */
  async getProfile(profileId: string): Promise<Result<Profile>> | never {
    const profile = await this.contract.getProfile(profileId)
    return {
      data: {
        handle: profile.handle,
        metadataUri: profile.metadataUri,
        socialToken: profile.socialToken,
        noteCount: profile.noteCount.toNumber(),
      },
    }
  }

  /**
   * This returns the handle of a profile.
   * @param {string} profileId - The profileId of the profile you want to get the handle for.
   * @returns The handle of the profile.
   */
  async getHandle(profileId: string): Promise<Result<string>> | never {
    const handle = await this.contract.getHandle(profileId)
    return {
      data: handle,
    }
  }

  /**
   * This returns the metadata URI of a profile.
   * @param {string} profileId - The profile ID of the profile you want to get the metadata URI for.
   * @returns The metadata URI of the profile.
   */
  async getProfileMetadataUri(
    profileId: string,
  ): Promise<Result<string>> | never {
    const metadataUri = await this.contract.getProfileMetadataUri(profileId)
    return {
      data: metadataUri,
    }
  }
}
