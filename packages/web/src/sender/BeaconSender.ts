import { Sender } from '../types/Sender'

export class BeaconSender implements Sender {
	private analyticsData: Blob[] = []
	private url: string
	static instance
	constructor(url: string) {
		this.url = url
		const _this = this
		if (BeaconSender.instance) {
			return BeaconSender.instance
		}
		BeaconSender.instance = this
		window.addEventListener('visibilitychange', function logData() {
			if (document.visibilityState === 'hidden') {
				if (_this.analyticsData.length > 0) {
					_this.send(_this.analyticsData.shift())
				}
			}
		})
		// window.addEventListener('pagehide', function logData() {
		// })
	}
	public send(data) {
		const content = new Blob([JSON.stringify(data)], {
			type: 'application/x-www-form-urlencoded',
		})
		navigator.sendBeacon(this.url, content)
	}
}
