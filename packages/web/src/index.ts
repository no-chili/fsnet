import { SourceErrorPlugin } from './plugins/stability/source'
import { JSErrorPlugin } from './plugins/stability/javascript'
import { HttpErrorPlugin } from './plugins/stability/http'
import { XHRSender } from './sender/XHRSender'
import { ImageSender } from './sender/ImageSender'
import { BeaconSender } from './sender/BeaconSender'
import { PvPlugin } from './plugins/behavior/pv'
import { Starter } from './Starter'
import { PerformancePlugin } from './plugins/performance'
import { FPSPlugin } from './plugins/performance/fps'
import { WhiteScreen } from './plugins/performance/whitescreen'

export default {
	Starter,
	PvPlugin,
	BeaconSender,
	ImageSender,
	XHRSender,
	HttpErrorPlugin,
	JSErrorPlugin,
	SourceErrorPlugin,
	PerformancePlugin,
	FPSPlugin,
	WhiteScreen,
}
