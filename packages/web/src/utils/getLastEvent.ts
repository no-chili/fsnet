import { createCanAbortListener } from './createListener'

const makeListener = () => {
	let lastEvent: Event
	createCanAbortListener(
		['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'],
		(e) => {
			lastEvent = e
		},
		{
			capture: true, //捕获
			passive: true, //不阻止默认事件
		}
	)
	return () => lastEvent
}

export const getLastEvent = makeListener()
