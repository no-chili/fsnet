import { Starter } from '../../Starter'
import { currentURL, report } from '../../sender'
import { Plugin } from '../../types/Plugin'
type XMLHttpRequestFormat = {
	xhrData: {
		method: string
		url: string
		sTime: Date
		type: 'XHR' | 'FETCH'
	}
} & XMLHttpRequest
export class HttpErrorPlugin implements Plugin {
	private originOpen: (method: string, url: string | URL) => void
	private originSend: (body?: Document | XMLHttpRequestBodyInit) => void
	private originFetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>
	private starter: Starter
	install(starter: Starter) {
		this.starter = starter
		starter.plugins.push(this)
		// 重写XHR和fetch
		const XMLHttpRequest = window.XMLHttpRequest
		this.originOpen = XMLHttpRequest.prototype.open
		this.originSend = XMLHttpRequest.prototype.send
		const _this = this
		XMLHttpRequest.prototype.open = function (this: XMLHttpRequestFormat, method: string, url: string) {
			this.xhrData = {
				method,
				url,
				sTime: new Date(),
				type: 'XHR',
			}
			_this.originOpen.call(this, [method, url, true])
		}
		XMLHttpRequest.prototype.send = function (this: XMLHttpRequestFormat, ...args) {
			const { method, url, sTime, type } = this.xhrData
			this.addEventListener('loadend', function (this: XMLHttpRequestFormat) {
				// 过滤上报请求
				if (currentURL !== 'url') {
					// 捕获错误，并上报
					if (this.status > 400) {
						report({
							type,
							method,
							url,
							sTime,
						})
					}
				}
			})
			return _this.originSend.apply(this, args)
		}
		// 重写fetch
		this.originFetch = window.fetch
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
						type: 'FETCH',
					})
					throw err
				}
			)
		}
	}
	uninstall() {
		window.XMLHttpRequest.prototype.open = this.originOpen
		window.XMLHttpRequest.prototype.send = this.originSend
		window.fetch = this.originFetch
	}
}
