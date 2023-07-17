import { Sender } from './types/Sender'
import { Plugin, PluginList } from './types/Plugin'
import { Constructor, createPluginInstance } from './utils/createPlugin'
export * from './plugins'
export class Starter {
	constructor(plugins: PluginList, sender: Sender) {
		this.sender = sender
		plugins.forEach((item) => {
			const p = createPluginInstance(item)
			p.install({ sender: this.sender })
			this.plugins.push(p)
		})
		console.log('初始化')
	}
	private sender: Sender
	private plugins: any[] = []
	//是否启用
	private state = true
	//注册监听插件
	regist(plugin: Constructor<Plugin> | Array<Constructor<Plugin>>) {
		if (Array.isArray(plugin)) {
			plugin.forEach((item) => {
				const p = createPluginInstance(item)
				if (!this.plugins.includes(plugin)) {
					p.install({ sender: this.sender })
					this.plugins.push(plugin)
				}
			})
		} else {
			const p = createPluginInstance(plugin)
			if (!this.plugins.includes(plugin)) {
				p.install({ sender: this.sender })
				this.plugins.push(plugin)
			}
		}
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
			const plugin = item.instance || item
			plugin.uninstall()
		})
		this.plugins = []
	}
}
