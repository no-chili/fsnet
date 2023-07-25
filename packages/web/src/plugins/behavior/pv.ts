import { Starter } from './../../Starter'
import { Plugin } from '../../types/Plugin'
import { createHistoryEvent } from '../../utils/createEvent'
import { report } from '../../sender'
import { dataCallback } from '../../utils/dataCallback'
type PvPluginOption = {
	data?: any
	[key: string]: any
}
export class PvPlugin extends Plugin {
	constructor(opt: PvPluginOption) {
		super()
		this.init()
		this.data = opt.data
	}
	private data: any
	// 监听控制器
	private controller: AbortController
	// 监听history
	private captureEventList(list: string[]) {
		list.forEach((item) => {
			window.addEventListener(
				item,
				(e) => {
					this.reportPv()
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
		super.install(starter)
	}
	public uninstall() {
		this.controller.abort()
		super.uninstall()
	}
	reportPv() {
		const Today = String(new Date().getDate())
		const lastDay = localStorage.getItem('pvtime')
		// 同一天只上报一次
		if (Today !== lastDay) {
			const reportData = Object.assign(dataCallback(this.data), {})
			// 内容
			report(reportData)
			localStorage.setItem('pvtime', Today)
		}
	}
}
