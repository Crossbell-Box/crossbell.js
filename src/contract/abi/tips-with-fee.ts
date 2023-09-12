export const tipsWithFee = [
	{
		inputs: [{ indexed: false, name: 'version', type: 'uint8' }],
		name: 'Initialized',
		type: 'event',
	},
	{
		inputs: [
			{ indexed: true, name: 'fromCharacterId', type: 'uint256' },
			{ indexed: true, name: 'toCharacterId', type: 'uint256' },
			{ indexed: false, name: 'token', type: 'address' },
			{ indexed: false, name: 'amount', type: 'uint256' },
			{ indexed: false, name: 'fee', type: 'uint256' },
			{ indexed: false, name: 'feeReceiver', type: 'address' },
		],
		name: 'TipCharacter',
		type: 'event',
	},
	{
		inputs: [
			{ indexed: true, name: 'fromCharacterId', type: 'uint256' },
			{ indexed: true, name: 'toCharacterId', type: 'uint256' },
			{ indexed: true, name: 'toNoteId', type: 'uint256' },
			{ indexed: false, name: 'token', type: 'address' },
			{ indexed: false, name: 'amount', type: 'uint256' },
			{ indexed: false, name: 'fee', type: 'uint256' },
			{ indexed: false, name: 'feeReceiver', type: 'address' },
		],
		name: 'TipCharacterForNote',
		type: 'event',
	},
	{
		inputs: [],
		name: 'ERC1820_REGISTRY',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'TOKENS_RECIPIENT_INTERFACE_HASH',
		outputs: [{ name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'feeReceiver', type: 'address' },
			{ name: 'characterId', type: 'uint256' },
			{ name: 'noteId', type: 'uint256' },
			{ name: 'tipAmount', type: 'uint256' },
		],
		name: 'getFeeAmount',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'feeReceiver', type: 'address' },
			{ name: 'characterId', type: 'uint256' },
			{ name: 'noteId', type: 'uint256' },
		],
		name: 'getFeeFraction',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getToken',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getWeb3Entry',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'web3Entry_', type: 'address' },
			{ name: 'token_', type: 'address' },
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'feeReceiver', type: 'address' },
			{ name: 'fraction', type: 'uint256' },
		],
		name: 'setDefaultFeeFraction',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'feeReceiver', type: 'address' },
			{ name: 'characterId', type: 'uint256' },
			{ name: 'fraction', type: 'uint256' },
		],
		name: 'setFeeFraction4Character',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'feeReceiver', type: 'address' },
			{ name: 'characterId', type: 'uint256' },
			{ name: 'noteId', type: 'uint256' },
			{ name: 'fraction', type: 'uint256' },
		],
		name: 'setFeeFraction4Note',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ name: '', type: 'address' },
			{ name: 'from', type: 'address' },
			{ name: 'to', type: 'address' },
			{ name: 'amount', type: 'uint256' },
			{ name: 'userData', type: 'bytes' },
			{ name: 'operatorData', type: 'bytes' },
		],
		name: 'tokensReceived',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const
export type TipsWithFee = typeof tipsWithFee
