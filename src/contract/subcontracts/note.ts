import { BaseContract } from './base'
import { Result } from '../types'
import { NIL_ADDRESS } from '../utils'

export class NoteContract extends BaseContract {
  /**
   * This returns the URI of a note.
   * @param {string} profileId - The profile ID of the user who owns the note.
   * @param {string} noteId - The id of the note you want to get the URI for.
   * @returns The URI of the note.
   */
  async getNoteUri(
    profileId: string,
    noteId: string,
  ): Promise<Result<string>> | never {
    const noteUri = await this.contract.getNoteUri(profileId, noteId)
    return {
      data: noteUri,
    }
  }

  /**
   * This creates a new note.
   * @param {string} profileId - The profile ID of the user who is posting the note.
   * @param {string} contentUri - The URI of the content you want to post.
   * @returns The id of the new note.
   */
  async postNote(
    profileId: string,
    contentUri: string,
  ): Promise<Result<undefined>> | never {
    const tx = await this.contract.postNote({
      profileId: profileId,
      contentUri: contentUri,
      linkModule: NIL_ADDRESS, // TODO:
      linkModuleInitData: NIL_ADDRESS,
      mintModule: NIL_ADDRESS,
      mintModuleInitData: NIL_ADDRESS,
    })
    const receipt = await tx.wait()
    return {
      data: undefined, // TODO: id of the new note
      transactionHash: receipt.transactionHash,
    }
  }

  async mintNote(
    profileId: string,
    noteId: string,
    toAddress: string, // TODO: what does this mean?
  ): Promise<Result<undefined>> | never {
    const tx = await this.contract.mintNote(profileId, noteId, toAddress)
    const receipt = await tx.wait()
    return {
      data: undefined,
      transactionHash: receipt.transactionHash,
    }
  }
}
