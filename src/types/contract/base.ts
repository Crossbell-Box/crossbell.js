import { type Abi, type ExtractAbiFunctionNames } from 'abitype'
import {
  type Account,
  type Address,
  type Chain,
  type ReadContractParameters,
  type WriteContractParameters,
} from 'viem'

/**
 * The result of a call to a transaction / get function.
 */
export type Result<T, HasTxHash extends boolean = false> = {
  data: T
} & (HasTxHash extends true ? { transactionHash: Address } : {})

/**
 * @description Construct a type with the properties of union type T except for those in type K.
 * @example
 * type Result = UnionOmit<{ a: string, b: number } | { a: string, b: undefined, c: number }, 'a'>
 * => { b: number } | { b: undefined, c: number }
 */
type UnionOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export type ReadOverrides<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
> = UnionOmit<
  ReadContractParameters<TAbi, TFunctionName>,
  'abi' | 'address' | 'args' | 'functionName'
>
export type WriteOverrides<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'nonpayable' | 'payable'>,
> = UnionOmit<
  WriteContractParameters<TAbi, TFunctionName, Chain, Account>,
  'abi' | 'address' | 'args' | 'functionName'
>
