import { NIL_ADDRESS } from '../utils'
import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type { Result, Character } from '../../types/contract'
import { CharacterMetadata } from '../../types/metadata'
import { Ipfs } from '../../ipfs'
import { type BigNumberish } from 'ethers'

export class CharacterContract extends BaseContract {
  /**
   * This creates a new character for an address, and returns the ID of the newly created character.
   * When the character is the first character created for an address, the address will be set as the primary character.
   * @category Character
   * @param owner - The Ethereum address of the character owner.
   * @param handle - The handle of the character you want to create.
   * @param metadataOrUri - The metadata or URI of the character.
   * @returns The transaction hash and the character ID.
   */
  @autoSwitchMainnet()
  async createCharacter(
    owner: string,
    handle: string,
    metadataOrUri: CharacterMetadata | string,
  ): Promise<Result<number, true>> | never {
    this.validateAddress(owner)
    this.validateHandleFormat(handle)

    const { uri } = await Ipfs.parseMetadataOrUri('character', metadataOrUri)

    const tx = await this.contract.createCharacter({
      to: owner,
      handle: handle,
      uri: uri,
      linkModule: NIL_ADDRESS,
      linkModuleInitData: NIL_ADDRESS, // TODO: ?
    })

    const receipt = await tx.wait()

    const parser = this.parseLog(receipt.logs, 'createCharacter')

    return {
      data: parser.args.characterId.toNumber(),
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This changes a character's handle.
   * @category Character
   * @param characterId - The character ID of the user you want to set the handle for.
   * @param handle - The handle you want to set.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async setHandle(
    characterId: BigNumberish,
    handle: string,
  ): Promise<Result<undefined, true>> | never {
    this.validateHandleFormat(handle)

    const tx = await this.contract.setHandle(characterId, handle)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets a character's metadata (URI).
   * @category Character
   * @param characterId - The character ID of the user you want to set the URI for.
   * @param metadataOrUri - The metadata or URI you want to set.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async setCharacterUri(
    characterId: BigNumberish,
    metadataOrUri: CharacterMetadata | string,
  ):
    | Promise<Result<{ uri: string; metadata: CharacterMetadata }, true>>
    | never {
    const { uri, metadata } = await Ipfs.parseMetadataOrUri(
      'character',
      metadataOrUri,
      true,
    )

    const tx = await this.contract.setCharacterUri(characterId, uri)
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
   * This is the same as {@link setCharacterUri}
   * @category Character
   */
  async setCharacterMetadata(
    characterId: BigNumberish,
    metadata: CharacterMetadata,
  ) {
    return this.setCharacterUri(characterId, metadata)
  }

  /**
   * This changes a character's metadata (URI).
   * @category Character
   * @param characterId - The character ID of the user you want to set the URI for.
   * @param modifier - The callback function that modifies the metadata.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   * @example change a character's metadata name and bio
   *
   * ```js
   * await contract.changeCharacterMetadata('42', metadata => {
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
   * @example change a character's metadata name and bio (using spread operator)
   *
   * ```js
   * await contract.changeCharacterMetadata('42', metadata => {
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
  async changeCharacterMetadata(
    characterId: BigNumberish,
    modifier: (metadata?: CharacterMetadata) => CharacterMetadata,
  ) {
    const character = await this.getCharacter(characterId)

    const metadata = modifier(character.data.metadata)
    if (typeof metadata === 'undefined') {
      throw new Error('The modified metadata is undefined. Did you return it?')
    }

    if (!metadata.type) {
      metadata.type = 'character'
    }

    return this.setCharacterMetadata(characterId, metadata)
  }

  /**
   * This sets the social token for a character
   * @category Character
   * @param characterId - The character ID of the user you want to set the social token for.
   * @param socialToken - The token address you want to set for the character.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async setSocialToken(
    characterId: BigNumberish,
    socialToken: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.setSocialToken(characterId, socialToken)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This sets the primary character ID for the user.
   * @category Character
   * @param characterId - The character ID of the character you want to set as primary.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async setPrimaryCharacterId(
    characterId: BigNumberish,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.setPrimaryCharacterId(characterId)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the primary character ID of the given address.
   * @category Character
   * @param address - The address of the user you want to get the primary character ID for.
   * @returns The characterId of the primary character of the address.
   */
  @autoSwitchMainnet()
  async getPrimaryCharacterId(
    address: string,
  ): Promise<Result<number>> | never {
    this.validateAddress(address)
    const characterId = await this.contract.getPrimaryCharacterId(address)
    return {
      data: characterId.toNumber(),
    }
  }

  /**
   * This returns a boolean indicating whether the characterId is a primary characterId of an address.
   * @category Character
   * @param characterId - The character ID of the character you want to check.
   * @returns A boolean value.
   */
  @autoSwitchMainnet()
  async isPrimaryCharacterId(
    characterId: BigNumberish,
  ): Promise<Result<boolean>> | never {
    const isPrimary = await this.contract.isPrimaryCharacter(characterId)
    return {
      data: isPrimary,
    }
  }

  /**
   * This returns a character given its handle.
   * @category Character
   * @param handle - The handle of the character you want to get the content of.
   * @returns The character with the given handle.
   */
  @autoSwitchMainnet()
  async getCharacterByHandle(
    handle: string,
  ): Promise<Result<Character>> | never {
    handle = handle.toLowerCase()

    const character = await this.contract.getCharacterByHandle(handle)

    const metadata = character.uri
      ? await Ipfs.uriToMetadata<CharacterMetadata>(character.uri)
      : undefined

    return {
      data: {
        characterId: character.characterId.toNumber(),
        handle: character.handle,
        uri: character.uri,
        metadata,
        socialToken: character.socialToken,
        noteCount: character.noteCount.toNumber(),
      },
    }
  }

  /**
   * This returns a character given its characterId.
   * @category Character
   * @param characterId - The character ID of the character you want to get.
   * @returns The character with the given characterId.
   */
  @autoSwitchMainnet()
  async getCharacter(
    characterId: BigNumberish,
  ): Promise<Result<Character>> | never {
    const character = await this.contract.getCharacter(characterId)

    const { metadata } = await Ipfs.parseMetadataOrUri(
      'character',
      character.uri,
      true,
    )

    return {
      data: {
        characterId: character.characterId.toNumber(),
        handle: character.handle,
        uri: character.uri,
        socialToken: character.socialToken,
        noteCount: character.noteCount.toNumber(),
        metadata,
      },
    }
  }

  /**
   * This returns the handle of a character.
   * @category Character
   * @param characterId - The characterId of the character you want to get the handle for.
   * @returns The handle of the character.
   */
  @autoSwitchMainnet()
  async getHandle(characterId: BigNumberish): Promise<Result<string>> | never {
    const handle = await this.contract.getHandle(characterId)
    return {
      data: handle,
    }
  }

  /**
   * This returns the URI of a character.
   * @category Character
   * @param characterId - The character ID of the character you want to get the URI for.
   * @returns The URI of the character.
   */
  @autoSwitchMainnet()
  async getCharacterUri(
    characterId: BigNumberish,
  ): Promise<Result<string>> | never {
    const uri = await this.contract.getCharacterUri(characterId)
    return {
      data: uri,
    }
  }

  /**
   * This returns the character given a {@link createCharacter} transaction hash.
   * @category Character
   * @param txHash - The transaction hash of the {@link createCharacter} transaction.
   * @returns The characterId of the character that was created.
   */
  @autoSwitchMainnet()
  async getCharacterByTransaction(
    txHash: string,
  ): Promise<Result<Character>> | never {
    const receipt = await this.contract.provider.getTransactionReceipt(txHash)

    const parser = this.parseLog(receipt.logs, 'createCharacter')

    const characterId = parser.args.characterId.toNumber()
    const result = await this.getCharacter(characterId)

    return result
  }

  /**
   * This checks if a character exists.
   * @category Character
   * @param address - The address of a user.
   * @returns A boolean indicating whether the character exists.
   */
  @autoSwitchMainnet()
  async existsCharacterForAddress(
    address: string,
  ): Promise<Result<boolean>> | never {
    this.validateAddress(address)
    const characterId = await this.contract.getPrimaryCharacterId(address)
    const exists = characterId.toString() !== '0'
    return {
      data: exists,
    }
  }

  /**
   * This checks if a character exists.
   * @category Character
   * @param handle - The handle of a character.
   * @returns A boolean indicating whether the character exists.
   */
  @autoSwitchMainnet()
  async existsCharacterForHandle(
    handle: string,
  ): Promise<Result<boolean>> | never {
    const data = await this.contract.getCharacterByHandle(handle)
    const exists = data.handle !== ''
    return {
      data: exists,
    }
  }

  /**
   * This validates if a handle is in a correct format.
   * @param handle - The handle of the character you want to get the social token for.
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
