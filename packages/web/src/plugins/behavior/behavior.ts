import { Starter } from '../../Starter'
import { Plugin } from '../../types/Plugin'
import { createCanAbortListener } from '../../utils/createListener'
import { report } from '../../sender'
import { getSlector } from '../../utils/getSlector'
import { throttle } from '../../utils/throttle'
import { dataCallback } from '../../utils/dataCallback'

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
	hasError?: boolean
	errorstack?: string
}
type BehaviorPluginOption = {
	limit: number
	data?: any
	[key: string]: any
}
export class BehaviorPlugin extends Plugin {
	constructor(
		opt: BehaviorPluginOption = {
			limit: 20,
		}
	) {
		super()
		this.limit = opt.limit
		this.data = opt.data
	}
	private data: any
	private limit: number //收集的行为队列长度
	private userAction: any[] = []
	private currentAction: CurrentAction = {}
	private lasttime: number
	install(starter: Starter): void {
		this.lasttime = performance.now()
		const collectCallback = this.collectAction()
		// 绑定监听==>正常执行
		createCanAbortListener(['click', 'touchstart', 'mousedown', 'keydown'], collectCallback)

		// 关闭页面
		window.addEventListener('pagehide', () => {
			if (this.userAction.length > 0) {
				this.reportUserAction()
			}
		})

		// 出错中断
		window.addEventListener('error', (e) => {
			this.currentAction.hasError = true
			this.currentAction.errorstack = e.error.stack

			this.userAction.push(this.currentAction)

			if (this.userAction.length > 0) {
				this.reportUserAction()
			}

			this.currentAction.hasError = false
			delete this.currentAction.errorstack
		})
		super.install(starter)
	}
	reportUserAction() {
		const reportData = Object.assign(dataCallback(this.data), {
			action: this.userAction,
			type: 'behavior',
		})
		report(reportData)
		this.userAction = []
	}

	collectAction() {
		return throttle((e: MouseEvent | KeyboardEvent | TouchEvent) => {
			const newtime = performance.now()
			if (e instanceof KeyboardEvent) {
				this.currentAction.key = e.key
			}
			this.currentAction.slector = getSlector(e.target as Element)

			this.currentAction.type = e.type
			this.currentAction.time = newtime
			this.currentAction.gaptime = newtime - this.lasttime
			this.currentAction.source = location.href

			// 收集行为
			this.userAction.push(this.currentAction)

			console.log('shoujidaole')

			if (this.userAction.length > this.limit) {
				this.reportUserAction()
			}

			this.lasttime = newtime
		}, 500)
	}
}
