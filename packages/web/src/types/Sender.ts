export interface Sender {
	send: Function
}

export type SenderOption = {
	url: string
	uuid?: string
	data?: any
	[key: string]: any
}

export type SenderName = 'XHR' | 'Image' | 'Beacon'
