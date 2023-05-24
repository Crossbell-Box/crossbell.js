export const entry = [
  {
    inputs: [{ name: 'characterId', type: 'uint256' }],
    name: 'ErrCharacterNotExists',
    type: 'error',
  },
  { inputs: [], name: 'ErrHandleContainsInvalidCharacters', type: 'error' },
  { inputs: [], name: 'ErrHandleExists', type: 'error' },
  { inputs: [], name: 'ErrHandleLengthInvalid', type: 'error' },
  { inputs: [], name: 'ErrNotAddressOwner', type: 'error' },
  { inputs: [], name: 'ErrNotCharacterOwner', type: 'error' },
  { inputs: [], name: 'ErrNotEnoughPermission', type: 'error' },
  { inputs: [], name: 'ErrNotEnoughPermissionForThisNote', type: 'error' },
  { inputs: [], name: 'ErrNoteIsDeleted', type: 'error' },
  { inputs: [], name: 'ErrNoteLocked', type: 'error' },
  { inputs: [], name: 'ErrNoteNotExists', type: 'error' },
  { inputs: [], name: 'ErrSignatureExpired', type: 'error' },
  { inputs: [], name: 'ErrSignatureInvalid', type: 'error' },
  { inputs: [], name: 'ErrSocialTokenExists', type: 'error' },
  {
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'approved', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'operator', type: 'address' },
      { indexed: false, name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    inputs: [{ indexed: false, name: 'version', type: 'uint8' }],
    name: 'Initialized',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'to', type: 'address' },
          { name: 'handle', type: 'string' },
          { name: 'uri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'createCharacter',
    outputs: [{ name: 'characterId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'to', type: 'address' },
          { name: 'linkType', type: 'bytes32' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'createThenLinkCharacter',
    outputs: [{ name: 'characterId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'noteId', type: 'uint256' },
    ],
    name: 'deleteNote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'characterId', type: 'uint256' }],
    name: 'getCharacter',
    outputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'handle', type: 'string' },
          { name: 'uri', type: 'string' },
          { name: 'noteCount', type: 'uint256' },
          { name: 'socialToken', type: 'address' },
          { name: 'linkModule', type: 'address' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'handle', type: 'string' }],
    name: 'getCharacterByHandle',
    outputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'handle', type: 'string' },
          { name: 'uri', type: 'string' },
          { name: 'noteCount', type: 'uint256' },
          { name: 'socialToken', type: 'address' },
          { name: 'linkModule', type: 'address' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'characterId', type: 'uint256' }],
    name: 'getCharacterUri',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDomainSeparator',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'characterId', type: 'uint256' }],
    name: 'getHandle',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'getLinkModule4Address',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'getLinkModule4ERC721',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getLinkModule4Linklist',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLinklistContract',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'linkType', type: 'bytes32' },
    ],
    name: 'getLinklistId',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'linkListId', type: 'uint256' }],
    name: 'getLinklistType',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getLinklistUri',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'noteId', type: 'uint256' },
    ],
    name: 'getNote',
    outputs: [
      {
        components: [
          { name: 'linkItemType', type: 'bytes32' },
          { name: 'linkKey', type: 'bytes32' },
          { name: 'contentUri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintNFT', type: 'address' },
          { name: 'deleted', type: 'bool' },
          { name: 'locked', type: 'bool' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'operator', type: 'address' },
    ],
    name: 'getOperatorPermissions',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'characterId', type: 'uint256' }],
    name: 'getOperators',
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'noteId', type: 'uint256' },
    ],
    name: 'getOperators4Note',
    outputs: [
      { name: 'blocklist', type: 'address[]' },
      { name: 'allowlist', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'getPrimaryCharacterId',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRevision',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'operator', type: 'address' },
      { name: 'permissionBitMap', type: 'uint256' },
    ],
    name: 'grantOperatorPermissions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'operator', type: 'address' },
      { name: 'permissionBitMap', type: 'uint256' },
      {
        components: [
          { name: 'v', type: 'uint8' },
          { name: 'r', type: 'bytes32' },
          { name: 's', type: 'bytes32' },
          { name: 'deadline', type: 'uint256' },
        ],
        name: 'sig',
        type: 'tuple',
      },
    ],
    name: 'grantOperatorPermissionsWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'noteId', type: 'uint256' },
      { name: 'blocklist', type: 'address[]' },
      { name: 'allowlist', type: 'address[]' },
    ],
    name: 'grantOperators4Note',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'name_', type: 'string' },
      { name: 'symbol_', type: 'string' },
      { name: 'linklist_', type: 'address' },
      { name: 'mintNFTImpl_', type: 'address' },
      { name: 'periphery_', type: 'address' },
      { name: 'newbieVilla_', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'noteId', type: 'uint256' },
      { name: 'operator', type: 'address' },
    ],
    name: 'isOperatorAllowedForNote',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'characterId', type: 'uint256' }],
    name: 'isPrimaryCharacter',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'ethAddress', type: 'address' },
          { name: 'linkType', type: 'bytes32' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'linkAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'toUri', type: 'string' },
          { name: 'linkType', type: 'bytes32' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'linkAnyUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'toCharacterId', type: 'uint256' },
          { name: 'linkType', type: 'bytes32' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'linkCharacter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'tokenAddress', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'linkType', type: 'bytes32' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'linkERC721',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'toLinkListId', type: 'uint256' },
          { name: 'linkType', type: 'bytes32' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'linkLinklist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'toCharacterId', type: 'uint256' },
          { name: 'toNoteId', type: 'uint256' },
          { name: 'linkType', type: 'bytes32' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'linkNote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'noteId', type: 'uint256' },
    ],
    name: 'lockNote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'noteId', type: 'uint256' },
          { name: 'to', type: 'address' },
          { name: 'mintModuleData', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'mintNote',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'data', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'contentUri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintModuleInitData', type: 'bytes' },
          { name: 'locked', type: 'bool' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'postNote',
    outputs: [{ name: 'noteId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'contentUri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintModuleInitData', type: 'bytes' },
          { name: 'locked', type: 'bool' },
        ],
        name: 'vars',
        type: 'tuple',
      },
      { name: 'ethAddress', type: 'address' },
    ],
    name: 'postNote4Address',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'contentUri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintModuleInitData', type: 'bytes' },
          { name: 'locked', type: 'bool' },
        ],
        name: 'vars',
        type: 'tuple',
      },
      { name: 'uri', type: 'string' },
    ],
    name: 'postNote4AnyUri',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'contentUri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintModuleInitData', type: 'bytes' },
          { name: 'locked', type: 'bool' },
        ],
        name: 'vars',
        type: 'tuple',
      },
      { name: 'toCharacterId', type: 'uint256' },
    ],
    name: 'postNote4Character',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'contentUri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintModuleInitData', type: 'bytes' },
          { name: 'locked', type: 'bool' },
        ],
        name: 'vars',
        type: 'tuple',
      },
      {
        components: [
          { name: 'tokenAddress', type: 'address' },
          { name: 'erc721TokenId', type: 'uint256' },
        ],
        name: 'erc721',
        type: 'tuple',
      },
    ],
    name: 'postNote4ERC721',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'contentUri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintModuleInitData', type: 'bytes' },
          { name: 'locked', type: 'bool' },
        ],
        name: 'vars',
        type: 'tuple',
      },
      { name: 'toLinklistId', type: 'uint256' },
    ],
    name: 'postNote4Linklist',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'contentUri', type: 'string' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintModuleInitData', type: 'bytes' },
          { name: 'locked', type: 'bool' },
        ],
        name: 'vars',
        type: 'tuple',
      },
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'noteId', type: 'uint256' },
        ],
        name: 'note',
        type: 'tuple',
      },
    ],
    name: 'postNote4Note',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'resolver',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: '_data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'newUri', type: 'string' },
    ],
    name: 'setCharacterUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'newHandle', type: 'string' },
    ],
    name: 'setHandle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'account', type: 'address' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'setLinkModule4Address',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'linklistId', type: 'uint256' },
          { name: 'linkModule', type: 'address' },
          { name: 'linkModuleInitData', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'setLinkModule4Linklist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'linklistId', type: 'uint256' },
      { name: 'uri', type: 'string' },
    ],
    name: 'setLinklistUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'characterId', type: 'uint256' },
          { name: 'noteId', type: 'uint256' },
          { name: 'mintModule', type: 'address' },
          { name: 'mintModuleInitData', type: 'bytes' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'setMintModule4Note',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'noteId', type: 'uint256' },
      { name: 'newUri', type: 'string' },
    ],
    name: 'setNoteUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'characterId', type: 'uint256' }],
    name: 'setPrimaryCharacterId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'characterId', type: 'uint256' },
      { name: 'tokenAddress', type: 'address' },
    ],
    name: 'setSocialToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'characterId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'ethAddress', type: 'address' },
          { name: 'linkType', type: 'bytes32' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'unlinkAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'toUri', type: 'string' },
          { name: 'linkType', type: 'bytes32' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'unlinkAnyUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'toCharacterId', type: 'uint256' },
          { name: 'linkType', type: 'bytes32' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'unlinkCharacter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'tokenAddress', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'linkType', type: 'bytes32' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'unlinkERC721',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'toLinkListId', type: 'uint256' },
          { name: 'linkType', type: 'bytes32' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'unlinkLinklist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'fromCharacterId', type: 'uint256' },
          { name: 'toCharacterId', type: 'uint256' },
          { name: 'toNoteId', type: 'uint256' },
          { name: 'linkType', type: 'bytes32' },
        ],
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'unlinkNote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { indexed: true, name: 'linklistId', type: 'uint256' },
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'linkType', type: 'bytes32' },
    ],
    name: 'AttachLinklist',
    type: 'event',
  },
  {
    inputs: [
      { indexed: false, name: 'name', type: 'string' },
      { indexed: false, name: 'symbol', type: 'string' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'BaseInitialized',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'creator', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'handle', type: 'string' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'CharacterCreated',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: false, name: 'noteId', type: 'uint256' },
    ],
    name: 'DeleteNote',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'linklistId', type: 'uint256' },
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'linkType', type: 'bytes32' },
    ],
    name: 'DetachLinklist',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'operator', type: 'address' },
      { indexed: false, name: 'permissionBitMap', type: 'uint256' },
    ],
    name: 'GrantOperatorPermissions',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'noteId', type: 'uint256' },
      { indexed: false, name: 'blocklist', type: 'address[]' },
      { indexed: false, name: 'allowlist', type: 'address[]' },
    ],
    name: 'GrantOperators4Note',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'ethAddress', type: 'address' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'linklistId', type: 'uint256' },
    ],
    name: 'LinkAddress',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: false, name: 'toUri', type: 'string' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'linklistId', type: 'uint256' },
    ],
    name: 'LinkAnyUri',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'account', type: 'address' },
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'toCharacterId', type: 'uint256' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'linklistId', type: 'uint256' },
    ],
    name: 'LinkCharacter',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'clFromCharacterId', type: 'uint256' },
      { indexed: false, name: 'clToCharacterId', type: 'uint256' },
      { indexed: false, name: 'clLinkType', type: 'bytes32' },
    ],
    name: 'LinkCharacterLink',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'tokenAddress', type: 'address' },
      { indexed: true, name: 'toNoteId', type: 'uint256' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'linklistId', type: 'uint256' },
    ],
    name: 'LinkERC721',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'toLinklistId', type: 'uint256' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: true, name: 'linklistId', type: 'uint256' },
    ],
    name: 'LinkLinklist',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'toCharacterId', type: 'uint256' },
      { indexed: true, name: 'toNoteId', type: 'uint256' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'linklistId', type: 'uint256' },
    ],
    name: 'LinkNote',
    type: 'event',
  },
  {
    inputs: [{ indexed: false, name: 'timestamp', type: 'uint256' }],
    name: 'LinklistNFTInitialized',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: false, name: 'noteId', type: 'uint256' },
    ],
    name: 'LockNote',
    type: 'event',
  },
  {
    inputs: [
      { indexed: false, name: 'characterId', type: 'uint256' },
      { indexed: false, name: 'noteId', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'MintNFTInitialized',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'noteId', type: 'uint256' },
      { indexed: false, name: 'tokenAddress', type: 'address' },
      { indexed: false, name: 'tokenId', type: 'uint256' },
    ],
    name: 'MintNote',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'noteId', type: 'uint256' },
      { indexed: true, name: 'linkKey', type: 'bytes32' },
      { indexed: false, name: 'linkItemType', type: 'bytes32' },
      { indexed: false, name: 'data', type: 'bytes' },
    ],
    name: 'PostNote',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'noteId', type: 'uint256' },
      { indexed: true, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'approvedAddresses', type: 'address[]' },
    ],
    name: 'SetApprovedMintAmount4Addresses',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: false, name: 'newUri', type: 'string' },
    ],
    name: 'SetCharacterUri',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'account', type: 'address' },
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: false, name: 'newHandle', type: 'string' },
    ],
    name: 'SetHandle',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'account', type: 'address' },
      { indexed: true, name: 'linkModule', type: 'address' },
      { indexed: false, name: 'linkModuleInitData', type: 'bytes' },
      { indexed: false, name: 'returnData', type: 'bytes' },
    ],
    name: 'SetLinkModule4Address',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'linkModule', type: 'address' },
      { indexed: false, name: 'linkModuleInitData', type: 'bytes' },
      { indexed: false, name: 'returnData', type: 'bytes' },
    ],
    name: 'SetLinkModule4Character',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'tokenAddress', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'linkModule', type: 'address' },
      { indexed: false, name: 'linkModuleInitData', type: 'bytes' },
      { indexed: false, name: 'returnData', type: 'bytes' },
    ],
    name: 'SetLinkModule4ERC721',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'linklistId', type: 'uint256' },
      { indexed: true, name: 'linkModule', type: 'address' },
      { indexed: false, name: 'linkModuleInitData', type: 'bytes' },
      { indexed: false, name: 'returnData', type: 'bytes' },
    ],
    name: 'SetLinkModule4Linklist',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'noteId', type: 'uint256' },
      { indexed: true, name: 'linkModule', type: 'address' },
      { indexed: false, name: 'linkModuleInitData', type: 'bytes' },
      { indexed: false, name: 'returnData', type: 'bytes' },
    ],
    name: 'SetLinkModule4Note',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'noteId', type: 'uint256' },
      { indexed: true, name: 'mintModule', type: 'address' },
      { indexed: false, name: 'mintModuleInitData', type: 'bytes' },
      { indexed: false, name: 'returnData', type: 'bytes' },
    ],
    name: 'SetMintModule4Note',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: false, name: 'noteId', type: 'uint256' },
      { indexed: false, name: 'newUri', type: 'string' },
    ],
    name: 'SetNoteUri',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'account', type: 'address' },
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'oldCharacterId', type: 'uint256' },
    ],
    name: 'SetPrimaryCharacterId',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'account', type: 'address' },
      { indexed: true, name: 'characterId', type: 'uint256' },
      { indexed: true, name: 'tokenAddress', type: 'address' },
    ],
    name: 'SetSocialToken',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'ethAddress', type: 'address' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
    ],
    name: 'UnlinkAddress',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: false, name: 'toUri', type: 'string' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
    ],
    name: 'UnlinkAnyUri',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'account', type: 'address' },
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'toCharacterId', type: 'uint256' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
    ],
    name: 'UnlinkCharacter',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'clFromCharactereId', type: 'uint256' },
      { indexed: false, name: 'clToCharacterId', type: 'uint256' },
      { indexed: false, name: 'clLinkType', type: 'bytes32' },
    ],
    name: 'UnlinkCharacterLink',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'tokenAddress', type: 'address' },
      { indexed: true, name: 'toNoteId', type: 'uint256' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'linklistId', type: 'uint256' },
    ],
    name: 'UnlinkERC721',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'toLinklistId', type: 'uint256' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: true, name: 'linklistId', type: 'uint256' },
    ],
    name: 'UnlinkLinklist',
    type: 'event',
  },
  {
    inputs: [
      { indexed: true, name: 'fromCharacterId', type: 'uint256' },
      { indexed: true, name: 'toCharacterId', type: 'uint256' },
      { indexed: true, name: 'toNoteId', type: 'uint256' },
      { indexed: false, name: 'linkType', type: 'bytes32' },
      { indexed: false, name: 'linklistId', type: 'uint256' },
    ],
    name: 'UnlinkNote',
    type: 'event',
  },
  {
    inputs: [{ indexed: false, name: 'timestamp', type: 'uint256' }],
    name: 'Web3EntryInitialized',
    type: 'event',
  },
] as const
export type Entry = typeof entry
