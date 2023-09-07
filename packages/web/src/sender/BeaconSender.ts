import { Sender } from '../types/Sender'

export class BeaconSender implements Sender {
	private url: string
	constructor(url: string) {
		this.url = url
	}
	public send(data) {
		navigator.sendBeacon(this.url, JSON.stringify(data))
	}
}
