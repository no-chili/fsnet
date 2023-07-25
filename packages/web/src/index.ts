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
import { WhiteScreenPlugin } from './plugins/performance/whitescreen'
import { BehaviorPlugin } from './plugins/behavior/behavior'

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
	WhiteScreenPlugin,
	BehaviorPlugin,
}
