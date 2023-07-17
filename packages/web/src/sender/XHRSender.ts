import { Sender } from '../types/Sender'
export class XHRSender implements Sender {
	private _cache = []
	private url: string
	constructor(url: string) {
		this.url = url
	}
	public send = <T>(data: T) => {
		const _data = JSON.stringify(data)
		let xhr = new XMLHttpRequest()
		xhr.open('POST', this.url)
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.send(JSON.stringify(_data))
		const _this = this
		xhr.addEventListener('readystatechange', function () {
			if (this.readyState === 4) {
				if (this.status >= 400) {
					// 上报失败，写入缓存
					_this._cache.push(_data)
				} else {
					// 上报成功
					_this._cache.push(_data)
					while (_this._cache.length > 0) {
						this.send(_this._cache.shift())
					}
				}
			}
		})
	}
}
