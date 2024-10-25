import { defineChain } from "viem/chains/utils";

export const crossbellTestnet = /*#__PURE__*/ defineChain({
	id: 3_636,
	name: "Crossbell L2 Testnet",
	nativeCurrency: {
		decimals: 18,
		name: "ETH",
		symbol: "ETH",
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.testnet.crossbell.io"],
		},
	},
	blockExplorers: {
		default: {
			name: "CrossScan Testnet",
			url: "https://scan.testnet.crossbell.io/",
		},
	},
	contracts: {
		multicall3: {
			address: "0xcA11bde05977b3631167028862bE2a173976CA11",
			blockCreated: 0,
		},
	},
	testnet: true,
});
