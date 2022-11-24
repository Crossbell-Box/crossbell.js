export type ListResponse<T> = {
  cursor: string | null
  count: number
  list: T[]
}
