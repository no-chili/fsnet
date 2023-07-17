import { Plugin } from '../../types/Plugin'
import { Sender, SenderName } from '../../types/Sender'
import { createHistoryEvent } from '../../utils/createEvent'
type PvOption = {
	sender: Sender
}
export class PvPlugin implements Plugin {
	constructor() {
		if (PvPlugin.instance) {
			return PvPlugin.instance
		}
		this.init()
		PvPlugin.instance = this
	}
	static instance
	private sender: Sender
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
						this.sender.send()
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
	public install(option: PvOption) {
		this.sender = option.sender
		this.controller = new AbortController()
		this.captureEventList(['pushState', 'replaceState', 'popState'])
		console.log('pv插件安装成功')
	}
	public uninstall() {
		this.controller.abort()
		PvPlugin.instance = null
		console.log('插件卸载完成')
	}
	public run() {
		this.status = true
	}
	public stop() {
		this.status = false
	}
}
