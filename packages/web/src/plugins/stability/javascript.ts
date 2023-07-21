import { Starter } from '../../Starter'
import { Plugin } from '../../types/Plugin'
import { createCanAbortListener } from '../../utils/createListener'

export class JSErrorPlugin implements Plugin {
	private starter: Starter
	private abort
	install(starter: Starter) {
		// 监听error错误
		this.abort = createCanAbortListener(
			'error',
			function (e) {
				const target = e.target as EventTarget & { src?: string; href?: string }
				if (target && !target.src && !target.href) {
					// 上报jserror
				}
			},
			true
		)
		this.starter = starter
		// 监听promise错误
		createCanAbortListener(
			'unhandledrejection',
			function (e) {
				console.log(e)
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
