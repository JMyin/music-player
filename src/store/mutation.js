import * as types from './mutation-type'
// mutation一些相关的方法  同步地修改状态 没有一些异步操作
const mutations = {
	[types.SET_SINGER](state, singer) {
		state.singer = singer
	},
	[types.SET_PLAYING_STATE](state, flag) {
		state.playing = flag
	},
	[types.SET_FULL_SCREEN](state, flag) {
		state.fullScreen = flag
	},
	[types.SET_PLAYLIST](state, list) {
		state.playList = list
	},
	[types.SET_SEQUENCE_LIST](state, list) {
		state.sequenceList = list
	},
	[types.SET_PLAY_MODE](state, mode) {
		state.mode = mode
	},
	[types.SET_CURRENT_INDEX](state, index) {
		state.currentIndex = index
	}
}
export default mutations
