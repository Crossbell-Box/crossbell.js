export const tipsWithConfig = [
	{
		inputs: [{ indexed: true, name: 'tipConfigId', type: 'uint256' }],
		name: 'CancelTips4Character',
		type: 'event',
	},
	{
		inputs: [
			{ indexed: true, name: 'tipConfigId', type: 'uint256' },
			{ indexed: true, name: 'fromCharacterId', type: 'uint256' },
			{ indexed: true, name: 'toCharacterId', type: 'uint256' },
			{ indexed: false, name: 'token', type: 'address' },
			{ indexed: false, name: 'amount', type: 'uint256' },
			{ indexed: false, name: 'fee', type: 'uint256' },
			{ indexed: false, name: 'feeReceiver', type: 'address' },
			{ indexed: false, name: 'currentRound', type: 'uint256' },
		],
		name: 'CollectTips4Character',
		type: 'event',
	},
	{
		inputs: [{ indexed: false, name: 'version', type: 'uint8' }],
		name: 'Initialized',
		type: 'event',
	},
	{
		inputs: [
			{ indexed: true, name: 'tipConfigId', type: 'uint256' },
			{ indexed: true, name: 'fromCharacterId', type: 'uint256' },
			{ indexed: true, name: 'toCharacterId', type: 'uint256' },
			{ indexed: false, name: 'token', type: 'address' },
			{ indexed: false, name: 'amount', type: 'uint256' },
			{ indexed: false, name: 'startTime', type: 'uint256' },
			{ indexed: false, name: 'endTime', type: 'uint256' },
			{ indexed: false, name: 'interval', type: 'uint256' },
			{ indexed: false, name: 'feeReceiver', type: 'address' },
			{ indexed: false, name: 'totalRound', type: 'uint256' },
		],
		name: 'SetTipsConfig4Character',
		type: 'event',
	},
	{
		inputs: [{ name: 'tipConfigId', type: 'uint256' }],
		name: 'cancelTips4Character',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ name: 'tipConfigId', type: 'uint256' }],
		name: 'collectTips4Character',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'feeReceiver', type: 'address' },
			{ name: 'characterId', type: 'uint256' },
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
		],
		name: 'getFeeFraction',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ name: 'tipConfigId', type: 'uint256' }],
		name: 'getTipsConfig',
		outputs: [
			{
				components: [
					{ name: 'id', type: 'uint256' },
					{ name: 'fromCharacterId', type: 'uint256' },
					{ name: 'toCharacterId', type: 'uint256' },
					{ name: 'token', type: 'address' },
					{ name: 'amount', type: 'uint256' },
					{ name: 'startTime', type: 'uint256' },
					{ name: 'endTime', type: 'uint256' },
					{ name: 'interval', type: 'uint256' },
					{ name: 'feeReceiver', type: 'address' },
					{ name: 'totalRound', type: 'uint256' },
					{ name: 'currentRound', type: 'uint256' },
				],
				name: 'config',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'fromCharacterId', type: 'uint256' },
			{ name: 'toCharacterId', type: 'uint256' },
		],
		name: 'getTipsConfigId',
		outputs: [{ name: '', type: 'uint256' }],
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
		inputs: [{ name: 'web3Entry_', type: 'address' }],
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
			{ name: 'fromCharacterId', type: 'uint256' },
			{ name: 'toCharacterId', type: 'uint256' },
			{ name: 'token', type: 'address' },
			{ name: 'amount', type: 'uint256' },
			{ name: 'startTime', type: 'uint256' },
			{ name: 'endTime', type: 'uint256' },
			{ name: 'interval', type: 'uint256' },
			{ name: 'feeReceiver', type: 'address' },
		],
		name: 'setTipsConfig4Character',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const
export type TipsWithConfig = typeof tipsWithConfig
