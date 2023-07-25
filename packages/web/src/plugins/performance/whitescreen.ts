import { Starter } from '../../Starter'
import { report } from '../../sender'
import { Plugin } from '../../types/Plugin'
import { dataCallback } from '../../utils/dataCallback'
type WhiteScreenPluginOption = {
	grain?: number
	offset?: number
	data?: any
	[key: string]: any
}
export class WhiteScreenPlugin extends Plugin {
	private grain: number
	private offset: number
	private data: any
	constructor(opt: WhiteScreenPluginOption) {
		super()
		this.data = opt.data

		this.grain = opt.grain || 20
		this.offset = opt.offset || 5 //可接受的白点-偏差
	}
	install(starter: Starter) {
		const onload = () => {
			// 定义外层容器元素的集合
			let containerElements = ['html', 'body', '#app', '#root']
			function getSelector(element) {
				if (element.id) {
					return '#' + element.id
				} else if (element.className) {
					return (
						'.' +
						element.className
							.split(' ')
							.filter((item) => !!item)
							.join('.')
					)
				} else {
					return element.nodeName.toLowerCase()
				}
			}
			function isEmpty(node) {
				if (!containerElements.includes(node)) {
					return false
				} else {
					return true
				}
			}
			// 颗粒度
			const grain = this.grain
			// 空白点
			let emptyPoints = 0
			for (let i = 0; i < grain; i++) {
				let xElement = document.elementsFromPoint((window.innerWidth * i) / grain, window.innerHeight / 2)[0]
				let yElement = document.elementsFromPoint(window.innerWidth / 2, (window.innerHeight * i) / grain)[0]
				const nodey = getSelector(yElement)
				const nodex = getSelector(xElement)
				isEmpty(nodex) && emptyPoints++
				isEmpty(nodey) && emptyPoints++
			}

			// 上报白屏
			if (emptyPoints <= grain * 2 - this.offset) {
				const reportData = Object.assign(dataCallback(this.data), {
					innerWidth: window.innerWidth,
					innerHeight: window.innerHeight,
					source: location.href,
					type: 'whitescreen',
				})

				report(reportData)
			}
		}

		window.addEventListener('load', onload)

		super.install(starter)
	}
}
