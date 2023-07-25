import { Starter } from '../../Starter'
import { report } from '../../sender'
import { Plugin } from '../../types/Plugin'
import { dataCallback } from '../../utils/dataCallback'
type PerformancePluginOption = {
	startTime: number
	data?: any
	[key: string]: any
}
export class PerformancePlugin extends Plugin {
	private startTime: number
	constructor(opt: PerformancePluginOption) {
		super()
		this.data = opt.data
		this.startTime = opt.startTime || 1000
	}
	private performanceData = {
		FP: '',
		FCP: '',
	}
	private data: any
	private navigationPerformance
	private firstPerformance
	private firstContentfulPerformance
	install(starter: Starter) {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((item) => {
				if (item.entryType === 'navigation') {
					this.navigationPerformance = item
				}
				if (item.name === 'first-paint') {
					this.firstPerformance = item
				}
				if (item.name === 'first-contentful-paint') {
					this.firstContentfulPerformance = item
				}
			})
		})
		observer.observe({ type: 'navigation', buffered: true })
		observer.observe({ type: 'paint', buffered: true })
		setTimeout(() => {
			const np = this.navigationPerformance
			const fp = this.navigationPerformance
			const fcp = this.firstContentfulPerformance

			this.performanceData.FP = fp.startTime
			this.performanceData.FCP = fcp.startTime

			console.log(this.performanceData)

			observer.disconnect()
			const reportData = Object.assign(dataCallback(this.data), {
				redirectTime: np.redirectStart - np.redirectEnd,
				redirectCount: np.redirectCount,
				DNS: np.domainLookupStart - np.domainLookupEnd,
				TCP: np.connectStart - np.connectEnd,
			})
			report(reportData)
		}, this.startTime)
		super.install(starter)
	}
}
