import { Starter } from '../../Starter'
import { Plugin } from '../../types/Plugin'

export class PerformancePlugin implements Plugin {
	private starter: Starter
	private map = new Map()
	install(start: Starter) {
		const observer = new PerformanceObserver((list) => {
			const navigationPerformance = list.getEntriesByType('navigation')[0]
			const performanceEntry = list.getEntriesByType('paint')
			list.getEntries().forEach((item) => {
				this.map.set(item.name, item)
			})
		})
		observer.observe({ type: 'navigation', buffered: true })
		observer.observe({ type: 'paint', buffered: true })
		setTimeout(() => {
			console.log(this.map)
		}, 1000)
		this.starter = start
		this.starter.plugins.push(this)
	}
	uninstall() {
		this.starter.plugins = this.starter.plugins.filter((item) => {
			return item !== this
		})
	}
}
