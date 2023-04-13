import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import type {
  Result,
  Character,
  Overrides,
  CallOverrides,
  MintOrLinkModuleConfig,
} from '../../types/contract'
import { CharacterMetadata } from '../../types/metadata'
import { Ipfs } from '../../ipfs'
import { Address } from 'viem'
import { parseLog, validateAddress } from '../../utils'

export class CharacterContract {
  constructor(private base: BaseContract) {}

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
    owner: Address,
    handle: string,
    metadataOrUri: CharacterMetadata | string,
    {
      linkModule,
    }: {
      linkModule?: MintOrLinkModuleConfig
    } = {},
    overrides: Overrides = {},
  ): Promise<Result<bigint, true>> | never {
    validateAddress(owner)
    this.validateHandleFormat(handle)

    const { uri } = await Ipfs.parseMetadataOrUri('character', metadataOrUri)

    const moduleConfig = await this.base.getModuleConfig(linkModule)

    const hash = await this.base.contract.write.createCharacter([
      {
        to: owner,
        handle: handle,
        uri: uri,
        linkModule: moduleConfig.address,
        linkModuleInitData: moduleConfig.initData,
      },
    ])

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash,
    })

    const parser = parseLog(receipt.logs, 'CharacterCreated')

    return {
      data: parser.args.characterId,
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
    characterId: bigint,
    handle: string,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    this.validateHandleFormat(handle)

    const tx = await this.base.contract.write.setHandle(
      [characterId, handle],
      // overrides,
    )
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })
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
    characterId: bigint,
    metadataOrUri: CharacterMetadata | string,
    overrides: Overrides = {},
  ):
    | Promise<Result<{ uri: string; metadata: CharacterMetadata }, true>>
    | never {
    const { uri, metadata } = await Ipfs.parseMetadataOrUri(
      'character',
      metadataOrUri,
      true,
    )

    const tx = await this.base.contract.write.setCharacterUri(
      [characterId, uri],
      // overrides
    )
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

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
    characterId: bigint,
    metadata: CharacterMetadata,
    overrides: Overrides = {},
  ) {
    return this.setCharacterUri(characterId, metadata, overrides)
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
    characterId: bigint,
    modifier: (metadata?: CharacterMetadata) => CharacterMetadata,
    overrides: Overrides = {},
  ) {
    const character = await this.getCharacter(characterId)

    const metadata = modifier(character.data.metadata)
    if (typeof metadata === 'undefined') {
      throw new Error('The modified metadata is undefined. Did you return it?')
    }

    if (!metadata.type) {
      metadata.type = 'character'
    }

    return this.setCharacterMetadata(characterId, metadata, overrides)
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
    characterId: bigint,
    socialToken: Address,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.setSocialToken(
      [characterId, socialToken],
      // overrides,
    )
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })
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
    characterId: bigint | number,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const hash = await this.base.contract.write.setPrimaryCharacterId(
      [BigInt(characterId)],
      // overrides
    )
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash,
    })
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This burns a character.
   * @category Character
   * @param characterId - The character ID of the character you want to burn.
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async burnCharacter(
    characterId: bigint,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.base.contract.write.burn(
      [characterId],
      // overrides
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

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
  async getPrimaryCharacterId(
    address: Address,
    overrides: CallOverrides = {},
  ): Promise<Result<bigint>> | never {
    validateAddress(address)

    const characterId = await this.base.contract.read.getPrimaryCharacterId(
      [address],
      // overrides,
    )

    return {
      data: characterId,
    }
  }

  /**
   * This returns a boolean indicating whether the characterId is a primary characterId of an address.
   * @category Character
   * @param characterId - The character ID of the character you want to check.
   * @returns A boolean value.
   */
  async isPrimaryCharacterId(
    characterId: bigint,
    overrides: CallOverrides = {},
  ): Promise<Result<boolean>> | never {
    const isPrimary = await this.base.contract.read.isPrimaryCharacter(
      [characterId],
      // overrides,
    )
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
  async getCharacterByHandle(
    handle: string,
    overrides: CallOverrides = {},
  ): Promise<Result<Character>> | never {
    handle = handle.toLowerCase()

    const character = await this.base.contract.read.getCharacterByHandle(
      [handle],
      // overrides,
    )

    const metadata = character.uri
      ? await Ipfs.uriToMetadata<CharacterMetadata>(character.uri)
      : undefined

    return {
      data: {
        characterId: character.characterId,
        handle: character.handle,
        uri: character.uri,
        metadata,
        socialToken: character.socialToken,
        noteCount: character.noteCount,
      },
    }
  }

  /**
   * This returns a character given its characterId.
   * @category Character
   * @param characterId - The character ID of the character you want to get.
   * @returns The character with the given characterId.
   */
  async getCharacter(
    characterId: bigint | number,
    overrides: CallOverrides = {},
  ): Promise<Result<Character>> | never {
    const character = await this.base.contract.read.getCharacter([
      BigInt(characterId),
    ])

    const { metadata } = await Ipfs.parseMetadataOrUri(
      'character',
      character.uri,
      true,
    )

    return {
      data: {
        characterId: character.characterId,
        handle: character.handle,
        uri: character.uri,
        socialToken: character.socialToken,
        noteCount: character.noteCount,
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
  async getHandle(
    characterId: bigint | number,
    overrides: CallOverrides = {},
  ): Promise<Result<string>> | never {
    const handle = await this.base.contract.read.getHandle(
      [BigInt(characterId)],
      // overrides
    )
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
  async getCharacterUri(
    characterId: bigint,
    overrides: CallOverrides = {},
  ): Promise<Result<string>> | never {
    const uri = await this.base.contract.read.getCharacterUri(
      [characterId],
      // overrides
    )
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
  async getCharacterByTransaction(
    txHash: Address,
    overrides: CallOverrides = {},
  ): Promise<Result<Character>> | never {
    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: txHash,
    })

    const parser = parseLog(receipt.logs, 'CharacterCreated')
    const result = await this.getCharacter(parser.args.characterId, overrides)

    return result
  }

  /**
   * This checks if a character exists.
   * @category Character
   * @param address - The address of a user.
   * @returns A boolean indicating whether the character exists.
   */
  async existsCharacterForAddress(
    address: Address,
    overrides: CallOverrides = {},
  ): Promise<Result<boolean>> | never {
    validateAddress(address)
    const characterId = await this.base.contract.read.getPrimaryCharacterId([
      address,
    ])

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
  async existsCharacterForHandle(
    handle: string,
    overrides: CallOverrides = {},
  ): Promise<Result<boolean>> | never {
    const data = await this.base.contract.read.getCharacterByHandle([handle])
    const exists = data.handle !== ''
    return {
      data: exists,
    }
  }

  /**
   * This withdraws a character from the Newbie Villa contract.
   * @category Character
   * @param toAddress - The address of the user that will receive the character.
   * @param characterId - The character ID of the character you want to withdraw.
   * @param nonce - The nonce given from the server
   * @param expires - The expiration time given from the server
   * @param proof - The proof given from the server
   * @returns The transaction hash.
   */
  @autoSwitchMainnet()
  async withdrawCharacterFromNewbieVilla(
    toAddress: Address,
    characterId: bigint,
    nonce: bigint,
    expires: bigint,
    proof: Address,
    overrides: Overrides = {},
  ): Promise<Result<undefined, true>> | never {
    validateAddress(toAddress)

    const tx = await this.base.newbieVillaContract.write.withdraw(
      [toAddress, characterId, nonce, expires, proof],
      // overrides,
    )

    const receipt = await this.base.publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
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
