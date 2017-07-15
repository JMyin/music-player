import {playMode} from 'common/js/config'
import {loadSearch, loadPlay} from 'common/js/cache'

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
	currentIndex: -1,
	// 一个歌单对象
	disc: {},
	// 排行榜列表
	topList: {},
	// 从本地存储读取历史数据
	searchHistory: loadSearch(),
	// 播放历史 使用loadPlay()从缓存中读取数据
	playHistory: loadPlay()
}

export default state
