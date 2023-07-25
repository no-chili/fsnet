import { Starter } from '../../Starter'
import { report } from '../../sender'
import { Plugin } from '../../types/Plugin'
import { dataCallback } from '../../utils/dataCallback'
import { getLastEvent } from '../../utils/getLastEvent'
type SourceErrorPluginOption = {
	data?: any
	[key: string]: any
}
export class SourceErrorPlugin extends Plugin {
	constructor(opt: SourceErrorPluginOption) {
		super()
		this.data = opt.data
	}
	private data: any
	private abort
	install(starter: Starter) {
		const _this = this
		window.addEventListener(
			'error',
			function (e: ErrorEvent) {
				let lastEvent = getLastEvent()
				let target = e.target as EventTarget & { src?: string; href?: string; baseURI?: string }
				if (target && (target.src || target.href)) {
					const reportData = Object.assign(dataCallback(_this.data), {
						type: 'sourceError',
						eventType: lastEvent.type,
						src: target.src || target.href,
					})

					report(reportData)
				}
			},
			true
		)
		super.install(starter)
	}
	uninstall() {
		this.abort()
		super.uninstall()
	}
}
