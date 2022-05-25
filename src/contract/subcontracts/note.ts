import { ethers } from 'ethers'
import { BaseContract } from './base'
import { Result, Note, NoteMetadata } from '../../types'
import { Ipfs } from '../../ipfs'
import { NIL_ADDRESS } from '../utils'
import { autoSwitchMainnet } from '../decorators'

export class NoteContract extends BaseContract {
  /**
   * This creates a new note.
   * @category Note
   * @param profileId - The profile ID of the owner who post this note. Must be your own profile, otherwise it will be rejected.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postNote(
    profileId: string,
    metadataOrUri: NoteMetadata | string,
  ): Promise<Result<{ noteId: string }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const tx = await this.contract.postNote({
      profileId: profileId,
      contentUri: uri,
      linkModule: NIL_ADDRESS, // TODO:
      linkModuleInitData: NIL_ADDRESS,
      mintModule: NIL_ADDRESS,
      mintModuleInitData: NIL_ADDRESS,
    })

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'postNote')

    return {
      data: {
        noteId: log.args.noteId.toNumber().toString(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This creates a new note for any target uri.
   * @category Note
   * @param profileId - The profile ID of the owner who post this note. Must be your own profile, otherwise it will be rejected.
   * @param metadataOrUri - The metadata or URI of the content you want to post.
   * @returns The id of the new note.
   */
  @autoSwitchMainnet()
  async postNoteForAnyUri(
    profileId: string,
    metadataOrUri: NoteMetadata | string,
    targetUri: string,
  ): Promise<Result<{ noteId: string }, true>> | never {
    const { uri } = await Ipfs.parseMetadataOrUri('note', metadataOrUri)

    const tx = await this.contract.postNote4AnyUri(
      {
        profileId: profileId,
        contentUri: uri,
        linkModule: NIL_ADDRESS, // TODO:
        linkModuleInitData: NIL_ADDRESS,
        mintModule: NIL_ADDRESS,
        mintModuleInitData: NIL_ADDRESS,
      },
      targetUri,
    )

    const receipt = await tx.wait()

    const log = this.parseLog(receipt.logs, 'postNote')

    return {
      data: {
        noteId: log.args.noteId.toNumber().toString(),
      },
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This returns the info of a note.
   * @category Note
   * @param profileId - The profile ID of the address who owns the note.
   * @param noteId - The id of the note you want to get the info for.
   * @returns The info of the note.
   */
  @autoSwitchMainnet()
  async getNote(
    profileId: string,
    noteId: string,
  ): Promise<Result<Note>> | never {
    const data = await this.contract.getNote(profileId, noteId)

    const linkItemTypeString = ethers.utils.parseBytes32String(
      data.linkItemType,
    )
    const linkItemType =
      linkItemTypeString === ''
        ? undefined
        : (linkItemTypeString as Note['linkItemTypeString'])

    const metadata = data.contentUri
      ? await Ipfs.uriToMetadata<NoteMetadata>(data.contentUri)
      : undefined

    return {
      data: {
        profileId: profileId,
        noteId: noteId,
        contentUri: data.contentUri,
        metadata,
        linkItemType: data.linkItemType,
        linkItemTypeString: linkItemType,
        linkKey: data.linkKey,
        linkModule: data.linkModule,
        mintNFT: data.mintNFT,
        mintModule: data.mintModule,
        deleted: data.deleted,
      },
    }
  }

  /**
   * This deletes a note.
   *
   * Note: This only changes the note's `deleted` property to `true`. It can't really be deleted from the blockchain.
   *
   * @category Note
   * @param profileId - The profile ID of the owner who post this note. Must be your own profile, otherwise it will be rejected.
   * @param noteId - The id of the note you want to delete.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async deleteNote(
    profileId: string,
    noteId: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.deleteNote(profileId, noteId)

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  /**
   * This mints a note as an NFT.
   * @category Note
   * @param profileId - The profile ID of the address who owns the note.
   * @param noteId - The id of the note you want to get the info for.
   * @param toAddress - The address you want to mint the note to.
   * @returns The transaction hash of the transaction.
   */
  @autoSwitchMainnet()
  async mintNote(
    profileId: string,
    noteId: string,
    toAddress: string,
  ): Promise<Result<undefined, true>> | never {
    const tx = await this.contract.mintNote({
      profileId: profileId,
      noteId: noteId,
      to: toAddress,
      mintModuleData: NIL_ADDRESS,
    })

    const receipt = await tx.wait()

    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }

  getLinkKeyForProfile(toProfileId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint'],
      ['Profile', toProfileId],
    )
  }

  getLinkKeyForAddress(toAddress: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'address'],
      ['Address', toAddress],
    )
  }

  getLinkKeyForNote(toProfileId: string, toNoteId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint', 'uint'],
      ['Note', toProfileId, toNoteId],
    )
  }

  getLinkKeyForERC721(toContractAddress: string, toTokenId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'address', 'uint'],
      ['ERC721', toContractAddress, toTokenId],
    )
  }

  getLinkKeyForLinklist(toLinkListId: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'uint'],
      ['Linklist', toLinkListId],
    )
  }

  getLinkKeyForAnyUri(toUri: string): string {
    return ethers.utils.solidityKeccak256(
      ['string', 'string'],
      ['AnyUri', toUri],
    )
  }
}
