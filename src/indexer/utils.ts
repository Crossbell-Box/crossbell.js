let headersScope: HeadersInit | undefined
export function getHeadersScope() {
  return headersScope
}

/**
 * Attach headers to request headers from callback function.
 *
 * **Note**: This function does not work with multiple asynchronous
 * operations by default. If you want to apply to multiple
 * asynchronous operations, you need to call the `ensure` function
 * before each asynchronous operation. (the first one doesn't need)
 *
 * @example
 * ```ts
 * const result = withHeaders(() =>
 *   indexer.character.getMany(address),
 *   { 'X-My-Header': 'foo' }
 * )
 * ```
 *
 * @param fn The callback function to request network.
 * @param headers It will be attached to request headers from callback function.
 */
export function withHeaders<T>(
  fn: (ensure: () => void) => T,
  headers: HeadersInit,
): T {
  const ensure = () => (headersScope = headers)

  ensure()
  const ret = fn(ensure)
  headersScope = undefined
  return ret
}
