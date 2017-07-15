// 通常的一些异步操作/修改 或者对mutation做一些封装(在一个动作里多次改变mutation) 都会用actions
import * as types from './mutation-type'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay} from 'common/js/cache'
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
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// 记录当前歌曲
	let currentSong = playList[currentIndex]
	// 查找当前列表中是否包含待插入的歌曲song，如果有返回其索引
	let fpIndex = findIndex(playList, song)
	// 因为是插入歌曲，所以索引要加1
	currentIndex++
	// 插入这首歌到当前索引位置
	playList.splice(currentIndex, 0, song)
	// 如果已经包含了这首歌
	if (fpIndex > -1) {
		// 如果当前插入的序号大于列表中的序号
		if (currentIndex > fpIndex) {
			// 删除列表中相同的项，并且当前歌曲索引值减1
			playList.splice(fpIndex, 1)
			currentIndex--
		} else {
			// 如果当前插入的序号小于列表中原有项的序号 直接删除原有项即可
			playList.splice(fpIndex + 1, 1)
		}
	}
	// 在修改sequenceList之前，首先要找到歌曲要插入的sequenceList的位置
	// 找到当前歌曲currentSong在sequenceList里的位置索引 +1 就是要插入的位置
	let currentSIndex = findIndex(sequenceList, currentSong) + 1
	// 然后在查一下之前的sequenceList有没有包含要插入的项
	let fsIndex = findIndex(sequenceList, song)

	sequenceList.splice(currentSIndex, 0, song)
	if (fsIndex > -1) {
		// 如果当前插入的序号大于列表中的序号
		if (currentSIndex > fsIndex) {
			// 删除列表中相同的项，并且当前歌曲索引值减1
			sequenceList.splice(fsIndex, 1)
			// 这里不需要操作currentSIndex 因为它只是一个临时变量 最后的state里面并不包含它
			// currentSIndex--
		} else {
			// 如果当前插入的序号小于列表中原有项的序号 直接删除原有项即可
			sequenceList.splice(fsIndex + 1, 1)
		}
	}
	// 接下来就是提交mutation
	commit(types.SET_PLAYLIST, playList)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query) {
	commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// song表示要删除的歌曲
export const deleteSong = function({commit, state}, song) {
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// 找到眼删除的歌曲song在playList里的索引 然后将其删除
	let pIndex = findIndex(playList, song)
	playList.splice(pIndex, 1)
	// 同样也要找到song在sequenceList里的索引 然后删除
	let sIndex = findIndex(sequenceList, song)
	sequenceList.splice(sIndex, 1)
	// ????
	if (currentIndex > pIndex || currentIndex === playList.length) {
		currentIndex--
	}
	commit(types.SET_PLAYLIST, playList)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)

	const playingState = playList.length > 0
	// 当歌曲被删完了 需要将playingState设置为false
	// 如果播放列表里还有歌曲，将播放状态设为true
	commit(types.SET_PLAYING_STATE, playingState)
}
// 清空播放列表的action
export const deleteSongList = function({commit}) {
	commit(types.SET_PLAYLIST, [])
	commit(types.SET_SEQUENCE_LIST, [])
	commit(types.SET_CURRENT_INDEX, -1)
	commit(types.SET_PLAYING_STATE, false)
}

export const deleteSearchHistory = function({commit}, query) {
	// 删除一条搜索记录 在增加一条 deleteSearch(query)删除了query 并范湖一个新的数组
	// 将新数组提交给mutation
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
export const clearSearchHistory = function({commit}) {
	commit(types.SET_SEARCH_HISTORY, clearSearch())
}
// 将当前歌曲保存到playHistory列表及本地缓存里
export const savePlayHistory = function({commit}, song) {
	commit(types.SET_PLAY_HISTORY, savePlay(song))
}
