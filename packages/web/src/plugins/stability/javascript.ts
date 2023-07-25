import { Starter } from '../../Starter'
import { report } from '../../sender'
import { Plugin } from '../../types/Plugin'
import { createCanAbortListener } from '../../utils/createListener'
import { dataCallback } from '../../utils/dataCallback'
type JSErrorPluginOption = {
	data?: any
	[key: string]: any
}
export class JSErrorPlugin extends Plugin {
	private abort
	constructor(opt: JSErrorPluginOption) {
		super()
		this.data = opt.data
	}
	private data: any
	install(starter: Starter) {
		// 监听error错误
		this.abort = createCanAbortListener(
			'error',
			function (e) {
				const target = e.target as EventTarget & { src?: string; href?: string }
				if (target && !target.src && !target.href) {
					// 上报jserror

					const reportData = Object.assign(dataCallback(this.data), {
						type: 'jsError',
						message: e.error.message,
						source: e.filename,
						lineno: e.lineno,
						colno: e.colno,
						stack: e.error.stack,
					})

					report(reportData)
				}
			},
			true
		)
		// 监听promise错误
		createCanAbortListener(
			'unhandledrejection',
			function (e) {
				// 上报数据
				report({
					message: e.reason.message,
					stack: e.reason.stack,
					timeStamp: e.timeStamp,
					type: e.type,
				})
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
