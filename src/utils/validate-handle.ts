import type { Indexer } from "../indexer";

/**
 *
 * @deprecated Use {@link validateHandleFormat} and {@link indexer.character.checkIfHandleExists} instead.
 *
 * The ValidateHandleError type represents the type of validation errors that can occur.
 *
 * - 'existed': The handle is already in use.
 * - 'lengthInvalid': The handle must be between 3 and 31 characters.
 * - 'charsInvalid': The handle must only contain lower-case letters, numbers, hyphens (-), or underscores (_).
 */
export type ValidateHandleError = "existed" | "lengthInvalid" | "charsInvalid";

/**
 * Validate a handle.
 *
 * @deprecated Use {@link validateHandleFormat} and {@link indexer.character.checkIfHandleExists} instead.
 *
 * @param handle - The handle to be validated.
 * @param indexer - Indexer for checking the existence of the handle.
 * @returns A Promise that resolves to a ValidateHandleError type error indicator, or null if the handle is valid.
 */
export async function validateHandle(
	handle: string,
	indexer: Indexer,
): Promise<ValidateHandleError | null> {
	if (handle.length >= 32 || handle.length <= 2) {
		return "lengthInvalid";
	}

	if (!/^[\d_a-z-]+$/.test(handle)) {
		return "charsInvalid";
	}

	if (await checkIfExisted(handle, indexer)) {
		return "existed";
	}

	return null;
}

async function checkIfExisted(
	handle: string,
	indexer: Indexer,
): Promise<boolean> {
	return !!(await indexer.character.getByHandle(handle));
}

/**
 * This validates a handle format.
 *
 * A correct handle must be:
 * 1. between 3 and 31 characters
 * 2. only contain [a-z0-9-_]
 *
 * Optional:
 *
 * 3. not be an Ethereum address (when `disallowAddress` is set to `true`; `false` by default)
 *
 * Some correct handles examples:
 * - `abcdefg`
 * - `my-handle`
 * - `my-handle_123`
 *
 * Some incorrect handles examples:
 * - `ab` (too short)
 * - `my handle` (contains space)
 * - `my-handle!` (contains `!`)
 * - `WhatIsThis` (contains uppercase)
 *
 * @returns An object with `valid` and `message` properties.
 * If `valid` is `true`, then the handle is valid.
 * If `valid` is `false`, then the handle is invalid, and the `message` property contains the reason why it is invalid.
 *
 * @example
 * ```js
 * const { valid, message } = contract.character.validateHandle('my-handle')
 * if (!valid) {
 *  throw new Error(message)
 * }
 * ```
 */
export function validateHandleFormat(
	value: string,
	{
		disallowAddress = false,
	}: {
		/**
		 * Whether to disallow Ethereum addresses as handles.
		 *
		 * This is normally used when registering a handle for a user,
		 * because Ethereum addresses are not allowed as handles when creating a character.
		 *
		 * But note that there are some characters that have Ethereum addresses as handles.
		 * This is because they were created by the {@link `createThenLinkCharacter`} contract method.
		 *
		 * @default `false`.
		 */
		disallowAddress?: boolean;
	} = {},
):
	| {
			readonly valid: true;
			readonly code: "valid";
			readonly message: null;
	  }
	| {
			readonly valid: false;
			readonly code:
				| "invalidLength"
				| "invalidChars"
				| "shouldNotBeAddress"
				| "notAString";
			readonly message: string;
	  } {
	if (typeof value !== "string") {
		return {
			valid: false,
			code: "notAString",
			message: "Handle must be a string.",
		};
	}

	if (value.length === 42 && value.startsWith("0x")) {
		if (disallowAddress) {
			return {
				valid: false,
				code: "shouldNotBeAddress",
				message: "Handle must not be an Ethereum address.",
			};
		}
		return { valid: true, code: "valid", message: null };
	}

	if (value.length < 3 || value.length > 31) {
		return {
			valid: false,
			code: "invalidLength",
			message: "Handle must be between 3 and 31 characters.",
		};
	}

	if (/^[\d_a-z-]+$/i.test(value)) {
		return { valid: true, code: "valid", message: null };
	}

	return {
		valid: false,
		code: "invalidChars",
		message: "Handle must only contain [a-z0-9-_].",
	};
}
