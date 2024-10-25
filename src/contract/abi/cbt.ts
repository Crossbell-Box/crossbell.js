export const cbt = [
	{
		inputs: [{ name: "web3Entry", type: "address" }],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [
			{ indexed: true, name: "account", type: "address" },
			{ indexed: true, name: "operator", type: "address" },
			{ indexed: false, name: "approved", type: "bool" },
		],
		name: "ApprovalForAll",
		type: "event",
	},
	{
		inputs: [
			{ indexed: true, name: "from", type: "uint256" },
			{ indexed: true, name: "tokenId", type: "uint256" },
			{ indexed: true, name: "amount", type: "uint256" },
		],
		name: "Burn",
		type: "event",
	},
	{
		inputs: [
			{ indexed: true, name: "to", type: "uint256" },
			{ indexed: true, name: "tokenId", type: "uint256" },
			{ indexed: true, name: "tokenNumber", type: "uint256" },
		],
		name: "Mint",
		type: "event",
	},
	{
		inputs: [
			{ indexed: true, name: "role", type: "bytes32" },
			{ indexed: true, name: "previousAdminRole", type: "bytes32" },
			{ indexed: true, name: "newAdminRole", type: "bytes32" },
		],
		name: "RoleAdminChanged",
		type: "event",
	},
	{
		inputs: [
			{ indexed: true, name: "role", type: "bytes32" },
			{ indexed: true, name: "account", type: "address" },
			{ indexed: true, name: "sender", type: "address" },
		],
		name: "RoleGranted",
		type: "event",
	},
	{
		inputs: [
			{ indexed: true, name: "role", type: "bytes32" },
			{ indexed: true, name: "account", type: "address" },
			{ indexed: true, name: "sender", type: "address" },
		],
		name: "RoleRevoked",
		type: "event",
	},
	{
		inputs: [
			{ indexed: true, name: "operator", type: "address" },
			{ indexed: true, name: "from", type: "address" },
			{ indexed: true, name: "to", type: "address" },
			{ indexed: false, name: "ids", type: "uint256[]" },
			{ indexed: false, name: "values", type: "uint256[]" },
		],
		name: "TransferBatch",
		type: "event",
	},
	{
		inputs: [
			{ indexed: true, name: "operator", type: "address" },
			{ indexed: true, name: "from", type: "address" },
			{ indexed: true, name: "to", type: "address" },
			{ indexed: false, name: "id", type: "uint256" },
			{ indexed: false, name: "value", type: "uint256" },
		],
		name: "TransferSingle",
		type: "event",
	},
	{
		inputs: [
			{ indexed: false, name: "value", type: "string" },
			{ indexed: true, name: "id", type: "uint256" },
		],
		name: "URI",
		type: "event",
	},
	{
		inputs: [],
		name: "DEFAULT_ADMIN_ROLE",
		outputs: [{ name: "", type: "bytes32" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "MINTER_ROLE",
		outputs: [{ name: "", type: "bytes32" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_web3Entry",
		outputs: [{ name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ name: "account", type: "address" },
			{ name: "tokenId", type: "uint256" },
		],
		name: "balanceOf",
		outputs: [{ name: "balance", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ name: "characterId", type: "uint256" },
			{ name: "tokenId", type: "uint256" },
		],
		name: "balanceOf",
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ name: "accounts", type: "address[]" },
			{ name: "tokenIds", type: "uint256[]" },
		],
		name: "balanceOfBatch",
		outputs: [{ name: "", type: "uint256[]" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ name: "characterId", type: "uint256" },
			{ name: "tokenId", type: "uint256" },
			{ name: "amount", type: "uint256" },
		],
		name: "burn",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ name: "role", type: "bytes32" }],
		name: "getRoleAdmin",
		outputs: [{ name: "", type: "bytes32" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ name: "role", type: "bytes32" },
			{ name: "index", type: "uint256" },
		],
		name: "getRoleMember",
		outputs: [{ name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ name: "role", type: "bytes32" }],
		name: "getRoleMemberCount",
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ name: "role", type: "bytes32" },
			{ name: "account", type: "address" },
		],
		name: "grantRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ name: "role", type: "bytes32" },
			{ name: "account", type: "address" },
		],
		name: "hasRole",
		outputs: [{ name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ name: "account", type: "address" },
			{ name: "operator", type: "address" },
		],
		name: "isApprovedForAll",
		outputs: [{ name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ name: "characterId", type: "uint256" },
			{ name: "tokenId", type: "uint256" },
		],
		name: "mint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ name: "role", type: "bytes32" },
			{ name: "account", type: "address" },
		],
		name: "renounceRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ name: "role", type: "bytes32" },
			{ name: "account", type: "address" },
		],
		name: "revokeRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ name: "", type: "address" },
			{ name: "", type: "address" },
			{ name: "", type: "uint256[]" },
			{ name: "", type: "uint256[]" },
			{ name: "", type: "bytes" },
		],
		name: "safeBatchTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ name: "", type: "address" },
			{ name: "", type: "address" },
			{ name: "", type: "uint256" },
			{ name: "", type: "uint256" },
			{ name: "", type: "bytes" },
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ name: "operator", type: "address" },
			{ name: "approved", type: "bool" },
		],
		name: "setApprovalForAll",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ name: "tokenId", type: "uint256" },
			{ name: "tokenURI", type: "string" },
		],
		name: "setTokenURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ name: "interfaceId", type: "bytes4" }],
		name: "supportsInterface",
		outputs: [{ name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ name: "tokenId", type: "uint256" }],
		name: "uri",
		outputs: [{ name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
] as const;
export type Cbt = typeof cbt;
