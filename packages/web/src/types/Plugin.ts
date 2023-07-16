export interface Plugin {
	install: Function
	uninstall: Function
	run?: Function
	stop?: Function
}
export type PluginName = 'PvPlugin'
export type Plugins = Array<PluginName>
