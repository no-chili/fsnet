import { Starter } from '../Starter'
export type Constructor<T> = new (...args: any[]) => T

export class Plugin {
	starter: Starter
	install(starter: Starter) {
		this.starter = starter
		starter.plugins.push(this)
	}
	uninstall() {
		this.starter.plugins = this.starter.plugins.filter((item) => {
			item !== this
		})
	}
}
export type PluginList = Array<Constructor<Plugin>>
