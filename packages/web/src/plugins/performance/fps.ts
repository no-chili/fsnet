import { Starter } from '../../Starter'
import { report } from '../../sender'
import { Plugin } from '../../types/Plugin'
import { dataCallback } from '../../utils/dataCallback'
type FPSPluginOption = {
	limit: number
	data?: any
	[key: string]: any
}
export class FPSPlugin extends Plugin {
	private limit: number
	constructor(opt: FPSPluginOption) {
		super()
		this.limit = opt.limit || 20
		this.data = opt.data
	}
	private data: any
	install(starter: Starter) {
		this.init()
		super.install(starter)
	}
	private init() {
		let lasttime = performance.now()
		let frame = 0

		// // 让刚打开页面时重新计算(待完善，兼容需处理)
		window.addEventListener('pagehide', () => {
			console.log('hide')
		})

		const handller = () => {
			if (!document.hidden) {
				frame++
				let now = performance.now()
				if (now - lasttime > 1000) {
					if (frame < this.limit) {
						const reportData = Object.assign(dataCallback(this.data), {
							FPS: frame,
							time: performance.now(),
							sTime: new Date().getTime(),
							type: 'FPSError',
						})
						report(reportData)
					}
					frame = 0
					lasttime = now
				}
			}
			window.requestAnimationFrame(handller)
		}
		window.requestAnimationFrame(handller)
	}
}
