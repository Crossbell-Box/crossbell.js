import { Mixin } from 'ts-mixer'
import { AttributesMetadata, BaseMetadata } from './base'

export class CharacterMetadata extends Mixin(BaseMetadata, AttributesMetadata) {
  /** The name of this character. */
  name?: string

  /**
   * The avatars of this character.
   * The first avatar is the primary avatar.
   *
   * @example
   * ['ipfs://Qm...', 'ipfs://Qm...']
   */
  avatars?: string[]

  /** The bio of this character. */
  bio?: string

  /**
   * The websites of this character.
   *
   * @example
   * ['https://example.com', 'https://example.org']
   */
  websites?: string[]

  /**
   * The banners of this character.
   *
   * @example
   * [{ address: 'ipfs://Qm...', mime_type: 'image/png' }]
   */
  banners?: {
    /**
     * The address (url) of this banner.
     */
    address: string

    /**
     * The mime type of this banner file.
     */
    mime_type: string
  }[]

  /**
   * The social links of this character. It should follow the csb:// scheme.
   *
   * The format is `csb://account:<identity>@<platform>`.
   *
   * @example
   * ['csb://account:someone@twitter', 'csb://account:someone@github']
   */
  connected_accounts?: string[]

  /**
   * The special connected avatars of this character. it should follow the csb:// scheme.
   *
   * Use case: use an NFT as avatar.
   *
   * The format is `csb://asset:<contract_address>-<token_id>@<network>`.
   *
   * @example
   * ['csb://asset:0x5452c7fb99d99fab3cc1875e9da9829cb50f7a13-753@ethereum']
   */
  connected_avatars?: string[]
}
