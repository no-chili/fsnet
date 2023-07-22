import { Starter } from '../../Starter'
import { Plugin } from '../../types/Plugin'

export class FPSPlugin implements Plugin {
	private starter: Starter
	install(start: Starter) {
		this.init()
		this.starter = start
		this.starter.plugins.push(this)
	}
	uninstall() {
		this.starter.plugins = this.starter.plugins.filter((item) => {
			return item !== this
		})
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
					console.log('检测出卡顿')
				} else {
					console.log('未检测出卡顿')
				}
				frame = 0
				lasttime = now
			}
			window.requestAnimationFrame(handller)
		}
		window.requestAnimationFrame(handller)
	}
}
