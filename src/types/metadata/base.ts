export interface BaseMetadata {
	// version: '1' // TODO: do we need this?

	type?: 'character' | 'note' | 'linklist'
}

export interface AttributesMetadata {
	/**
	 * Custom attributes.
	 *
	 * @example
	 * [{ value: "post", trait_type: "type" }, { value: "https://example.com", trait_type: "URL" }, { value: 1546360800, trait_type: 'Birthday', "display_type": "date" }]
	 */
	attributes?: {
		value: string | number | boolean | null
		trait_type?: string
		display_type?: 'string' | 'number' | 'date' | 'boolean'
	}[]
}
