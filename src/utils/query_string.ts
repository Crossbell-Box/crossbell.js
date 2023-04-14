import { type MaybeArray } from '../types/utils'

export function createSearchParamsString(
  params: Record<
    string,
    MaybeArray<string | bigint | number> | boolean | undefined | null
  >,
) {
  return new URLSearchParams(
    Object.entries(params)
      .filter(
        (entry): entry is [string, string | string[]] =>
          entry[1] !== undefined && entry[1] !== null,
      )
      .flatMap(([key, values]) =>
        Array.isArray(values)
          ? values.map((value) => [key, value.toString()])
          : [[key, values.toString()]],
      ),
  ).toString()
}
