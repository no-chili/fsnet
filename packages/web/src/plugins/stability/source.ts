import { Starter } from '../../Starter'
import { report } from '../../sender'
import { Plugin } from '../../types/Plugin'
import { getLastEvent } from '../../utils/getLastEvent'

export class SourceErrorPlugin implements Plugin {
	private starter: Starter
	private abort
	install(starter: Starter) {
		this.starter = starter
		window.addEventListener(
			'error',
			function (e: ErrorEvent) {
				let lastEvent = getLastEvent()
				let target = e.target as EventTarget & { src?: string; href?: string }
				if (target && (target.src || target.href)) {
					report({
						type: 'sourceError',
						lastEvent,
					})
				}
			},
			true
		)
		this.starter.plugins.push(this)
	}
	uninstall() {
		this.abort()
		this.starter.plugins = this.starter.plugins.filter((item) => {
			return item !== this
		})
	}
}
