import { Starter } from '../../Starter'
import { Plugin } from '../../types/Plugin'

export class FPSPlugin extends Plugin {
	install(starter: Starter) {
		this.init()
		super.install(starter)
	}
	private init() {
		let lasttime = performance.now()
		let frame = 0
		const handller = () => {
			frame++
			let now = performance.now()
			if (now - lasttime > 1000) {
				if (frame < 16) {
					// 出现卡顿
				}
				frame = 0
				lasttime = now
			}
			window.requestAnimationFrame(handller)
		}
		window.requestAnimationFrame(handller)
	}
}
