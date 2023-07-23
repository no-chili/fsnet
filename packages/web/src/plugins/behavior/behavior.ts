import { Starter } from '../../Starter'
import { Plugin } from '../../types/Plugin'
import { createCanAbortListener } from '../../utils/createListener'
import { report } from '../../sender'
import { getSlector } from '../../utils/getSlector'

/* 
收集用户行为队列

达到一定数量上报

关闭上报

出错上报
*/
type CurrentAction = {
	type?: string
	key?: string
	slector?: string
	gaptime?: number //距离上一次用户行为间隔时间
	time?: number
	source?: string
}
export class BehaviorPlugin extends Plugin {
	constructor(limit: number) {
		super()
		this.limit = limit
	}
	private limit: number //收集的行为队列长度
	private userAction: any[]
	private currentAction: CurrentAction = {}
	install(starter: Starter): void {
		let lasttime = performance.now()
		// 绑定监听==>正常执行
		createCanAbortListener(['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'], (e) => {
			const newtime = performance.now()
			if (e instanceof KeyboardEvent) {
				this.currentAction.key = e.key
			}
			if (e instanceof MouseEvent) {
				this.currentAction.slector = getSlector(e.target as Element)
			}
			if (e instanceof TouchEvent) {
				this.currentAction.slector = getSlector(e.target as Element)
			}
			this.currentAction.type = e.type
			this.currentAction.time = newtime
			this.currentAction.gaptime = newtime - lasttime
			this.currentAction.source = location.href

			// 收集行为
			this.userAction.push(this.currentAction)

			if (this.userAction.length > this.limit) {
				this.reportUserAction()
			}

			lasttime = newtime
		})
		// 关闭页面
		window.addEventListener('pagehide', () => {
			if (this.userAction.length > 0) {
				this.reportUserAction()
			}
		})
		// 出错中断
		window.addEventListener('error', () => {
			if (this.userAction.length > 0) {
				this.reportUserAction()
			}
		})
		super.install(starter)
	}
	reportUserAction() {
		report({
			action: this.userAction,
			type: 'behavior',
		})
		this.userAction = []
	}
}
