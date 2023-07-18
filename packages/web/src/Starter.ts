import { Sender } from './types/Sender'
import { Plugin, PluginList } from './types/Plugin'
import { createPluginInstance } from './utils/createPlugin'
import { createSender } from './sender'
export * from './plugins'
export class Starter {
	constructor(plugins: PluginList, url: string) {
		this.sender = createSender(url)
		plugins.forEach((item) => {
			const p = createPluginInstance(item)
			p.install(this)
		})
		console.log('初始化')
	}
	public sender: Sender
	public plugins: Plugin[] = []
	//是否启用
	private state = true
	//注册监听插件
	regist(plugin: Plugin) {
		if (this.plugins.includes(plugin)) {
			return console.log('请勿重复注册')
		}
		plugin.install(this)
		return this
	}
	// 启动监听
	start() {
		this.state = true
	}
	// 暂停监听
	stop() {
		this.state = false
	}
	// 销毁监听
	destroy() {
		this.plugins.forEach((item) => {
			item.uninstall()
		})
		this.plugins = []
	}
}
