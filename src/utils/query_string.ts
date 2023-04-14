import { type MaybeArray, type Numberish } from '../types'

export function createSearchParamsString(
  params: Record<string, MaybeArray<Numberish> | boolean | undefined | null>,
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
