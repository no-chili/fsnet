import { Sender } from '../types/Sender'
// 待完善。。。
export class ImageSender implements Sender {
	endpoint: string
	constructor(endpoint: string) {
		this.endpoint = endpoint
	}
	send(data: Report): void {
		const img = new Image(1, 1)
		img.onerror = (event) => {
			console.log(event)
		}
		img.src = this.endpoint
	}
}
