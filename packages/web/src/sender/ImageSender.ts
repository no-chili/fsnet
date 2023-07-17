import { Sender } from '../types/Sender'

export class ImageSender implements Sender {
	private url: string
	constructor(url: string) {
		this.url = url
	}
	public send(data) {}
}
