import { XHRSender } from './sender/XHRSender'
import { ImageSender } from './sender/ImageSender'
import { BeaconSender } from './sender/BeaconSender'
import { PvPlugin } from './plugins/behavior/pv'
import { Starter } from './Starter'

export default {
	Starter,
	PvPlugin,
	BeaconSender,
	ImageSender,
	XHRSender,
}
