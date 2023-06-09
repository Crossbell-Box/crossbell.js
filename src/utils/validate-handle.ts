import { type Indexer } from '../indexer'

/**
 * The ValidateHandleError type represents the type of validation errors that can occur.
 *
 * - 'existed': The handle is already in use.
 * - 'lengthInvalid': The handle must be between 3 and 31 characters.
 * - 'charsInvalid': The handle must only contain lower-case letters, numbers, hyphens (-), or underscores (_).
 */
export type ValidateHandleError = 'existed' | 'lengthInvalid' | 'charsInvalid'

/**
 * Validate a handle.
 *
 * If no Indexer is provided, it will only check the format of the handle.
 * If an Indexer is provided, it will also check if the handle is already in use.
 *
 * @param handle - The handle to be validated.
 * @param indexer - An optional Indexer for checking the existence of the handle.
 * @returns A Promise that resolves to a ValidateHandleError type error indicator, or null if the handle is valid.
 */
export async function validateHandle(
  handle: string,
  indexer?: Indexer,
): Promise<ValidateHandleError | null> {
  if (handle.length >= 32 || handle.length <= 2) {
    return 'lengthInvalid'
  }

  if (!/^[\d_a-z-]+$/.test(handle)) {
    return 'charsInvalid'
  }

  if (indexer && (await checkIfExisted(handle, indexer))) {
    return 'existed'
  }

  return null
}

async function checkIfExisted(
  handle: string,
  indexer: Indexer,
): Promise<boolean> {
  return !!(await indexer.character.getByHandle(handle))
}
