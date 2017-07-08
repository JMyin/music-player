import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutation'

// 这个插件在 每次通过mutation去修改state的时候 就会在控制台打印一些日志
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 调试工具 当npm run dev的时候 NOOD_ENV就是一个dev开发环境
// 如果是 npm run build的时候 NOOD_ENV就是一个production环境
const debug = process.env.NOOD_ENV !== 'production'

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	strict: debug,
	// 严格模式下， 就会检查state的修改是不是来源于commit mutations 否则就会报警告
	plugins: debug ? [createLogger()] : []
})
