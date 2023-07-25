import { dataCallback } from '../utils/dataCallback'
import { Sender, SenderOption } from './../types/Sender'
import { BeaconSender } from './BeaconSender'
import { XHRSender } from './XHRSender'

let currentSender: Sender

// sender的配置
export let currentOption: SenderOption

export function createSender(option: SenderOption) {
	currentOption = option
	if (navigator.sendBeacon) {
		currentSender = new BeaconSender(currentOption.url)
	} else {
		currentSender = new XHRSender(currentOption.url)
	}
	return currentSender
}

export function report(data) {
	const newData = Object.assign(
		{
			userAgent: navigator.userAgent,
			language: navigator.language,
			source: location.href,
		},
		data
	)
	// 添加每次请求都携带的信息
	currentSender.send(Object.assign(newData, dataCallback(currentOption.data)))
}
