import {playMode} from 'common/js/config'

const state = {
	singer: {},
	// 播放器的状态，暂停和播放
	playing: false,
	// 播放器张开和收起
	fullScreen: false,
	// 播放列表
	playList: [],
	// 顺序列表
	sequenceList: [],
	// 播放模式
	mode: playMode.sequence,
	// 当前播放的索引
	currentIndex: -1
}

export default state
