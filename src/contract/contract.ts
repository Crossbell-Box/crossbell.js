import { BaseContract } from './subcontracts/base'
import { CsbContract } from './subcontracts/csb'
import { LinkContract } from './subcontracts/link'
import { NoteContract } from './subcontracts/note'
import { CharacterContract } from './subcontracts/character'
// import { RevisionContract } from './subcontracts/revision'
import { OperatorContract } from './subcontracts/operator'
import { CbtContract } from './subcontracts/cbt'
import { TipsContract } from './subcontracts/tips'
// import { LinkModuleContract } from './subcontracts/link_module'
// import { MintModuleContract } from './subcontracts/mint_module'

/**
 * This class is used to interact with the contract.
 *
 * @example
 * ```ts
 * import { Contract } from 'crossbell.js'
 *
 * // Create a new contract instance with metamask provider
 * const provider = window.ethereum
 * const contract = new Contract(provider)
 *
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
export class Contract extends BaseContract {
  csb = new CsbContract(this)
  character = new CharacterContract(this)
  link = new LinkContract(this)
  cbt = new CbtContract(this)
  note = new NoteContract(this)
  operator = new OperatorContract(this)
  tips = new TipsContract(this)
}
