import { Sender } from './types/Sender'
import { Plugin, PluginList } from './types/Plugin'

import { SenderOption } from './types/Sender'
import { createSender } from './sender'
export * from './plugins'
export class Starter {
	constructor(plugins: PluginList, opt: SenderOption) {
		if (Starter.instance) {
			return Starter.instance
		}
		this.sender = createSender(opt)
		plugins.forEach((item) => {
			const p = new item()
			p.install(this)
		})
		Starter.instance = this
		console.log('初始化')
	}
	static instance: Starter
	public sender: Sender
	public plugins: Plugin[] = []
	//注册监听插件
	regist(plugin: Plugin) {
		if (plugin instanceof Plugin) {
			plugin.install(this)
		}
		return this
	}
	uninstallPlugin(plugins: PluginList) {
		plugins.forEach((plugin) => {
			this.plugins.forEach((item) => {
				if (item instanceof plugin) {
					item.uninstall()
				}
			})
		})
	}
	// 销毁监听
	destroy() {
		this.plugins.forEach((item) => {
			item.uninstall()
		})
		this.plugins = []
	}
}
