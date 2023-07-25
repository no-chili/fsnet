export function throttle(func, wait) {
	let timer = null
	return function () {
		if (timer) return
		const args = arguments
		timer = setTimeout(function () {
			func.apply(this, args)
			timer = null
		}, wait)
	}
}
