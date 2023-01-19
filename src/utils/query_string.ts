import { BigNumberish } from 'ethers'

export function createSearchParamsString(
  params: Record<
    string,
    string | string[] | BigNumberish | BigNumberish[] | boolean | undefined
  >,
) {
  return new URLSearchParams(
    Object.entries(params)
      .filter(
        (entry): entry is [string, string | string[]] => entry[1] !== undefined,
      )
      .flatMap(([key, values]) =>
        Array.isArray(values)
          ? values.map((value) => [key, value.toString()])
          : [[key, values.toString()]],
      ),
  ).toString()
}
