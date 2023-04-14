import { type AbiType, type Address } from 'abitype'

export interface MintOrLinkModule<T extends 'mint' | 'link' = 'mint' | 'link'> {
  /* Global unique id */
  id: string
  /* Type of the module */
  type: T
  /* The contract address of this module */
  address: Address
  /* Display name */
  name: string
  /* Display Description */
  description: string
  /* Module icon, an image url, in 256*256px */
  icon?: string
  /* The character id of the author */
  authorCharacterId?: number
  /* Data structure of init data, a form to fill out in frontend */
  initDataStructure: {
    /* Label of this field */
    label: string
    /* Data type of this field. E.g. "address[]", "uint256", ... see https://docs.soliditylang.org/en/latest/abi-spec.html#types */
    type: AbiType
    /* Description of this field */
    description: string
    /* Whether or not required, default: true */
    required?: boolean
  }[]
  /* Published date string */
  createdAt?: string
}

export interface MintOrLinkModuleConfig {
  /** The contract address of this module */
  address: Address
  /** The init data */
  data: any[]
}
