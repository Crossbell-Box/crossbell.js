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
  | 'approve'
  | 'balanceOf'
  | 'createProfile'
  | 'getApproved'
  | 'getHandle'
  | 'getLinkListUri'
  | 'getLinkModule4Profile'
  | 'getLinking2ProfileIds'
  | 'getNoteURI'
  | 'getPrimaryProfileId'
  | 'getProfile'
  | 'getProfileByHandle'
  | 'getProfileMetadataUri'
  | 'initialize'
  | 'isApprovedForAll'
  | 'isPrimaryProfile'
  | 'linkAddress'
  | 'linkAny'
  | 'linkERC721'
  | 'linkLink'
  | 'linkLinklist'
  | 'linkList'
  | 'linkNote'
  | 'linkProfile'
  | 'mintLink'
  | 'mintNote'
  | 'name'
  | 'ownerOf'
  | 'postNote'
  | 'postNoteWithLink'
  | 'safeTransferFrom'
  | 'safeTransferFrom'
  | 'setApprovalForAll'
  | 'setHandle'
  | 'setLinkListUri'
  | 'setLinkModule4Address'
  | 'setLinkModule4ERC721'
  | 'setLinkModule4Link'
  | 'setLinkModule4Linklist'
  | 'setLinkModule4Note'
  | 'setLinkModule4Profile'
  | 'setLinklistUri'
  | 'setMintModuleForLink'
  | 'setMintModuleForNote'
  | 'setPrimaryLinkList'
  | 'setPrimaryProfileId'
  | 'setProfileMetadataUri'
  | 'setSocialToken'
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
export interface CreateProfileRequest {
  to: string
  handle: string
  metadataUri: string
  linkModule: string
  linkModuleInitData: Arrayish
}
export interface ProfileResponse {
  handle: string
  0: string
  metadataUri: string
  1: string
  noteCount: BigNumber
  2: BigNumber
  socialToken: string
  3: string
  linkModule: string
  4: string
}
export interface LinkLinkRequest {
  linkListId: BigNumberish
  linkType: Arrayish
  linkTargetType: BigNumberish
  content: Arrayish
}
export interface MintLinkRequest {
  linkListId: BigNumberish
  linkType: Arrayish
  linkTargetType: BigNumberish
  content: Arrayish
}
export interface PostNoteRequest {
  profileId: BigNumberish
  contentURI: string
  linkModule: string
  linkModuleInitData: Arrayish
  mintModule: string
  mintModuleInitData: Arrayish
}
export interface PostNoteWithLinkRequest {
  profileId: BigNumberish
  contentURI: string
  linkModule: string
  linkModuleInitData: Arrayish
  mintModule: string
  mintModuleInitData: Arrayish
}
export interface SetLinkModule4LinkRequest {
  linkListId: BigNumberish
  linkType: Arrayish
  linkTargetType: BigNumberish
  content: Arrayish
}
export interface SetMintModuleForLinkRequest {
  linkListId: BigNumberish
  linkType: Arrayish
  linkTargetType: BigNumberish
  content: Arrayish
}
export interface Abi {
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
   * @param vars Type: tuple, Indexed: false
   */
  createProfile(
    vars: CreateProfileRequest,
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
  getLinkListUri(
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
  getLinkModule4Profile(
    profileId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  getLinking2ProfileIds(
    fromProfileId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber[]>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param noteId Type: uint256, Indexed: false
   */
  getNoteURI(
    profileId: BigNumberish,
    noteId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   */
  getPrimaryProfileId(
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
   * @param handle Type: string, Indexed: false
   */
  getProfileByHandle(
    handle: string,
    overrides?: ContractCallOverrides,
  ): Promise<ProfileResponse>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  getProfileMetadataUri(
    profileId: BigNumberish,
    overrides?: ContractCallOverrides,
  ): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _name Type: string, Indexed: false
   * @param _symbol Type: string, Indexed: false
   * @param _linkListContract Type: address, Indexed: false
   */
  initialize(
    _name: string,
    _symbol: string,
    _linkListContract: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
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
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  isPrimaryProfile(
    profileId: BigNumberish,
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
   * @param toUri Type: string, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkAny(
    fromProfileId: BigNumberish,
    toUri: string,
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
   * @param linkData Type: tuple, Indexed: false
   */
  linkLink(
    fromProfileId: BigNumberish,
    linkData: LinkLinkRequest,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param fromProfileId Type: uint256, Indexed: false
   * @param linkListId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkLinklist(
    fromProfileId: BigNumberish,
    linkListId: BigNumberish,
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
   * @param toNoteId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  linkNote(
    fromProfileId: BigNumberish,
    toProfileId: BigNumberish,
    toNoteId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
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
   * @param linkData Type: tuple, Indexed: false
   * @param receiver Type: address, Indexed: false
   */
  mintLink(
    linkData: MintLinkRequest,
    receiver: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param noteId Type: uint256, Indexed: false
   * @param to Type: address, Indexed: false
   */
  mintNote(
    profileId: BigNumberish,
    noteId: BigNumberish,
    to: string,
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
   * @param noteData Type: tuple, Indexed: false
   */
  postNote(
    noteData: PostNoteRequest,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param noteData Type: tuple, Indexed: false
   * @param linkData Type: tuple, Indexed: false
   */
  postNoteWithLink(
    noteData: PostNoteWithLinkRequest,
    linkData: PostNoteWithLinkRequest,
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
   * @param uri Type: string, Indexed: false
   */
  setLinkListUri(
    profileId: BigNumberish,
    linkType: Arrayish,
    uri: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param account Type: address, Indexed: false
   * @param linkModule Type: address, Indexed: false
   * @param linkModuleInitData Type: bytes, Indexed: false
   */
  setLinkModule4Address(
    account: string,
    linkModule: string,
    linkModuleInitData: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   * @param linkModule Type: address, Indexed: false
   * @param linkModuleInitData Type: bytes, Indexed: false
   */
  setLinkModule4ERC721(
    tokenAddress: string,
    tokenId: BigNumberish,
    linkModule: string,
    linkModuleInitData: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param linkData Type: tuple, Indexed: false
   * @param linkModule Type: address, Indexed: false
   * @param linkModuleInitData Type: bytes, Indexed: false
   */
  setLinkModule4Link(
    linkData: SetLinkModule4LinkRequest,
    linkModule: string,
    linkModuleInitData: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param linkModule Type: address, Indexed: false
   * @param linkModuleInitData Type: bytes, Indexed: false
   */
  setLinkModule4Linklist(
    tokenId: BigNumberish,
    linkModule: string,
    linkModuleInitData: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param noteId Type: uint256, Indexed: false
   * @param linkModule Type: address, Indexed: false
   * @param linkModuleInitData Type: bytes, Indexed: false
   */
  setLinkModule4Note(
    profileId: BigNumberish,
    noteId: BigNumberish,
    linkModule: string,
    linkModuleInitData: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param linkModule Type: address, Indexed: false
   * @param linkModuleInitData Type: bytes, Indexed: false
   */
  setLinkModule4Profile(
    profileId: BigNumberish,
    linkModule: string,
    linkModuleInitData: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param linkListId Type: uint256, Indexed: false
   * @param linklistUri Type: string, Indexed: false
   */
  setLinklistUri(
    linkListId: BigNumberish,
    linklistUri: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param linkData Type: tuple, Indexed: false
   * @param mintModule Type: address, Indexed: false
   * @param mintModuleInitData Type: bytes, Indexed: false
   */
  setMintModuleForLink(
    linkData: SetMintModuleForLinkRequest,
    mintModule: string,
    mintModuleInitData: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param toNoteId Type: uint256, Indexed: false
   * @param mintModule Type: address, Indexed: false
   * @param mintModuleInitData Type: bytes, Indexed: false
   */
  setMintModuleForNote(
    profileId: BigNumberish,
    toNoteId: BigNumberish,
    mintModule: string,
    mintModuleInitData: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param linkListId Type: uint256, Indexed: false
   * @param profileId Type: uint256, Indexed: false
   */
  setPrimaryLinkList(
    linkListId: BigNumberish,
    profileId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   */
  setPrimaryProfileId(
    profileId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param newMetadataUri Type: string, Indexed: false
   */
  setProfileMetadataUri(
    profileId: BigNumberish,
    newMetadataUri: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param profileId Type: uint256, Indexed: false
   * @param tokenAddress Type: address, Indexed: false
   */
  setSocialToken(
    profileId: BigNumberish,
    tokenAddress: string,
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
   * @param toProfileId Type: uint256, Indexed: false
   * @param linkType Type: bytes32, Indexed: false
   */
  unlinkProfile(
    fromProfileId: BigNumberish,
    toProfileId: BigNumberish,
    linkType: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
}
