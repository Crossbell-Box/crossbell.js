import { ethers } from 'ethers'
import { BaseContract } from './base'
import { autoSwitchMainnet } from '../decorators'
import { NIL_ADDRESS } from '../utils'
import type { Character, Result } from '../../types/contract'

export class LinkContract extends BaseContract {
  /**
   * This links a character to another character with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another character. Must be your own character, otherwise it will be rejected.
   * @param toCharacterId - The character ID of the character you want to link to.
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the character has one.
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkCharacter(
    fromCharacterId: string,
    toCharacterId: string,
    linkType: string,
    data?: string,
  ): Promise<Result<string, true>> | never {
    const tx = await this.contract.linkCharacter({
      fromCharacterId: fromCharacterId,
      toCharacterId: toCharacterId,
      linkType: ethers.utils.formatBytes32String(linkType),
      data: data ?? NIL_ADDRESS,
    })

    const receipt = await tx.wait()

    const parser = this.parseLog(receipt.logs, 'linkCharacter')

    return {
      data: parser.args.linklistId.toString(),
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This links a character to multiple characters with a given link type in batch.
   *
   * This could be considered a bulk version of {@link linkCharacter} & {@link createThenLinkCharacter}
   *
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another character. Must be your own character, otherwise it will be rejected.
   * @param toCharacterIds - The character IDs of the character you want to link to.
   * @param toAddresses - The addresses of the characters you want to link to (who don't have a character). See more on {@link createThenLinkCharacter}
   * @param linkType - The type of link.
   * @param data - The data to be passed to the link module if the character has one. It should has the same length as `toCharacterIds`.
   * @returns The linklist id and the transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async linkCharactersInBatch(
    fromCharacterId: string,
    toCharacterIds: string[],
    toAddresses: string[],
    linkType: string,
    data?: string[],
  ): Promise<Result<string, true>> | never {
    const tx = await this.peripheryContract.linkCharactersInBatch({
      fromCharacterId: fromCharacterId,
      toCharacterIds,
      toAddresses,
      linkType: ethers.utils.formatBytes32String(linkType),
      data: data ?? toCharacterIds.map(() => NIL_ADDRESS),
    })

    const receipt = await tx.wait()

    const parser = this.parseLog(receipt.logs, 'linkCharacter')

    return {
      data: parser.args.linklistId.toString(),
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This gets the linklist id of a {@link linkCharacter} transaction.
   * @category Link
   * @param txHash - The transaction hash of the transaction you want to get the linklist id of.
   * @returns The linklist id of the transaction.
   */
  @autoSwitchMainnet()
  async getLinklistIdByTransaction(
    txHash: string,
  ): Promise<Result<string>> | never {
    const receipt = await this.contract.provider.getTransactionReceipt(txHash)

    const parser = this.parseLog(receipt.logs, 'linkCharacter')

    return {
      data: parser.args.linklistId.toString(),
    }
  }

  /**
   * This creates a character for an target address and links the fromCharacter to it.
   *
   * This should be only called when the target address doesn't have any character.
   * When called on an address that already has a character, this will fail.
   * When called, this will create a new character for the target address
   * and set the new character as the primary character for this address.
   * The new character's handle will be set to the address of the target address.
   *
   * @category Link
   * @param fromCharacterId - The character ID of the character that is creating the new character. Must be your own character, otherwise it will be rejected.
   * @param toAddress - The address of the character you want to link to.
   * @param linkType - The type of link you want to create. This is a string.
   * @returns The transaction hash of the transaction that was sent to the blockchain, the toCharacterId and linklistId.
   */
  @autoSwitchMainnet()
  async createThenLinkCharacter(
    fromCharacterId: string,
    toAddress: string,
    linkType: string,
  ):
    | Promise<Result<{ toCharacterId: string; linklistId: string }, true>>
    | never {
    const tx = await this.contract.createThenLinkCharacter({
      fromCharacterId: fromCharacterId,
      to: toAddress,
      linkType: ethers.utils.formatBytes32String(linkType),
    })

    const receipt = await tx.wait()

    const createCharacterParser = this.parseLog(receipt.logs, 'createCharacter')
    const linkCharacterParser = this.parseLog(receipt.logs, 'linkCharacter')

    return {
      data: {
        toCharacterId: createCharacterParser.args.characterId.toString(),
        linklistId: linkCharacterParser.args.linklistId.toString(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This removes a link from a character to another character.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another character.
   * @param toCharacterId - The character you want to link to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  @autoSwitchMainnet()
  async unlinkCharacter(
    fromCharacterId: string,
    toCharacterId: string,
    linkType: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.unlinkCharacter({
      fromCharacterId: fromCharacterId,
      toCharacterId: toCharacterId,
      linkType: ethers.utils.formatBytes32String(linkType),
    })
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the *attached* linked character ID of a character with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character you want to get the linked characters from.
   * @param linkType - The type of link you want to get.
   * @returns An array of character ids that are linked to the character id passed in.
   */
  @autoSwitchMainnet()
  async getLinkingCharacterIds(
    fromCharacterId: string,
    linkType: string,
  ): Promise<Result<string[]>> | never {
    const linkList = await this.peripheryContract.getLinkingCharacterIds(
      fromCharacterId,
      ethers.utils.formatBytes32String(linkType),
    )
    return {
      data: linkList.map((link) => link.toNumber().toString()),
    }
  }

  /**
   * This returns the *attached* linked character of a character with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character you want to get the linked characters from.
   * @param linkType - The type of link you want to get.
   * @returns An array of character that are linked to the character id passed in.
   */
  @autoSwitchMainnet()
  async getLinkingCharacters(
    fromCharacterId: string,
    linkType: string,
  ): Promise<Result<Character[]>> | never {
    const ids = await this.peripheryContract.getLinkingCharacterIds(
      fromCharacterId,
      ethers.utils.formatBytes32String(linkType),
    )
    const characters = await Promise.all(
      /// @ts-ignore
      ids.map((ids) => this.getCharacter(ids.toString())),
    )
    return {
      data: characters.map((character) => character.data),
    }
  }

  /** link address */

  /**
   * This links a character to an address with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to the address.
   * @param toAddress - The address of the character you want to link to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain, and the linklistId.
   */
  // TODO: next version
  // async linkAddress(
  //   fromCharacterId: string,
  //   toAddress: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkAddress(
  //     fromCharacterId,
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
   * This links a character to any URI with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character that is linking to another character.
   * @param toUri - The URI of the character you want to link to.
   * @param linkType - The type of link you want to create. This is a string that you can define yourself.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  // TODO: next version
  // async linkAny(
  //   fromCharacterId: string,
  //   toUri: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkAny(fromCharacterId, toUri, linkType)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** link ERC721 token */

  /**
   * This links a character to an ERC721 token with a given link type.
   * @category Link
   * @param fromCharacterId - The character ID of the character you want to link from.
   * @param toTokenAddress - The address of the ERC721 token you want to link to.
   * @param toTokenId - The token ID of the ERC721 token you want to link to.
   * @param linkType - The type of link.
   * @returns The transaction hash of the transaction that was sent to the blockchain.
   */
  // TODO: next version
  // async linkErc721(
  //   fromCharacterId: string,
  //   toTokenAddress: string,
  //   toTokenId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkERC721(
  //     fromCharacterId,
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
  //   fromCharacterId: string,
  //   toNoteId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkNote(fromCharacterId, toNoteId, linkType)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** link link */

  // TODO: next version
  // async linkLink(
  //   fromCharacterId: string,
  //   toLinkId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkLink(fromCharacterId, {})
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  /** link linklist */

  // TODO: next version
  // async linkLinklist(
  //   fromCharacterId: string,
  //   toLinkListId: string,
  //   linkType: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.linkLinklist(fromCharacterId, {})
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
  //   fromCharacterId: string,
  //   uri: string, // Name: Atlas's follow links
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.setLinklistUri(fromCharacterId, uri)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  // TODO: next version
  // async getLinklistUri(
  //   fromCharacterId: string,
  //   linkType: string,
  // ): Promise<Result<string>> | never {
  //   const uri = await this.contract.getLinklistUri(fromCharacterId, linkType)
  //   return {
  //     data: uri,
  //     transactionHash: undefined,
  //   }
  // }

  /** other methods */

  // TODO: next version
  // async attachLinklist(
  //   characterId: string,
  //   linklistId: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.attachLinklist(characterId, linklistId) // will not overwrite and throw error if already attached a same type
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }

  // TODO: next version
  // async detachLinklist(
  //   characterId: string,
  //   linklistId: string,
  // ): Promise<Result<undefined>> | never {
  //   const tx = await this.contract.detachLinklist(characterId, linklistId)
  //   const receipt = await tx.wait()
  //   return {
  //     data: undefined,
  //     transactionHash: receipt.transactionHash,
  //   }
  // }
}
