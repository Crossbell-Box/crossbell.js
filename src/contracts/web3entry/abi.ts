import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers'
import { EthersContractContextV5 } from 'ethereum-abi-types-generator'

export type ContractContext = EthersContractContextV5<
  Abi,
  AbiMethodNames,
  AbiEventsContext,
  AbiEvents
>

export declare type EventFilter = {
  address?: string
  topics?: Array<string>
  fromBlock?: string | number
  toBlock?: string | number
}

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>
  /**
   * The nonce to use in the transaction
   */
  nonce?: number
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number
}
export type AbiEvents = 'Approval' | 'ApprovalForAll' | 'Transfer'
export interface AbiEventsContext {
  Approval(...parameters: any): EventFilter
  ApprovalForAll(...parameters: any): EventFilter
  Transfer(...parameters: any): EventFilter
}
export type AbiMethodNames =
  | 'new'
  | 'approve'
  | 'balanceOf'
  | 'createProfile'
  | 'getApproved'
  | 'getHandle'
  | 'getLinkListByProfile'
  | 'getLinkListURI'
  | 'getLinkModuleByProfile'
  | 'getPrimaryProfile'
  | 'getProfile'
  | 'getProfile2ProfileLinkItem'
  | 'getProfile2ProfileLinkItems'
  | 'getProfileIdByHandle'
  | 'getProfileMetadataURI'
  | 'isApprovedForAll'
  | 'linkAddress'
  | 'linkAny'
  | 'linkERC721'
  | 'linkLinklist'
  | 'linkList'
  | 'linkProfile'
  | 'linkSingleLinkItem'
  | 'mintSingleLinkItem'
  | 'name'
  | 'ownerOf'
  | 'safeTransferFrom'
  | 'safeTransferFrom'
  | 'setApprovalForAll'
  | 'setHandle'
  | 'setLinkListURI'
  | 'setLinkModule4Note'
  | 'setLinkModule4Profile'
  | 'setLinklistURI'
  | 'setMintModule4Note'
  | 'setMintModule4SingleLinkItem'
  | 'setPrimaryProfile'
  | 'setProfileMetadataURI'
  | 'supportsInterface'
  | 'symbol'
  | 'tokenByIndex'
  | 'tokenOfOwnerByIndex'
  | 'tokenURI'
  | 'totalSupply'
  | 'transferFrom'
  | 'unlinkProfile'
export interface ApprovalEventEmittedResponse {
  owner: string
  approved: string
  tokenId: BigNumberish
}
export interface ApprovalForAllEventEmittedResponse {
  owner: string
  operator: string
  approved: boolean
}
export interface TransferEventEmittedResponse {
  from: string
  to: string
  tokenId: BigNumberish
}
export interface ProfileResponse {
  handle: string
  0: string
  metadataURI: string
  1: string
}
export interface Profile2profilelinkResponse {
  fromProfileId: BigNumber
  0: BigNumber
  toProfileId: BigNumber
  1: BigNumber
  linkId: BigNumber
  2: BigNumber
}
export interface ResultsResponse {
  fromProfileId: BigNumber
  0: BigNumber
  toProfileId: BigNumber
  1: BigNumber
  linkId: BigNumber
  2: BigNumber
}
export interface Abi {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _name Type: string, Indexed: false
   * @param _symbol Type: string, Indexed: false
   * @param _linkListContract Type: address, Indexed: false
   */
  'new'(
    _name: string,
    _symbol: string,
    _linkListContract: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   */
  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   */
  balanceOf(
    owner: string,
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param handle Type: string, Indexed: false
   * @param metadataURI Type: string, Indexed: false
   */
  createProfile(
    to: string,
    handle: string,
    metadataURI: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getApproved(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  getHandle(
    profileId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  getLinkListByProfile(
    profileId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  getLinkListURI(
    profileId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  getLinkModuleByProfile(
    profileId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   */
  getPrimaryProfile(
    account: string,
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  getProfile(
    profileId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<ProfileResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param linkType Type: bytes32, Indexed: false
   * @param linkId Type: uint256, Indexed: false
   */
  getProfile2ProfileLinkItem(
    linkType: Arrayish,
    linkId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<Profile2profilelinkResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  getProfile2ProfileLinkItems(
    fromProfileId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractCallOverrides,
  ): Promise<ResultsResponse[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param handle Type: string, Indexed: false
   */
  getProfileIdByHandle(
    handle: string,
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  getProfileMetadataURI(
    profileId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   * @param operator Type: address, Indexed: false
   */
  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: ContractCallOverrides,
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param ethAddress Type: address, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkAddress(
    fromProfileId: BigNumberish,
    ethAddress: string,
    linkType: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param toURI Type: string, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkAny(
    fromProfileId: BigNumberish,
    toURI: string,
    linkType: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param tokenAddress Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkERC721(
    fromProfileId: BigNumberish,
    tokenAddress: string,
    tokenId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param linkListNFTId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkLinklist(
    fromProfileId: BigNumberish,
    linkListNFTId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  linkList(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param toProfileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkProfile(
    fromProfileId: BigNumberish,
    toProfileId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param linkListNFTId Type: uint256, Indexed: false
   * @param linkId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkSingleLinkItem(
    fromProfileId: BigNumberish,
    linkListNFTId: BigNumberish,
    linkId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param linkListNFTId Type: uint256, Indexed: false
   * @param linkId Type: uint256, Indexed: false
   * @param receiver Type: address, Indexed: false
   */
  mintSingleLinkItem(
    linkListNFTId: BigNumberish,
    linkId: BigNumberish,
    receiver: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  ownerOf(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   */
  safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param operator Type: address, Indexed: false
   * @param approved Type: bool, Indexed: false
   */
  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param newHandle Type: string, Indexed: false
   */
  setHandle(
    profileId: BigNumberish,
    newHandle: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   * @param URI Type: string, Indexed: false
   */
  setLinkListURI(
    profileId: BigNumberish,
    linkType: Arrayish,
    URI: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param toNoteId Type: uint256, Indexed: false
   * @param moduleAddress Type: address, Indexed: false
   */
  setLinkModule4Note(
    profileId: BigNumberish,
    toNoteId: BigNumberish,
    moduleAddress: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param moduleAddress Type: address, Indexed: false
   */
  setLinkModule4Profile(
    profileId: BigNumberish,
    moduleAddress: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   * @param linklistURI Type: string, Indexed: false
   */
  setLinklistURI(
    profileId: BigNumberish,
    linkType: Arrayish,
    linklistURI: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param toNoteId Type: uint256, Indexed: false
   * @param moduleAddress Type: address, Indexed: false
   */
  setMintModule4Note(
    profileId: BigNumberish,
    toNoteId: BigNumberish,
    moduleAddress: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param linkListNFTId Type: uint256, Indexed: false
   * @param linkId Type: uint256, Indexed: false
   * @param moduleAddress Type: address, Indexed: false
   */
  setMintModule4SingleLinkItem(
    linkListNFTId: BigNumberish,
    linkId: BigNumberish,
    moduleAddress: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  setPrimaryProfile(
    profileId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param newMetadataURI Type: string, Indexed: false
   */
  setProfileMetadataURI(
    profileId: BigNumberish,
    newMetadataURI: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: ContractCallOverrides,
  ): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param index Type: uint256, Indexed: false
   */
  tokenByIndex(
    index: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   * @param index Type: uint256, Indexed: false
   */
  tokenOfOwnerByIndex(
    owner: string,
    index: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  tokenURI(
    profileId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(overrides?: ContractCallOverrides): Promise<BigNumber>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   */
  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   * @param linkId Type: uint256, Indexed: false
   */
  unlinkProfile(
    fromProfileId: BigNumberish,
    linkType: Arrayish,
    linkId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
}
