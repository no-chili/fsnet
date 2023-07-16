import { Option } from '.'

export function XHRSender() {
	const _cache = []
	return function (url: string, data) {
		const _data = JSON.stringify(data)
		let xhr = new XMLHttpRequest()
		xhr.open('POST', url)
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.send(JSON.stringify(_data))
		xhr.addEventListener('readystatechange', function () {
			if (this.readyState === 4) {
				if (this.status >= 400) {
					// 上报失败，写入缓存
					_cache.push(_data)
				} else {
					// 上报成功
					if (_cache.length > 0) {
						xhr.send(_cache.shift())
					}
				}
			}
		})
	}
}
