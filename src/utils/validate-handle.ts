import { type Indexer } from '../indexer'

export type ValidateHandleError = 'existed' | 'lengthInvalid' | 'charsInvalid'

export async function validateHandle(
  handle: string,
  indexer: Indexer,
): Promise<ValidateHandleError | null> {
  if (handle.length >= 32 || handle.length <= 2) {
    return 'lengthInvalid'
  }

  if (!/^[\d_a-z-]+$/.test(handle)) {
    return 'charsInvalid'
  }

  if (await checkIfExisted(handle, indexer)) {
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
