import { Sender, SenderName } from './../types/Sender'
import { BeaconSender } from './BeaconSender'
import { XHRSender } from './XHRSender'

let currentSender: Sender

export let currentURL

export function createSender(url: string) {
	currentURL = url
	if (navigator.sendBeacon) {
		currentSender = new BeaconSender(url)
	} else {
		currentSender = new XHRSender(url)
	}
	return currentSender
}

export function report(data) {
	currentSender.send(data)
}
