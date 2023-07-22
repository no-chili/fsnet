import { Starter } from '../../Starter'
import { Plugin } from '../../types/Plugin'

export class WhiteScreen implements Plugin {
	private grain: number
	private offset: number
	constructor(grain = 20, offset = 10) {
		this.grain = grain
		this.offset = offset
	}
	private starter: Starter
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
			// 空白点的出现个数
			console.log(emptyPoints)
		}

		window.addEventListener('load', onload)

		this.starter = starter
		this.starter.plugins.push(this)
	}
	uninstall() {
		this.starter.plugins = this.starter.plugins.filter((item) => {
			return item !== this
		})
	}
}
