import { type Hex } from 'viem'
import { type EIP1193Provider } from 'eip1193-types'
import {
  BaseContract,
  CbtContract,
  CharacterContract,
  type ContractOptions,
  CsbContract,
  LinkContract,
  LinkModuleContract,
  MintModuleContract,
  NoteContract,
  OperatorContract,
  RevisionContract,
  TipsContract,
} from './subcontracts'
import { TipsWithFeeContract } from './subcontracts/tips_with_fee'

/**
 * This class is used to interact with the contract.
 *
 * @example
 * ```ts
 * import { createContract } from 'crossbell'
 *
 * // Create a new contract instance with metamask provider
 * const provider = window.ethereum
 * const contract = createContract(provider)
 * await contract.walletClient.requestAddresses()
 * // Example API: Create a new character for an address
 * try {
 *   const result = await contract.character.create(
 *     '0x1234567890123456789012345678901234567890',
 *     'Jason',
 *     'ipfs://xxxx/metadata.json',
 *   )
 *   console.log(result.data) // '42' (characterId)
 *   console.log(result.transactionHash) // '0xabcdef...'
 * } catch (e) {
 *   console.error(e.message) // e.g. "execution reverted: Web3Entry: HandleExists"
 * }
 * ```
 */
export class Contract<
  THasWallet extends boolean = boolean,
> extends BaseContract<THasWallet> {
  csb = new CsbContract(this)
  character = new CharacterContract(this)
  link = new LinkContract(this)
  cbt = new CbtContract(this)
  note = new NoteContract(this)
  operator = new OperatorContract(this)
  tips = new TipsContract(this)
  tipsWithFee = new TipsWithFeeContract(this)
  revision = new RevisionContract(this)
  linkModule = new LinkModuleContract(this)
  mintModule = new MintModuleContract(this)
}

/**
 * This creates a new Contract instance to interact with.
 * @param providerOrPrivateKey - The provider or private key to connect to the contract.
 * @returns The Contract instance.
 *
 * @example Connect with Metamask
 * ```js
 * import { createContract } from 'crossbell'
 * const provider = window.ethereum // the metamask provider
 * const contract = createContract(provider)
 * ```
 *
 * @example Connect with Private Key
 * ```js
 * import { createContract } from 'crossbell'
 * const privateKey = '0xabcdef0123456789012345678901234567890123456789012345678901234'
 * const contract = createContract(privateKey)
 * ```
 *
 * @example Connect with a Readonly Contract
 * ```js
 * import { createContract } from 'crossbell'
 * const contract = createContract() // readonly contract
 * ```
 */
export function createContract(
  providerOrPrivateKey: Hex | EIP1193Provider,
  options?: Partial<ContractOptions>,
): Contract<true>
export function createContract(
  providerOrPrivateKey?: Hex | EIP1193Provider,
  options?: Partial<ContractOptions>,
): Contract<boolean>
export function createContract(
  providerOrPrivateKey?: Hex | EIP1193Provider,
  options?: Partial<ContractOptions>,
) {
  return new Contract(providerOrPrivateKey, options)
}
