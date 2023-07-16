import { XHRSender } from './XHRSender'

type Sender = 'XHR' | 'Image' | 'Beacon'
export type Option = {
	data: any
}
const xhr = XHRSender()
export default function send(url: string, option: Option, sender: Sender = 'XHR') {
	if (sender === 'XHR') {
		xhr(url, option.data)
	}
}
