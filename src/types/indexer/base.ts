export interface ListResponse<T> {
	cursor: string | null
	count: number
	list: T[]
}
