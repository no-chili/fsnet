export type EventTypeName = keyof WindowEventMap
export function createCanAbortListener<K extends EventTypeName>(event: K | K[], callback: (e: WindowEventMap[K]) => any, option?: boolean | AddEventListenerOptions) {
	let listenerOption: AddEventListenerOptions = {}
	if (typeof option === 'boolean') {
		listenerOption.capture = option
	} else {
		listenerOption = option || {}
	}
	const controller = new AbortController()
	if (Array.isArray(event)) {
		event.forEach((item) => {
			window.addEventListener(
				item,
				(e) => {
					callback(e)
				},
				Object.assign(
					{
						signal: controller.signal,
					},
					option
				)
			)
		})
	} else {
		window.addEventListener(
			event,
			(e) => {
				callback(e)
			},
			Object.assign(
				{
					signal: controller.signal,
				},
				option
			)
		)
	}
	return controller.abort
}
