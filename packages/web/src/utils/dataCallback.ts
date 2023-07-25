export function dataCallback(data: object | Function) {
	if (!data) {
		return {}
	}
	if (typeof data === 'function') {
		return data()
	} else if (typeof data === 'object') {
		const newData = {}
		for (const key of Object.keys(data)) {
			if (typeof data[key] === 'function') {
				newData[key] = data[key]()
			} else {
				newData[key] = data[key]
			}
		}
		return newData
	} else {
		return data
	}
}
