import { NIL_ADDRESS } from '../utils'
import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Result, Profile } from '../../types/contract'
import { ProfileMetadata } from '../../types/metadata'
import { Ipfs } from '../../ipfs'

export class ProfileContract extends BaseContract {
  /**
   * This creates a new profile for an address, and returns the ID of the newly created profile.
   * When the profile is the first profile created for an address, the address will be set as the primary profile.
   * @category Profile
   * @param owner - The Ethereum address of the profile owner.
   * @param handle - The handle of the profile you want to create.
   * @param metadataOrUri - The metadata or URI of the profile.
   * @returns The transaction hash and the profile ID.
   */
  @autoSwitchMainnet()
  async createProfile(
    owner: string,
    handle: string,
    metadataOrUri: ProfileMetadata | string,
  ): Promise<Result<string, true>> | never {
    this.validateHandleFormat(handle)

    const { uri } = await Ipfs.parseMetadataOrUri<ProfileMetadata>(
      metadataOrUri,
    )

    const tx = await this.contract.createProfile({
      to: owner,
      handle: handle,
      uri: uri,
      linkModule: NIL_ADDRESS,
      linkModuleInitData: NIL_ADDRESS, // TODO: ?
    })

    const receipt = await tx.wait()

    const parser = this.parseLog(receipt.logs, 'createProfile')

    return {
      data: parser.args.profileId.toString(),
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This changes a profile's handle.
   * @category Profile
   * @param profileId - The profile ID of the user you want to set the handle for.
   * @param handle - The handle you want to set.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async setHandle(
    profileId: string,
    handle: string,
  ): Promise<Result<undefined, true>> | never {
    this.validateHandleFormat(handle)

    const tx = await this.contract.setHandle(profileId, handle)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets a profile's metadata (URI).
   * @category Profile
   * @param profileId - The profile ID of the user you want to set the URI for.
   * @param metadataOrUri - The URI you want to set.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async setProfileUri(
    profileId: string,
    metadataOrUri: ProfileMetadata | string,
  ):
    | Promise<
        Result<
          {
            uri: string
            metadata: ProfileMetadata
          },
          true
        >
      >
    | never {
    const { uri, metadata } = await Ipfs.parseMetadataOrUri<ProfileMetadata>(
      metadataOrUri,
      true,
    )

    const tx = await this.contract.setProfileUri(profileId, uri)
    const receipt = await tx.wait()

    return {
      data: {
        uri,
        metadata,
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This is the same as {@link setProfileUri}
   * @category Profile
   */
  async setProfileMetadata(profileId: string, metadata: ProfileMetadata) {
    return this.setProfileUri(profileId, metadata)
  }

  /**
   * This changes a profile's metadata (URI).
   * @category Profile
   * @param profileId - The profile ID of the user you want to set the URI for.
   * @param modifier - The callback function that modifies the metadata.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   * @example change a profile's metadata name and bio
   *
   * ```js
   * await contract.changeProfileMetadata('42', metadata => {
   *   if (metadata !== undefined) {
   *     metadata.name = 'John Doe'
   *     metadata.bio = 'I am a person'
   *   } else {
   *     metadata = {
   *       name: 'John Doe',
   *       bio: 'I am a person',
   *     }
   *   }
   *   return metadata
   * })
   * ```
   *
   * @example change a profile's metadata name and bio (using spread operator)
   *
   * ```js
   * await contract.changeProfileMetadata('42', metadata => {
   *   metadata = {
   *     ...metadata,
   *     name: 'John Doe',
   *     bio: 'I am a person',
   *   }
   *   return metadata
   * })
   * ```
   */
  @autoSwitchMainnet()
  async changeProfileMetadata(
    profileId: string,
    modifier: (metadata?: ProfileMetadata) => ProfileMetadata,
  ) {
    const profile = await this.getProfile(profileId)

    const metadata = modifier(profile.data.metadata)
    if (typeof metadata === 'undefined') {
      throw new Error('The modified metadata is undefined. Did you return it?')
    }

    if (!metadata.type) {
      metadata.type = 'profile'
    }

    return this.setProfileMetadata(profileId, metadata)
  }

  /**
   * This sets the social token for a profile
   * @category Profile
   * @param profileId - The profile ID of the user you want to set the social token for.
   * @param socialToken - The token address you want to set for the profile.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async setSocialToken(
    profileId: string,
    socialToken: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.setSocialToken(profileId, socialToken)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets the primary profile ID for the user.
   * @category Profile
   * @param profileId - The profile ID of the profile you want to set as primary.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async setPrimaryProfileId(
    profileId: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.setPrimaryProfileId(profileId)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the primary profile ID of the given address.
   * @category Profile
   * @param address - The address of the user you want to get the primary profile ID for.
   * @returns The profileId of the primary profile of the address.
   */
  @autoSwitchMainnet()
  async getPrimaryProfileId(address: string): Promise<Result<string>> | never {
    const profileId = await this.contract.getPrimaryProfileId(address)
    return {
      data: profileId.toNumber().toString(),
    }
  }

  /**
   * This returns a boolean indicating whether the profileId is a primary profileId of an address.
   * @category Profile
   * @param profileId - The profile ID of the profile you want to check.
   * @returns A boolean value.
   */
  @autoSwitchMainnet()
  async isPrimaryProfileId(
    profileId: string,
  ): Promise<Result<boolean>> | never {
    const isPrimary = await this.contract.isPrimaryProfile(profileId)
    return {
      data: isPrimary,
    }
  }

  /**
   * This returns a profile given its handle.
   * @category Profile
   * @param handle - The handle of the profile you want to get the content of.
   * @returns The profile with the given handle.
   */
  @autoSwitchMainnet()
  async getProfileByHandle(handle: string): Promise<Result<Profile>> | never {
    handle = handle.toLowerCase()

    const profile = await this.contract.getProfileByHandle(handle)

    const metadata = profile.uri
      ? await Ipfs.uriToMetadata<ProfileMetadata>(profile.uri)
      : undefined

    return {
      data: {
        profileId: profile.profileId.toNumber().toString(),
        handle: profile.handle,
        uri: profile.uri,
        metadata,
        socialToken: profile.socialToken,
        noteCount: profile.noteCount.toNumber(),
      },
    }
  }

  /**
   * This returns a profile given its profileId.
   * @category Profile
   * @param profileId - The profile ID of the profile you want to get.
   * @returns The profile with the given profileId.
   */
  @autoSwitchMainnet()
  async getProfile(profileId: string): Promise<Result<Profile>> | never {
    const profile = await this.contract.getProfile(profileId)

    const { metadata } = await Ipfs.parseMetadataOrUri<ProfileMetadata>(
      profile.uri,
      true,
    )

    return {
      data: {
        profileId: profile.profileId.toNumber().toString(),
        handle: profile.handle,
        uri: profile.uri,
        socialToken: profile.socialToken,
        noteCount: profile.noteCount.toNumber(),
        metadata,
      },
    }
  }

  /**
   * This returns the handle of a profile.
   * @category Profile
   * @param profileId - The profileId of the profile you want to get the handle for.
   * @returns The handle of the profile.
   */
  @autoSwitchMainnet()
  async getHandle(profileId: string): Promise<Result<string>> | never {
    const handle = await this.contract.getHandle(profileId)
    return {
      data: handle,
    }
  }

  /**
   * This returns the URI of a profile.
   * @category Profile
   * @param profileId - The profile ID of the profile you want to get the URI for.
   * @returns The URI of the profile.
   */
  @autoSwitchMainnet()
  async getProfileUri(profileId: string): Promise<Result<string>> | never {
    const uri = await this.contract.getProfileUri(profileId)
    return {
      data: uri,
    }
  }

  /**
   * This returns the profile given a {@link createProfile} transaction hash.
   * @category Profile
   * @param txHash - The transaction hash of the {@link createProfile} transaction.
   * @returns The profileId of the profile that was created.
   */
  @autoSwitchMainnet()
  async getProfileByTransaction(
    txHash: string,
  ): Promise<Result<Profile>> | never {
    const receipt = await this.contract.provider.getTransactionReceipt(txHash)

    const parser = this.parseLog(receipt.logs, 'createProfile')

    const profileId = parser.args.profileId.toString()
    const result = await this.getProfile(profileId)

    return result
  }

  /**
   * This checks if a profile exists.
   * @category Profile
   * @param address - The address of a user.
   * @returns A boolean indicating whether the profile exists.
   */
  @autoSwitchMainnet()
  async existsProfileForAddress(
    address: string,
  ): Promise<Result<boolean>> | never {
    const profileId = await this.contract.getPrimaryProfileId(address)
    const exists = profileId.toString() !== '0'
    return {
      data: exists,
    }
  }

  /**
   * This checks if a profile exists.
   * @category Profile
   * @param handle - The handle of a profile.
   * @returns A boolean indicating whether the profile exists.
   */
  @autoSwitchMainnet()
  async existsProfileForHandle(
    handle: string,
  ): Promise<Result<boolean>> | never {
    const data = await this.contract.getProfileByHandle(handle)
    const exists = data.handle !== ''
    return {
      data: exists,
    }
  }

  /**
   * This validates if a handle is in a correct format.
   * @param handle - The handle of the profile you want to get the social token for.
   */
  private validateHandleFormat(handle: string): void | never {
    if (handle.length >= 32 || handle.length <= 2) {
      throw new Error(
        `Invalid handle: handle must be between 3 and 31 characters.`,
      )
    }

    if (!/^[a-z0-9\-\_]+$/.test(handle)) {
      throw new Error(`Invalid handle: handle must only contain [a-z0-9-_].`)
    }
  }
}
