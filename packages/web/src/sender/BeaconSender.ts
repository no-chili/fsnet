import { Sender } from '../types/Sender'

export class BeaconSender implements Sender {
	private url: string
	constructor(url: string) {
		this.url = url
		window.addEventListener('visibilitychange', function logData() {
			if (document.visibilityState === 'hidden') {
				// if (this.analyticsData.length > 0) {
				// 	this.send(this.analyticsData.shift())
				// }
			}
		})
	}
	public send(data) {
		// const content = new Blob([JSON.stringify(data)], {
		// 	type: 'application/x-www-form-urlencoded',
		// })
		navigator.sendBeacon(this.url, JSON.stringify(data))
	}
}
