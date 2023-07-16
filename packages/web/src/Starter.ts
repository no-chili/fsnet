import { Plugin, PluginName, Plugins } from './types/Plugin'
import * as ps from './plugins'
export * from './plugins'
type Option = {
	plugins?: Plugins
}
export class Starter {
	constructor(opt: Option = {}) {
		if (opt.plugins && opt.plugins.length > 0) {
			opt.plugins.forEach((item) => {
				const plugin = ps[item].getinstance()
				this.plugins.push(plugin)
			})
		}
		console.log('初始化')
	}
	private plugins: Plugin[] = []
	//是否启用
	private state = true
	//注册监听插件
	regist(plugin: PluginName | Plugins) {
		if (Array.isArray(plugin)) {
			plugin.forEach((item) => {
				const plugin = ps[item].getinstance()
				if (!this.plugins.includes(plugin)) {
					plugin.install()
					this.plugins.push(plugin)
				}
			})
		} else {
			const p = ps[plugin].getinstance()
			p.install()
			this.plugins.push(p)
		}
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
