import { Starter } from '../../Starter'
import { currentOption, report } from '../../sender'
import { Plugin } from '../../types/Plugin'
type XMLHttpRequestFormat = {
	xhrData: {
		method: string
		url: string
		sTime: Date
	}
} & XMLHttpRequest
export class HttpErrorPlugin extends Plugin {
	private originOpen: (method: string, url: string | URL) => void
	private originSend: (body?: Document | XMLHttpRequestBodyInit) => void
	private originFetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>
	private logCallback: object | Function
	install(starter: Starter) {
		// 重写XHR和fetch
		const XMLHttpRequest = window.XMLHttpRequest
		this.originOpen = this.originOpen || XMLHttpRequest.prototype.open
		this.originSend = this.originSend || XMLHttpRequest.prototype.send
		const _this = this
		XMLHttpRequest.prototype.open = function (this: XMLHttpRequestFormat, method: string, url: string) {
			this.xhrData = {
				method,
				url,
				sTime: new Date(),
			}
			_this.originOpen.call(this, [method, url, true])
		}
		XMLHttpRequest.prototype.send = function (this: XMLHttpRequestFormat, ...args) {
			this.addEventListener('loadend', function (this: XMLHttpRequestFormat) {
				// 过滤上报请求
				if (currentOption.url !== this.xhrData.url) {
					// 捕获错误，并上报
					if (this.status > 400) {
						let log = _this.logCallback
						if (typeof _this.logCallback === 'function') {
							log = _this.logCallback()
						}
						// 上报内容
						const logData = {}
						for (let key of Object.keys(log)) {
							if (typeof log[key] === 'function') {
								logData[key] === log[key]()
							}
						}
						// console.log(this)
						report(Object.assign(this.xhrData, logData))
					}
				}
			})
			return _this.originSend.apply(this, args)
		}
		// 重写fetch
		this.originFetch = this.originFetch || window.fetch
		window.fetch = (url, config) => {
			return this.originFetch.apply(window, [url, config]).then(
				(res) => {
					// 根据返回值上报
					return res
				},
				(err) => {
					report({
						url,
						sTime: new Date(),
						type: err.type,
						message: err.reason,
						stack: err.reason,
						timeStamp: err.timeStamp,
					})
					console.log(err)

					throw err
				}
			)
		}
		super.install(starter)
	}
	uninstall() {
		// 还原
		window.XMLHttpRequest.prototype.open = this.originOpen
		window.XMLHttpRequest.prototype.send = this.originSend
		window.fetch = this.originFetch
		super.uninstall()
	}
	constructor(logCallback: object | Function) {
		super()
		this.logCallback = logCallback
	}
}
