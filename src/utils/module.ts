import {
	type Address,
	type Hex,
	decodeAbiParameters,
	encodeAbiParameters,
	isAddressEqual,
} from 'viem'
import { type MintOrLinkModule, type MintOrLinkModuleConfig } from '../types'
import { NIL_ADDRESS } from './address'

let moduleResponseCache: MintOrLinkModule[] | undefined = undefined
let lastModuleResponseCacheTime = 0

export async function getModules<T extends MintOrLinkModule['type']>({
	type,
}: { type?: T } = {}): Promise<MintOrLinkModule<T>[]> {
	const now = Date.now()
	const isMoreThanOneMinute = now - lastModuleResponseCacheTime > 60 * 1000

	let res: MintOrLinkModule<T>[] = []
	if (!moduleResponseCache || isMoreThanOneMinute) {
		res = (await fetch(
			'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/deployments/modules.json',
		).then((res) => res.json())) as MintOrLinkModule<T>[]
		moduleResponseCache = res
		lastModuleResponseCacheTime = now
	} else {
		res = moduleResponseCache as MintOrLinkModule<T>[]
	}

	if (type) {
		return res.filter((module) => module.type === type)
	}

	return res
}

export async function getModule(address: Address) {
	const modules = await getModules()
	return modules.find((module) => isAddressEqual(module.address, address))
}

export function getLinkModules() {
	return getModules({ type: 'link' })
}

export async function getLinkModule(address: Address) {
	const modules = await getLinkModules()
	return modules.find(
		(module) =>
			isAddressEqual(module.address, address) && module.type === 'link',
	)
}

export function getMintModules() {
	return getModules({ type: 'mint' })
}

export async function getMintModule(address: Address) {
	const modules = await getMintModules()
	return modules.find(
		(module) =>
			isAddressEqual(module.address, address) && module.type === 'mint',
	)
}

export async function getModuleConfig(m?: MintOrLinkModuleConfig) {
	if (!m) {
		return {
			address: NIL_ADDRESS,
			initData: NIL_ADDRESS,
		}
	}

	const module = await getModule(m.address)
	if (!module) {
		throw new Error(`Invalid module address ${m.address}`)
	}

	const initData = encodeAbiParameters(
		module.initDataStructure.map((item) => ({
			type: item.type,
		})),
		m.data,
	)

	return {
		address: m.address,
		initData,
	}
}

export async function encodeModuleInitData(
	moduleAddress: Address,
	data: any[],
) {
	const module = await getModule(moduleAddress)
	if (!module) {
		throw new Error(`Invalid module address ${moduleAddress}`)
	}

	const result = encodeAbiParameters(
		module.initDataStructure.map((item) => ({ type: item.type })),
		data,
	)

	return result
}

export async function decodeModuleInitData(
	moduleAddress: Address,
	initData: Hex,
) {
	const module = await getModule(moduleAddress)
	if (!module) {
		throw new Error(`Invalid module address ${moduleAddress}`)
	}

	const result = decodeAbiParameters(
		module.initDataStructure.map((item) => ({ type: item.type })),
		initData,
	)

	return result
}
