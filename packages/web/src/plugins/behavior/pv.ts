import { Starter } from './../../Starter'
import { Plugin } from '../../types/Plugin'
import { createHistoryEvent } from '../../utils/createEvent'
import { report } from '../../sender'
export class PvPlugin implements Plugin {
	constructor() {
		this.init()
	}
	private starter: Starter
	// 监听控制器
	private controller: AbortController
	// 运行状态
	private status = true
	// 监听history
	private captureEventList(list: string[]) {
		list.forEach((item) => {
			window.addEventListener(
				item,
				(e) => {
					if (this.status) {
						// 这里写上报数据
						report({})
					}
				},
				{
					signal: this.controller.signal,
				}
			)
		})
	}
	// 重写history事件
	private init() {
		window.history['pushState'] = createHistoryEvent('pushState')
		window.history['replaceState'] = createHistoryEvent('replaceState')
	}
	public install(starter: Starter) {
		this.controller = new AbortController()
		this.captureEventList(['pushState', 'replaceState', 'popstate'])
		this.starter = starter
		starter.plugins.push(this)
	}
	public uninstall() {
		this.controller.abort()
		this.starter.plugins = this.starter.plugins.filter((item) => {
			return item !== this
		})
		console.log('插件卸载完成')
	}
}
