import { Constructor } from '../utils/createPlugin'

export interface Plugin {
	install: Function
	uninstall: Function
	run: Function
	stop: Function
}
export type PluginList = Array<Constructor<Plugin>>
