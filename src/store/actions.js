// 通常的一些异步操作/修改 或者对mutation做一些封装(在一个动作里多次改变mutation) 都会用actions
import * as types from './mutation-type'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list, song) {
	return list.findIndex((item) => {
		return item.id === song.id
	})
}

// 定义一个而动作selectPlay 选择播放
export const selectPlay = function({commit, state}, {list, index}) {
	commit(types.SET_SEQUENCE_LIST, list)
	if (state.mode === playMode.random) {
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST, randomList)
		index = findIndex(randomList, list[index])
	} else {
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}
// // 随机播放也要创建actions 定义随机播放
export const randomPlay = function({commit}, {list}) {
	commit(types.SET_PLAY_MODE, playMode.random)
	commit(types.SET_SEQUENCE_LIST, list)
	// 得到随机播放列表
	let randomList = shuffle(list)
	commit(types.SET_PLAYLIST, randomList)
	// 当前从0开始播放
	commit(types.SET_CURRENT_INDEX, 0)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}
