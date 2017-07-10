// 通常的一些异步操作/修改 或者对mutation做一些封装(在一个动作里多次改变mutation) 都会用actions
import * as types from './mutation-type'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
// 查找列表中有没有相应的歌曲，如果有返回索引
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
// 点击搜索出来的歌曲中的某一项，要修改playList、sequenceList、currentIndex三项
// 所以在actions里对这三项做一个封装
export const insertSong = function({commit, state}, song) {
	let playList = state.playList
	let sequenceList = state.sequenceList
	let currentIndex = state.currentIndex
	// 记录当前歌曲
	let currentSong = playList[currentIndex]
	// 查找当前列表中是否有待插入的歌曲并返回其索引
	let fpIndex = findIndex(playList, song)
	// 因为是从插入歌曲，所以索引要加1
	currentIndex++
	// 插入这首歌到当前索引位置
	playList.splice(currentIndex, 0, song)
	// 如果已经包含了这首歌
	if (fpIndex > -1) {
		// 如果当前插入的序号大于列表中的序号
		if (currentIndex > fpIndex) {}

	}
}
