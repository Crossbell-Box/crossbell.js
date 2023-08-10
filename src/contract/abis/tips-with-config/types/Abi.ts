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

export declare namespace ITipsWithConfig {
  export type TipsConfigStruct = {
    id: PromiseOrValue<BigNumberish>;
    fromCharacterId: PromiseOrValue<BigNumberish>;
    toCharacterId: PromiseOrValue<BigNumberish>;
    token: PromiseOrValue<string>;
    amount: PromiseOrValue<BigNumberish>;
    startTime: PromiseOrValue<BigNumberish>;
    endTime: PromiseOrValue<BigNumberish>;
    interval: PromiseOrValue<BigNumberish>;
    feeReceiver: PromiseOrValue<string>;
    totalRound: PromiseOrValue<BigNumberish>;
    currentRound: PromiseOrValue<BigNumberish>;
  };

  export type TipsConfigStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber
  ] & {
    id: BigNumber;
    fromCharacterId: BigNumber;
    toCharacterId: BigNumber;
    token: string;
    amount: BigNumber;
    startTime: BigNumber;
    endTime: BigNumber;
    interval: BigNumber;
    feeReceiver: string;
    totalRound: BigNumber;
    currentRound: BigNumber;
  };
}

export interface AbiInterface extends utils.Interface {
  functions: {
    "collectTips4Character(uint256)": FunctionFragment;
    "getFeeAmount(address,uint256,uint256)": FunctionFragment;
    "getFeeFraction(address,uint256)": FunctionFragment;
    "getTipsConfig(uint256)": FunctionFragment;
    "getTipsConfigId(uint256,uint256)": FunctionFragment;
    "getWeb3Entry()": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "setDefaultFeeFraction(address,uint256)": FunctionFragment;
    "setFeeFraction4Character(address,uint256,uint256)": FunctionFragment;
    "setTipsConfig4Character(uint256,uint256,address,uint256,uint256,uint256,uint256,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "collectTips4Character"
      | "getFeeAmount"
      | "getFeeFraction"
      | "getTipsConfig"
      | "getTipsConfigId"
      | "getWeb3Entry"
      | "initialize"
      | "setDefaultFeeFraction"
      | "setFeeFraction4Character"
      | "setTipsConfig4Character"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "collectTips4Character",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getFeeAmount",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getFeeFraction",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTipsConfig",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTipsConfigId",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getWeb3Entry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDefaultFeeFraction",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeFraction4Character",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setTipsConfig4Character",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "collectTips4Character",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFeeAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFeeFraction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTipsConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTipsConfigId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWeb3Entry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDefaultFeeFraction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeeFraction4Character",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTipsConfig4Character",
    data: BytesLike
  ): Result;

  events: {
    "CollectTips4Character(uint256,uint256,uint256,address,uint256,uint256,address,uint256)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "SetTipsConfig4Character(uint256,uint256,uint256,address,uint256,uint256,uint256,uint256,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CollectTips4Character"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTipsConfig4Character"): EventFragment;
}

export interface CollectTips4CharacterEventObject {
  tipConfigId: BigNumber;
  fromCharacterId: BigNumber;
  toCharacterId: BigNumber;
  token: string;
  amount: BigNumber;
  fee: BigNumber;
  feeReceiver: string;
  currentRound: BigNumber;
}
export type CollectTips4CharacterEvent = TypedEvent<
  [
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    string,
    BigNumber
  ],
  CollectTips4CharacterEventObject
>;

export type CollectTips4CharacterEventFilter =
  TypedEventFilter<CollectTips4CharacterEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface SetTipsConfig4CharacterEventObject {
  tipConfigId: BigNumber;
  fromCharacterId: BigNumber;
  toCharacterId: BigNumber;
  token: string;
  amount: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  interval: BigNumber;
  feeReceiver: string;
  totalRound: BigNumber;
}
export type SetTipsConfig4CharacterEvent = TypedEvent<
  [
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber
  ],
  SetTipsConfig4CharacterEventObject
>;

export type SetTipsConfig4CharacterEventFilter =
  TypedEventFilter<SetTipsConfig4CharacterEvent>;

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
    collectTips4Character(
      tipConfigId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getFeeAmount(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      tipAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getFeeFraction(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTipsConfig(
      tipConfigId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [ITipsWithConfig.TipsConfigStructOutput] & {
        config: ITipsWithConfig.TipsConfigStructOutput;
      }
    >;

    getTipsConfigId(
      fromCharacterId: PromiseOrValue<BigNumberish>,
      toCharacterId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getWeb3Entry(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      web3Entry_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDefaultFeeFraction(
      feeReceiver: PromiseOrValue<string>,
      fraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setFeeFraction4Character(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      fraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTipsConfig4Character(
      fromCharacterId: PromiseOrValue<BigNumberish>,
      toCharacterId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      startTime: PromiseOrValue<BigNumberish>,
      endTime: PromiseOrValue<BigNumberish>,
      interval: PromiseOrValue<BigNumberish>,
      feeReceiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  collectTips4Character(
    tipConfigId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getFeeAmount(
    feeReceiver: PromiseOrValue<string>,
    characterId: PromiseOrValue<BigNumberish>,
    tipAmount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getFeeFraction(
    feeReceiver: PromiseOrValue<string>,
    characterId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTipsConfig(
    tipConfigId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<ITipsWithConfig.TipsConfigStructOutput>;

  getTipsConfigId(
    fromCharacterId: PromiseOrValue<BigNumberish>,
    toCharacterId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getWeb3Entry(overrides?: CallOverrides): Promise<string>;

  initialize(
    web3Entry_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDefaultFeeFraction(
    feeReceiver: PromiseOrValue<string>,
    fraction: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setFeeFraction4Character(
    feeReceiver: PromiseOrValue<string>,
    characterId: PromiseOrValue<BigNumberish>,
    fraction: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTipsConfig4Character(
    fromCharacterId: PromiseOrValue<BigNumberish>,
    toCharacterId: PromiseOrValue<BigNumberish>,
    token: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    startTime: PromiseOrValue<BigNumberish>,
    endTime: PromiseOrValue<BigNumberish>,
    interval: PromiseOrValue<BigNumberish>,
    feeReceiver: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    collectTips4Character(
      tipConfigId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getFeeAmount(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      tipAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFeeFraction(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTipsConfig(
      tipConfigId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<ITipsWithConfig.TipsConfigStructOutput>;

    getTipsConfigId(
      fromCharacterId: PromiseOrValue<BigNumberish>,
      toCharacterId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWeb3Entry(overrides?: CallOverrides): Promise<string>;

    initialize(
      web3Entry_: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDefaultFeeFraction(
      feeReceiver: PromiseOrValue<string>,
      fraction: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setFeeFraction4Character(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      fraction: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTipsConfig4Character(
      fromCharacterId: PromiseOrValue<BigNumberish>,
      toCharacterId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      startTime: PromiseOrValue<BigNumberish>,
      endTime: PromiseOrValue<BigNumberish>,
      interval: PromiseOrValue<BigNumberish>,
      feeReceiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CollectTips4Character(uint256,uint256,uint256,address,uint256,uint256,address,uint256)"(
      tipConfigId?: PromiseOrValue<BigNumberish> | null,
      fromCharacterId?: PromiseOrValue<BigNumberish> | null,
      toCharacterId?: PromiseOrValue<BigNumberish> | null,
      token?: null,
      amount?: null,
      fee?: null,
      feeReceiver?: null,
      currentRound?: null
    ): CollectTips4CharacterEventFilter;
    CollectTips4Character(
      tipConfigId?: PromiseOrValue<BigNumberish> | null,
      fromCharacterId?: PromiseOrValue<BigNumberish> | null,
      toCharacterId?: PromiseOrValue<BigNumberish> | null,
      token?: null,
      amount?: null,
      fee?: null,
      feeReceiver?: null,
      currentRound?: null
    ): CollectTips4CharacterEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "SetTipsConfig4Character(uint256,uint256,uint256,address,uint256,uint256,uint256,uint256,address,uint256)"(
      tipConfigId?: PromiseOrValue<BigNumberish> | null,
      fromCharacterId?: PromiseOrValue<BigNumberish> | null,
      toCharacterId?: PromiseOrValue<BigNumberish> | null,
      token?: null,
      amount?: null,
      startTime?: null,
      endTime?: null,
      interval?: null,
      feeReceiver?: null,
      totalRound?: null
    ): SetTipsConfig4CharacterEventFilter;
    SetTipsConfig4Character(
      tipConfigId?: PromiseOrValue<BigNumberish> | null,
      fromCharacterId?: PromiseOrValue<BigNumberish> | null,
      toCharacterId?: PromiseOrValue<BigNumberish> | null,
      token?: null,
      amount?: null,
      startTime?: null,
      endTime?: null,
      interval?: null,
      feeReceiver?: null,
      totalRound?: null
    ): SetTipsConfig4CharacterEventFilter;
  };

  estimateGas: {
    collectTips4Character(
      tipConfigId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getFeeAmount(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      tipAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFeeFraction(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTipsConfig(
      tipConfigId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTipsConfigId(
      fromCharacterId: PromiseOrValue<BigNumberish>,
      toCharacterId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWeb3Entry(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      web3Entry_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDefaultFeeFraction(
      feeReceiver: PromiseOrValue<string>,
      fraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setFeeFraction4Character(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      fraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTipsConfig4Character(
      fromCharacterId: PromiseOrValue<BigNumberish>,
      toCharacterId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      startTime: PromiseOrValue<BigNumberish>,
      endTime: PromiseOrValue<BigNumberish>,
      interval: PromiseOrValue<BigNumberish>,
      feeReceiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    collectTips4Character(
      tipConfigId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getFeeAmount(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      tipAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFeeFraction(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTipsConfig(
      tipConfigId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTipsConfigId(
      fromCharacterId: PromiseOrValue<BigNumberish>,
      toCharacterId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getWeb3Entry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      web3Entry_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDefaultFeeFraction(
      feeReceiver: PromiseOrValue<string>,
      fraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setFeeFraction4Character(
      feeReceiver: PromiseOrValue<string>,
      characterId: PromiseOrValue<BigNumberish>,
      fraction: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTipsConfig4Character(
      fromCharacterId: PromiseOrValue<BigNumberish>,
      toCharacterId: PromiseOrValue<BigNumberish>,
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      startTime: PromiseOrValue<BigNumberish>,
      endTime: PromiseOrValue<BigNumberish>,
      interval: PromiseOrValue<BigNumberish>,
      feeReceiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
