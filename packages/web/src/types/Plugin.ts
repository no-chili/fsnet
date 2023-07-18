import { Starter } from '../Starter'
import { Constructor } from '../utils/createPlugin'
import { Sender } from './Sender'

export interface Plugin {
	install: (start: Starter) => void
	uninstall: Function
	run?: Function
	stop?: Function
}
export type PluginList = Array<Constructor<Plugin>>
