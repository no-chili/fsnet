import { Plugin } from '../../types/Plugin'
import { createHistoryEvent } from '../../utils/createEvent'
type PvOption = {}
export class PvPlugin implements Plugin {
	private constructor() {}
	static instance
	static getinstance(): PvPlugin {
		if (PvPlugin.instance) {
			return PvPlugin.instance
		}
		PvPlugin.instance = new PvPlugin()
		return PvPlugin.instance
	}
	static hasrewrite = false
	private controller = new AbortController()
	private status = true
	private captureEventList(list: string[]) {
		list.forEach((item) => {
			window.addEventListener(
				item,
				(e) => {
					if (this.status) {
						console.log(e)
						console.log(this.controller)
					}
				},
				{
					signal: this.controller.signal,
				}
			)
		})
	}
	private init() {
		if (!PvPlugin.hasrewrite) {
			PvPlugin.hasrewrite = true
			window.history['pushState'] = createHistoryEvent('pushState')
			window.history['replaceState'] = createHistoryEvent('replaceState')
		}
	}

	public install(option: PvOption = {}) {
		this.init()
		this.captureEventList(['pushState', 'replaceState', 'popState'])
		console.log('pv插件安装成功')
	}
	public uninstall() {
		this.controller.abort()
		console.log('插件卸载完成')
	}
	public run() {
		this.status = true
	}
	public stop() {
		this.status = false
	}
}
