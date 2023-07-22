/**
 * @function isLowFPS
 * @param | FPSList 采集的FPS值
 * @param | below FPS卡顿的限定值
 * @param | number below个数
 */
export const isLowFPS = (FPSList, below, number) => {
	let count = 0
	for (let i = 0; i < FPSList.length; i++) {
		if (FPSList[i] < below) {
			count++
		} else {
			count = 0
		}
		if (count >= number) {
			return true
		}
	}
	return false
}
