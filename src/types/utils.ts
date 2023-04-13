export type MaybeArray<T> = T | T[]
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
