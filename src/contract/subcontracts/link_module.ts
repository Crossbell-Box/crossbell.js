import type {
	MintOrLinkModuleConfig,
	Numberish,
	Result,
	WriteOverrides,
} from "../../types";
import { getModuleConfig } from "../../utils/module";
import { waitForTransactionReceiptWithRetry } from "../../utils/viem";
import type { Entry } from "../abi";
import { autoSwitchMainnet } from "../decorators";
import type { BaseContract } from "./base";

export class LinkModuleContract {
	constructor(private base: BaseContract) {}

	/**
	 * This sets the link module for a character.
	 * @category LinkModule
	 * @returns The transaction hash.
	 */
	@autoSwitchMainnet()
	async setForCharacter(
		{
			characterId,
			linkModule,
		}: {
			/** The character ID to set the link module for. */
			characterId: Numberish;
			/** The link module to set. */
			linkModule: MintOrLinkModuleConfig;
		},
		overrides: WriteOverrides<Entry, "setLinkModule4Character"> = {},
	): Promise<Result<undefined, true>> {
		const moduleConfig = await getModuleConfig(linkModule);

		const hash = await this.base.contract.write.setLinkModule4Character(
			[
				{
					characterId: BigInt(characterId),
					linkModule: moduleConfig.address,
					linkModuleInitData: moduleConfig.initData,
				},
			],
			overrides,
		);

		const receipt = await waitForTransactionReceiptWithRetry(
			this.base.publicClient,
			hash,
		);

		return {
			data: undefined,
			transactionHash: receipt.transactionHash,
		};
	}

	/**
	 * This sets the link module for a note.
	 * @category LinkModule
	 * @returns The transaction hash.
	 */
	@autoSwitchMainnet()
	async setForNote(
		{
			characterId,
			noteId,
			linkModule,
		}: {
			/** The character ID to set the link module for. */
			characterId: Numberish;
			/** The note ID to set the link module for. */
			noteId: Numberish;
			/** The link module to set. */
			linkModule: MintOrLinkModuleConfig;
		},
		overrides: WriteOverrides<Entry, "setLinkModule4Character"> = {},
	): Promise<Result<undefined, true>> {
		const moduleConfig = await getModuleConfig(linkModule);

		const hash = await this.base.contract.write.setLinkModule4Note(
			[
				{
					characterId: BigInt(characterId),
					noteId: BigInt(noteId),
					linkModule: moduleConfig.address,
					linkModuleInitData: moduleConfig.initData,
				},
			],
			overrides,
		);

		const receipt = await waitForTransactionReceiptWithRetry(
			this.base.publicClient,
			hash,
		);

		return {
			data: undefined,
			transactionHash: receipt.transactionHash,
		};
	}

	/**
	 * This sets the link module for an address.
	 * @category LinkModule
	 * @param address The address to set the link module for.
	 * @param linkModule The link module to set.
	 * @returns The transaction hash.
	 */
	// @autoSwitchMainnet()
	// async setForAddress(
	//   {
	//     address,
	//     linkModule,
	//   }: { address: Address; linkModule: MintOrLinkModuleConfig },
	//   overrides: WriteOverrides<Entry, 'setLinkModule4Address'> = {},
	// ): Promise<Result<undefined, true>> {
	//   const moduleConfig = await getModuleConfig(linkModule)

	//   const hash = await this.base.contract.write.setLinkModule4Address(
	//     [
	//       {
	//         account: address,
	//         linkModule: moduleConfig.address,
	//         linkModuleInitData: moduleConfig.initData,
	//       },
	//     ],
	//     overrides,
	//   )

	//   const receipt = await waitForTransactionReceiptWithRetry(
	//     this.base.publicClient,
	//     hash,
	//   )

	//   return {
	//     data: undefined,
	//     transactionHash: receipt.transactionHash,
	//   }
	// }

	/**
	 * This sets the link module for a linklist.
	 * @category LinkModule
	 * @param linklistId The linklist ID to set the link module for.
	 * @param linkModule The link module to set.
	 * @returns The transaction hash.
	 */
	// @autoSwitchMainnet()
	// async setForLinklist(
	//   {
	//     linklistId,
	//     linkModule,
	//   }: { linklistId: Numberish; linkModule: MintOrLinkModuleConfig },
	//   overrides: WriteOverrides<Entry, 'setLinkModule4Linklist'> = {},
	// ): Promise<Result<undefined, true>> {
	//   const moduleConfig = await getModuleConfig(linkModule)

	//   const hash = await this.base.contract.write.setLinkModule4Linklist(
	//     [
	//       {
	//         linklistId: BigInt(linklistId),
	//         linkModule: moduleConfig.address,
	//         linkModuleInitData: moduleConfig.initData,
	//       },
	//     ],
	//     overrides,
	//   )

	//   const receipt = await waitForTransactionReceiptWithRetry(
	//     this.base.publicClient,
	//     hash,
	//   )

	//   return {
	//     data: undefined,
	//     transactionHash: receipt.transactionHash,
	//   }
	// }
}
