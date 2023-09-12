export const periphery = [
	{
		inputs: [{ name: 'linkKey', type: 'bytes32' }],
		name: 'getLinkingAddress',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'fromCharacterId', type: 'uint256' },
			{ name: 'linkType', type: 'bytes32' },
		],
		name: 'getLinkingAddresses',
		outputs: [{ name: '', type: 'address[]' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ name: 'linkKey', type: 'bytes32' }],
		name: 'getLinkingAnyUri',
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'fromCharacterId', type: 'uint256' },
			{ name: 'linkType', type: 'bytes32' },
		],
		name: 'getLinkingAnyUris',
		outputs: [{ name: 'results', type: 'string[]' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ name: 'linkKey', type: 'bytes32' }],
		name: 'getLinkingCharacterId',
		outputs: [{ name: 'characterId', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'fromCharacterId', type: 'uint256' },
			{ name: 'linkType', type: 'bytes32' },
		],
		name: 'getLinkingCharacterIds',
		outputs: [{ name: 'results', type: 'uint256[]' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ name: 'linkKey', type: 'bytes32' }],
		name: 'getLinkingERC721',
		outputs: [
			{
				components: [
					{ name: 'tokenAddress', type: 'address' },
					{ name: 'erc721TokenId', type: 'uint256' },
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
			{ name: 'fromCharacterId', type: 'uint256' },
			{ name: 'linkType', type: 'bytes32' },
		],
		name: 'getLinkingERC721s',
		outputs: [
			{
				components: [
					{ name: 'tokenAddress', type: 'address' },
					{ name: 'erc721TokenId', type: 'uint256' },
				],
				name: 'results',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ name: 'linkKey', type: 'bytes32' }],
		name: 'getLinkingLinklistId',
		outputs: [{ name: 'linklistId', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'fromCharacterId', type: 'uint256' },
			{ name: 'linkType', type: 'bytes32' },
		],
		name: 'getLinkingLinklistIds',
		outputs: [{ name: 'linklistIds', type: 'uint256[]' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ name: 'linkKey', type: 'bytes32' }],
		name: 'getLinkingNote',
		outputs: [
			{
				components: [
					{ name: 'characterId', type: 'uint256' },
					{ name: 'noteId', type: 'uint256' },
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
			{ name: 'fromCharacterId', type: 'uint256' },
			{ name: 'linkType', type: 'bytes32' },
		],
		name: 'getLinkingNotes',
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
				name: 'results',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'characterId', type: 'uint256' },
			{ name: 'offset', type: 'uint256' },
			{ name: 'limit', type: 'uint256' },
		],
		name: 'getNotesByCharacterId',
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
				name: 'results',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: '_web3Entry', type: 'address' },
			{ name: '_linklist', type: 'address' },
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{ name: 'fromCharacterId', type: 'uint256' },
					{ name: 'toCharacterIds', type: 'uint256[]' },
					{ name: 'data', type: 'bytes[]' },
					{ name: 'toAddresses', type: 'address[]' },
					{ name: 'linkType', type: 'bytes32' },
				],
				name: 'vars',
				type: 'tuple',
			},
		],
		name: 'linkCharactersInBatch',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'linklist',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{ name: 'account', type: 'address' },
					{ name: 'handle', type: 'string' },
					{ name: 'uri', type: 'string' },
					{ name: 'toAddresses', type: 'address[]' },
					{ name: 'linkType', type: 'bytes32' },
				],
				name: 'vars',
				type: 'tuple',
			},
		],
		name: 'migrate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'web3Entry',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
] as const
export type Periphery = typeof periphery
