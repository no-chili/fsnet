export function createCanAbortListener(event: string | string[], callback: Function) {
	const controller = new AbortController()
	if (Array.isArray(event)) {
		event.forEach((item) => {
			window.addEventListener(
				item,
				(e) => {
					callback(e)
				},
				{
					signal: controller.signal,
				}
			)
		})
	} else {
		window.addEventListener(
			event,
			(e) => {
				callback(e)
			},
			{
				signal: controller.signal,
			}
		)
	}
	return controller.abort
}
