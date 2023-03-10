/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface AbiInterface extends utils.Interface {
  functions: {
    "ERC1820_REGISTRY()": FunctionFragment;
    "TOKENS_RECIPIENT_INTERFACE_HASH()": FunctionFragment;
    "getToken()": FunctionFragment;
    "getWeb3Entry()": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "tokensReceived(address,address,address,uint256,bytes,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "ERC1820_REGISTRY"
      | "TOKENS_RECIPIENT_INTERFACE_HASH"
      | "getToken"
      | "getWeb3Entry"
      | "initialize"
      | "tokensReceived"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "ERC1820_REGISTRY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "TOKENS_RECIPIENT_INTERFACE_HASH",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getWeb3Entry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensReceived",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "ERC1820_REGISTRY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "TOKENS_RECIPIENT_INTERFACE_HASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getWeb3Entry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokensReceived",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(uint8)": EventFragment;
    "TipCharacter(uint256,uint256,address,uint256)": EventFragment;
    "TipCharacterForNote(uint256,uint256,uint256,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TipCharacter"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TipCharacterForNote"): EventFragment;
}

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface TipCharacterEventObject {
  fromCharacterId: BigNumber;
  toCharacterId: BigNumber;
  token: string;
  amount: BigNumber;
}
export type TipCharacterEvent = TypedEvent<
  [BigNumber, BigNumber, string, BigNumber],
  TipCharacterEventObject
>;

export type TipCharacterEventFilter = TypedEventFilter<TipCharacterEvent>;

export interface TipCharacterForNoteEventObject {
  fromCharacterId: BigNumber;
  toCharacterId: BigNumber;
  toNoteId: BigNumber;
  token: string;
  amount: BigNumber;
}
export type TipCharacterForNoteEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, string, BigNumber],
  TipCharacterForNoteEventObject
>;

export type TipCharacterForNoteEventFilter =
  TypedEventFilter<TipCharacterForNoteEvent>;

export interface Abi extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AbiInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    ERC1820_REGISTRY(overrides?: CallOverrides): Promise<[string]>;

    TOKENS_RECIPIENT_INTERFACE_HASH(
      overrides?: CallOverrides
    ): Promise<[string]>;

    getToken(overrides?: CallOverrides): Promise<[string]>;

    getWeb3Entry(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      web3Entry_: PromiseOrValue<string>,
      token_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tokensReceived(
      arg0: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      userData: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  ERC1820_REGISTRY(overrides?: CallOverrides): Promise<string>;

  TOKENS_RECIPIENT_INTERFACE_HASH(overrides?: CallOverrides): Promise<string>;

  getToken(overrides?: CallOverrides): Promise<string>;

  getWeb3Entry(overrides?: CallOverrides): Promise<string>;

  initialize(
    web3Entry_: PromiseOrValue<string>,
    token_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tokensReceived(
    arg0: PromiseOrValue<string>,
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    userData: PromiseOrValue<BytesLike>,
    operatorData: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    ERC1820_REGISTRY(overrides?: CallOverrides): Promise<string>;

    TOKENS_RECIPIENT_INTERFACE_HASH(overrides?: CallOverrides): Promise<string>;

    getToken(overrides?: CallOverrides): Promise<string>;

    getWeb3Entry(overrides?: CallOverrides): Promise<string>;

    initialize(
      web3Entry_: PromiseOrValue<string>,
      token_: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    tokensReceived(
      arg0: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      userData: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "TipCharacter(uint256,uint256,address,uint256)"(
      fromCharacterId?: PromiseOrValue<BigNumberish> | null,
      toCharacterId?: PromiseOrValue<BigNumberish> | null,
      token?: null,
      amount?: null
    ): TipCharacterEventFilter;
    TipCharacter(
      fromCharacterId?: PromiseOrValue<BigNumberish> | null,
      toCharacterId?: PromiseOrValue<BigNumberish> | null,
      token?: null,
      amount?: null
    ): TipCharacterEventFilter;

    "TipCharacterForNote(uint256,uint256,uint256,address,uint256)"(
      fromCharacterId?: PromiseOrValue<BigNumberish> | null,
      toCharacterId?: PromiseOrValue<BigNumberish> | null,
      toNoteId?: PromiseOrValue<BigNumberish> | null,
      token?: null,
      amount?: null
    ): TipCharacterForNoteEventFilter;
    TipCharacterForNote(
      fromCharacterId?: PromiseOrValue<BigNumberish> | null,
      toCharacterId?: PromiseOrValue<BigNumberish> | null,
      toNoteId?: PromiseOrValue<BigNumberish> | null,
      token?: null,
      amount?: null
    ): TipCharacterForNoteEventFilter;
  };

  estimateGas: {
    ERC1820_REGISTRY(overrides?: CallOverrides): Promise<BigNumber>;

    TOKENS_RECIPIENT_INTERFACE_HASH(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getToken(overrides?: CallOverrides): Promise<BigNumber>;

    getWeb3Entry(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      web3Entry_: PromiseOrValue<string>,
      token_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tokensReceived(
      arg0: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      userData: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ERC1820_REGISTRY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    TOKENS_RECIPIENT_INTERFACE_HASH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getWeb3Entry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      web3Entry_: PromiseOrValue<string>,
      token_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tokensReceived(
      arg0: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      userData: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}