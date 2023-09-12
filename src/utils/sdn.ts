import { type Address } from 'viem'

// https://home.treasury.gov/policy-issues/financial-sanctions/recent-actions/20220808
const sdnList = new Set([
	'0x8589427373d6d84e98730d7795d8f6f8731fda16',
	'0x722122df12d4e14e13ac3b6895a86e84145b6967',
	'0xdd4c48c0b24039969fc16d1cdf626eab821d3384',
	'0xd90e2f925da726b50c4ed8d0fb90ad053324f31b',
	'0xd96f2b1c14db8458374d9aca76e26c3d18364307',
	'0x4736dcf1b7a3d580672cce6e7c65cd5cc9cfba9d',
	'0xd4b88df4d29f5cedd6857912842cff3b20c8cfa3',
	'0x910cbd523d972eb0a6f4cae4618ad62622b39dbf',
	'0xa160cdab225685da1d56aa342ad8841c3b53f291',
	'0xfd8610d20aa15b7b2e3be39b396a1bc3516c7144',
	'0xf60dd140cff0706bae9cd734ac3ae76ad9ebc32a',
	'0x22aaa7720ddd5388a3c0a3333430953c68f1849b',
	'0xba214c1c1928a32bffe790263e38b4af9bfcd659',
	'0xb1c8094b234dce6e03f10a5b673c1d8c69739a00',
	'0x527653ea119f3e6a1f5bd18fbf4714081d7b31ce',
	'0x58e8dcc13be9780fc42e8723d8ead4cf46943df2',
	'0xd691f27f38b395864ea86cfc7253969b409c362d',
	'0xaeaac358560e11f52454d997aaff2c5731b6f8a6',
	'0x1356c899d8c9467c7f71c195612f8a395abf2f0a',
	'0xa60c772958a3ed56c1f15dd055ba37ac8e523a0d',
	'0x169ad27a470d064dede56a2d3ff727986b15d52b',
	'0x0836222f2b2b24a3f36f98668ed8f0b38d1a872f',
	'0xf67721a2d8f736e75a49fdd7fad2e31d8676542a',
	'0x9ad122c22b14202b4490edaf288fdb3c7cb3ff5e',
	'0x905b63fff465b9ffbf41dea908ceb12478ec7601',
	'0x07687e702b410fa43f4cb4af7fa097918ffd2730',
	'0x94a1b5cdb22c43faab4abeb5c74999895464ddaf',
	'0xb541fc07bc7619fd4062a54d96268525cbc6ffef',
	'0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc',
	'0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936',
	'0x23773e65ed146a459791799d01336db287f25334',
	'0xd21be7248e0197ee08e0c20d4a96debdac3d20af',
	'0x610b717796ad172b316836ac95a2ffad065ceab4',
	'0x178169b423a011fff22b9e3f3abea13414ddd0f1',
	'0xbb93e510bbcd0b7beb5a853875f9ec60275cf498',
	'0x2717c5e28cf931547b621a5dddb772ab6a35b701',
	'0x03893a7c7463ae47d46bc7f091665f1893656003',
	'0xca0840578f57fe71599d29375e16783424023357',
	'0x58e8dcc13be9780fc42e8723d8ead4cf46943df2',
	'0x8589427373d6d84e98730d7795d8f6f8731fda16',
	'0x722122df12d4e14e13ac3b6895a86e84145b6967',
	'0xdd4c48c0b24039969fc16d1cdf626eab821d3384',
	'0xd90e2f925da726b50c4ed8d0fb90ad053324f31b',
	'0xd96f2b1c14db8458374d9aca76e26c3d18364307',
	'0x4736dcf1b7a3d580672cce6e7c65cd5cc9cfba9d',
])

const isInSdn = (address: Address) => {
	return sdnList.has(address.toLowerCase())
}

export const validateIsInSdn = (address: Address) => {
	if (isInSdn(address)) {
		throw new Error(
			`This address ${address} is in the U.S. SDN list. All transactions from this address will be rejected. Info: https://home.treasury.gov/policy-issues/financial-sanctions/recent-actions/20220808`,
		)
	}
}
