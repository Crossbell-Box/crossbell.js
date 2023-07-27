import {
  type CharacterMetadata,
  type LinkItemNote,
  type LinkItemType,
  type NoteEntity,
  type NoteMetadata,
} from '../../types'
import { type BaseIndexer } from './base'

export type BaseSigner = {
  signMessage: (msg: string) => Promise<string>
  getAddress: () => Promise<string | null>
}

export class SiweIndexer {
  constructor(private base: BaseIndexer) {}

  token: string | undefined

  async signIn(signer: BaseSigner): Promise<{ token: string }> {
    const address = await signer.getAddress()

    if (!address) throw new Error(`SignInError: invalid address ${address}`)

    const { message } = await this.base.fetch<{ message: string }>(
      '/siwe/challenge',
      {
        method: 'POST',
        data: {
          address,
          domain:
            (typeof window !== 'undefined' && window.location.host) ||
            'crossbell.io',
          uri:
            (typeof window !== 'undefined' && window.location.origin) ||
            'https://crossbell.io',
          statement: 'Sign in with Crossbell to the app.',
        },
      },
    )

    const { token } = await this.base.fetch<{ token: string }>('/siwe/login', {
      method: 'POST',
      data: {
        address,
        signature: await signer.signMessage(message),
      },
    })

    this.token = token
    return { token }
  }

  getAccount() {
    return this.base.fetch<{ address: string }>(`/siwe/account`, {
      method: 'GET',
      token: this.token,
    })
  }

  getBalance() {
    return this.base.fetch<{ balance: string }>(`/siwe/account/balance`, {
      method: 'GET',
      token: this.token,
    })
  }

  updateMetadata({
    mode = 'merge',
    characterId,
    metadata,
  }: {
    characterId: number
    mode?: 'merge' | 'replace'
    metadata: CharacterMetadata
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${characterId}/metadata`,
      {
        method: 'POST',
        token: this.token,
        data: { metadata, mode },
      },
    )
  }

  linkNote({
    fromCharacterId,
    noteId,
    characterId,
    linkType,
    data,
  }: {
    fromCharacterId: number
    characterId: number
    noteId: number
    linkType: string
    data?: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${fromCharacterId}/links/notes/${characterId}/${noteId}/${linkType}`,
      { method: 'PUT', token: this.token, data: { data } },
    )
  }

  unlinkNote({
    fromCharacterId,
    noteId,
    characterId,
    linkType,
  }: {
    fromCharacterId: number
    characterId: number
    noteId: number
    linkType: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${fromCharacterId}/links/notes/${characterId}/${noteId}/${linkType}`,
      { method: 'DELETE', token: this.token },
    )
  }

  linkCharacter({
    characterId,
    toCharacterId,
    linkType,
    data,
  }: {
    characterId: number
    toCharacterId: number
    linkType: string
    data?: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${characterId}/links/characters/${toCharacterId}/${linkType}`,
      { method: 'PUT', token: this.token, data: { data } },
    )
  }

  linkCharacters({
    characterId,
    toCharacterIds,
    toAddresses,
    linkType,
    data,
  }: {
    characterId: number
    toCharacterIds: number[]
    toAddresses: string[]
    linkType: string
    data?: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${characterId}/links/characters`,
      {
        method: 'PUT',
        token: this.token,
        data: { data, linkType, toCharacterIds, toAddresses },
      },
    )
  }

  unlinkCharacter({
    characterId,
    toCharacterId,
    linkType,
  }: {
    characterId: number
    toCharacterId: number
    linkType: string
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${characterId}/links/characters/${toCharacterId}/${linkType}`,
      { method: 'DELETE', token: this.token },
    )
  }

  putNote({
    characterId,
    ...body
  }: {
    characterId: number
    metadata: NoteMetadata
    linkItemType?: LinkItemType
    linkItem?: LinkItemNote
    locked?: boolean
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${characterId}/notes`,
      {
        method: 'PUT',
        token: this.token,
        data: body,
      },
    )
  }

  updateNote({
    characterId,
    noteId,
    metadata,
  }: {
    characterId: NoteEntity['characterId']
    noteId: NoteEntity['noteId']
    metadata: NoteMetadata
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${characterId}/notes/${noteId}/metadata`,
      {
        method: 'POST',
        token: this.token,
        data: { metadata },
      },
    )
  }

  deleteNote({
    characterId,
    noteId,
  }: {
    characterId: number
    noteId: NoteEntity['noteId']
  }) {
    return this.base.fetch<{ transactionHash: string; data: string }>(
      `/siwe/contract/characters/${characterId}/notes/${noteId}`,
      {
        method: 'DELETE',
        token: this.token,
      },
    )
  }

  mintNote({ characterId, noteId }: { characterId: number; noteId: number }) {
    return this.base.fetch<{
      transactionHash: string
      data: { contractAddress: string; tokenId: number }
    }>(`/siwe/contract/characters/${characterId}/notes/${noteId}/minted`, {
      method: 'PUT',
      token: this.token,
      data: {},
    })
  }
}
