import { Starter } from '../../Starter'
import { report } from '../../sender'
import { Plugin } from '../../types/Plugin'
import { getLastEvent } from '../../utils/getLastEvent'

export class SourceErrorPlugin extends Plugin {
	private abort
	install(starter: Starter) {
		window.addEventListener(
			'error',
			function (e: ErrorEvent) {
				let lastEvent = getLastEvent()
				let target = e.target as EventTarget & { src?: string; href?: string; baseURI?: string }
				if (target && (target.src || target.href)) {
					report({
						type: 'sourceError',
						source: target?.baseURI,
					})
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
