export interface Sender {
	send: Function
}

export type SenderOption = {
	url: string
	uuid?: string
	[key: string]: any
}

export type SenderName = 'XHR' | 'Image' | 'Beacon'
