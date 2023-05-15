import { type Address } from 'viem'
import {
  type Numberish,
  type CharacterMetadata,
  type EmailUserEntity,
  type LinkItemNote,
  type LinkItemType,
  type NoteEntity,
  type NoteMetadata,
} from '../../types'
import { type BaseIndexer } from './base'

export class NewbieIndexer {
  constructor(private base: BaseIndexer) {}

  token: string | undefined

  /**
   * Ask for a verify-code to be sent to an email box for registration
   *
   * @category Newbie
   */
  requestSignUpEmail(email: string) {
    const url = `/newbie/account/signup/email`
    return this.base.fetch<{ ok: boolean }>(url, {
      method: 'POST',
      data: { email },
    })
  }

  /**
   * Check if the verify-code is valid for email registration
   * @category Newbie
   */
  verifySignUpCode(email: string, code: string) {
    const url = `/newbie/account/signup/email/verify`
    return this.base.fetch<{ ok: boolean }>(url, {
      method: 'POST',
      data: { email, code },
    })
  }

  /**
   * Register an new email user
   * @category Newbie
   * @returns The token of the new user
   */
  async signUp(options: {
    email: string
    emailVerifyCode: string
    password: string
    characterName: string
  }) {
    const url = `/newbie/account/signup`
    const { token } = await this.base.fetch<{ token: string }>(url, {
      method: 'PUT',
      data: options,
    })
    this.token = token
    return token
  }

  /**
   * Log in as an email user
   * @category Newbie
   * @returns The token of the user
   */
  async signIn(email: string, password: string) {
    const url = `/newbie/account/signin`
    const { token } = await this.base.fetch<{ token: string }>(url, {
      method: 'POST',
      data: { email, password },
    })
    this.token = token
    return token
  }

  /**
   * Ask for a verify-code to be sent to an email box for password reset
   * @category Newbie
   */
  requestResetPasswordEmail(email: string) {
    const url = `/v1/newbie/account/reset-password/email`
    return this.base.fetch<{ ok: boolean }>(url, {
      method: 'POST',
      data: { email },
    })
  }

  /**
   * Check if the verify-code is valid for password reset
   * @category Newbie
   */
  verifyResetPasswordCode(email: string, code: string) {
    const url = `/newbie/account/reset-password/email/verify`
    return this.base.fetch<{ ok: boolean }>(url, {
      method: 'POST',
      data: { email, code },
    })
  }

  /**
   * Reset password
   * @category Newbie
   */
  resetPassword(options: {
    email: string
    emailVerifyCode: string
    password: string
  }) {
    const url = `/newbie/account/reset-password`
    return this.base.fetch<{ ok: boolean }>(url, {
      method: 'POST',
      data: options,
    })
  }

  /**
   * Get current user information
   */
  getAccount() {
    const url = `/newbie/account`
    return this.base.fetch<EmailUserEntity>(url, { token: this.token })
  }

  /**
   * Delete current user information
   */
  async deleteAccount() {
    const url = `/newbie/account`
    await this.base.fetch(url, { method: 'DELETE', token: this.token })
  }

  linkNote({
    noteId,
    characterId,
    linkType,
    data,
  }: {
    characterId: number
    noteId: number
    linkType: string
    data?: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/links/notes/${characterId}/${noteId}/${linkType}`,
      { method: 'PUT', data: { data }, token: this.token },
    )
  }

  unlinkNote({
    noteId,
    characterId,
    linkType,
  }: {
    characterId: number
    noteId: number
    linkType: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/links/notes/${characterId}/${noteId}/${linkType}`,
      { method: 'DELETE', token: this.token },
    )
  }

  linkCharacter({
    toCharacterId,
    linkType,
    data,
  }: {
    toCharacterId: number
    linkType: string
    data?: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/links/characters/${toCharacterId}/${linkType}`,
      { method: 'PUT', data: { data }, token: this.token },
    )
  }

  linkCharacters({
    toCharacterIds,
    toAddresses,
    linkType,
    data,
  }: {
    toCharacterIds: number[]
    toAddresses: string[]
    linkType: string
    data?: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/links/characters`,
      {
        method: 'PUT',
        data: { data, linkType, toCharacterIds, toAddresses },
        token: this.token,
      },
    )
  }

  unlinkCharacter({
    toCharacterId,
    linkType,
  }: {
    toCharacterId: number
    linkType: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/links/characters/${toCharacterId}/${linkType}`,
      { method: 'DELETE', token: this.token },
    )
  }

  putNote(data: {
    metadata: NoteMetadata
    linkItemType?: LinkItemType
    linkItem?: LinkItemNote
    locked?: boolean
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/notes`,
      { method: 'PUT', token: this.token, data },
    )
  }

  updateNote({
    noteId,
    metadata,
  }: {
    metadata: NoteMetadata
    noteId: NoteEntity['noteId']
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/notes/${noteId}/metadata`,
      { method: 'POST', token: this.token, data: { metadata } },
    )
  }

  deleteNote({ noteId }: { noteId: NoteEntity['noteId'] }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/notes/${noteId}`,
      { method: 'DELETE', token: this.token },
    )
  }

  /**
   * Refill the balance of csb (once per day)
   */
  refillBalance() {
    return this.base.fetch<
      { balance: string } | { ok: boolean; message: string }
    >(`/newbie/account/balance/refill`, { method: 'POST', token: this.token })
  }

  updateHandle(handle: string): Promise<{ ok: boolean; msg: string }> {
    return this.base.fetch('/newbie/contract/characters/me/handle', {
      method: 'POST',
      token: this.token,
      data: { handle },
    })
  }

  updateCharactersMetadata({
    metadata,
    mode = 'merge',
  }: {
    metadata: CharacterMetadata
    mode?: 'merge' | 'replace'
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/newbie/contract/characters/me/metadata`,
      {
        method: 'POST',
        data: { metadata, mode },
        token: this.token,
      },
    )
  }

  tipCharacter({
    characterId,
    amount,
  }: {
    characterId: Numberish
    /** amount to tip. (CSB in wei) */
    amount: Numberish
  }) {
    return this.base.fetch<{ transactionHash: string; data: boolean }>(
      `/newbie/contract/tips`,
      {
        method: 'POST',
        data: { characterId, amount },
        token: this.token,
      },
    )
  }

  tipCharacterForNote({
    characterId,
    noteId,
    amount,
  }: {
    characterId: Numberish
    noteId: Numberish
    /** amount to tip. (CSB in wei) */
    amount: Numberish
  }) {
    return this.base.fetch<{ transactionHash: string; data: boolean }>(
      `/newbie/contract/tips`,
      {
        method: 'POST',
        data: { characterId, noteId, amount },
        token: this.token,
      },
    )
  }

  /**
   * Get proofs for withdraw to call `withdraw` contract method on client
   */
  getWithdrawProof() {
    return this.base.fetch<{ proof: Address; nonce: number; expires: number }>(
      `/newbie/account/withdraw/proof`,
      { method: 'GET', token: this.token },
    )
  }
}
