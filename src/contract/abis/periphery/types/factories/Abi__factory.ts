/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Abi, AbiInterface } from "../Abi";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "handle",
            type: "string",
          },
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
          {
            internalType: "address",
            name: "profileLinkModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "profileLinkModuleInitData",
            type: "bytes",
          },
          {
            internalType: "string",
            name: "contentUri",
            type: "string",
          },
          {
            internalType: "address",
            name: "noteLinkModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "noteLinkModuleInitData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "mintModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "mintModuleInitData",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "locked",
            type: "bool",
          },
        ],
        internalType: "struct DataTypes.createProfileThenPostNoteData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "createProfileThenPostNote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "linkKey",
        type: "bytes32",
      },
    ],
    name: "getLinkingAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fromProfileId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "linkType",
        type: "bytes32",
      },
    ],
    name: "getLinkingAddresses",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "linkKey",
        type: "bytes32",
      },
    ],
    name: "getLinkingAnyUri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fromProfileId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "linkType",
        type: "bytes32",
      },
    ],
    name: "getLinkingAnyUris",
    outputs: [
      {
        internalType: "string[]",
        name: "results",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "linkKey",
        type: "bytes32",
      },
    ],
    name: "getLinkingERC721",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "erc721TokenId",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.ERC721Struct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fromProfileId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "linkType",
        type: "bytes32",
      },
    ],
    name: "getLinkingERC721s",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "erc721TokenId",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.ERC721Struct[]",
        name: "results",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "linkKey",
        type: "bytes32",
      },
    ],
    name: "getLinkingLinklistId",
    outputs: [
      {
        internalType: "uint256",
        name: "linklistId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fromProfileId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "linkType",
        type: "bytes32",
      },
    ],
    name: "getLinkingLinklistIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "linklistIds",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "linkKey",
        type: "bytes32",
      },
    ],
    name: "getLinkingNote",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "profileId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "noteId",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.NoteStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fromProfileId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "linkType",
        type: "bytes32",
      },
    ],
    name: "getLinkingNotes",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "linkItemType",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "linkKey",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "contentUri",
            type: "string",
          },
          {
            internalType: "address",
            name: "linkModule",
            type: "address",
          },
          {
            internalType: "address",
            name: "mintModule",
            type: "address",
          },
          {
            internalType: "address",
            name: "mintNFT",
            type: "address",
          },
          {
            internalType: "bool",
            name: "deleted",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "locked",
            type: "bool",
          },
        ],
        internalType: "struct DataTypes.Note[]",
        name: "results",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "linkKey",
        type: "bytes32",
      },
    ],
    name: "getLinkingProfileId",
    outputs: [
      {
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fromProfileId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "linkType",
        type: "bytes32",
      },
    ],
    name: "getLinkingProfileIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "results",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getNotesByProfileId",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "linkItemType",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "linkKey",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "contentUri",
            type: "string",
          },
          {
            internalType: "address",
            name: "linkModule",
            type: "address",
          },
          {
            internalType: "address",
            name: "mintModule",
            type: "address",
          },
          {
            internalType: "address",
            name: "mintNFT",
            type: "address",
          },
          {
            internalType: "bool",
            name: "deleted",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "locked",
            type: "bool",
          },
        ],
        internalType: "struct DataTypes.Note[]",
        name: "results",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_web3Entry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_linklist",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "fromProfileId",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "toProfileIds",
            type: "uint256[]",
          },
          {
            internalType: "bytes[]",
            name: "data",
            type: "bytes[]",
          },
          {
            internalType: "address[]",
            name: "toAddresses",
            type: "address[]",
          },
          {
            internalType: "bytes32",
            name: "linkType",
            type: "bytes32",
          },
        ],
        internalType: "struct DataTypes.linkProfilesInBatchData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "linkProfilesInBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "linklist",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "web3Entry",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class Abi__factory {
  static readonly abi = _abi;
  static createInterface(): AbiInterface {
    return new utils.Interface(_abi) as AbiInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Abi {
    return new Contract(address, _abi, signerOrProvider) as Abi;
  }
}
