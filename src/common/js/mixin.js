import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export const playListMixin = {
	computed: {
		...mapGetters([
			'playList'
		])
	},
	// Dom ready的时候会触发mounted
	mounted() {
		this.handlePlayList(this.playList)
	},
	// keepalive的组件切换过来的时候会触发activated
	activated() {
		this.handlePlayList(this.playList)
	},
	watch: {
		playList(newVal) {
			// 当playList发生变化的时候
			this.handlePlayList(newVal)
		}
	},
	methods: {
		// 用来处理playList 如果组件用了这个mixin必须定义handlePlayList方法 否则会报错
		handlePlayList() {
			throw new Error('component must implement handlePlayList method')
		}
	}
}

export const playerMixin = {
	computed: {
		// 播放模式 3种
		iconMode() {
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
		},
		...mapGetters([
			'currentIndex',
			// 决定是否显示
			'fullScreen',
			// 播放列表
			'playList',
			'currentSong',
			'playing',
			'sequenceList',
			'mode'
		])
	},
	methods: {
		changeMode() {
			// 改变播放模式
			const mode = (this.mode + 1) % 3
			this.setPlayMode(mode)
			let list = null
			if (mode === playMode.random) {
				list = shuffle(this.sequenceList)
			} else {
				// 当为顺序或循环播放模式时
				list = this.sequenceList
			}
			this.resetCurrentIndex(list)
			this.setPlayList(list)
		},
		/** 当切换播放模式的时候，为了避免歌曲切换模式时播放的歌曲发生改变 将正在播放歌曲的id设置为切换之后播放的
		当playList改变的时候，也让currentIndex改变 来保证currentSong的id不变**/
		resetCurrentIndex(list) {
			let index = list.findIndex((item) => {
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
		...mapMutations({
			setPlayingState: 'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayMode: 'SET_PLAY_MODE',
			setPlayList: 'SET_PLAYLIST'
		})
	}
}

export const searchMixin = {
	data() {
		return {
			query: '',
			refreshDelay: 300
		}
	},
	computed: {
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		addQuery(query) {
			this.$refs.searchBox.setQuery(query)
		},
		onQueryChange(query) {
			this.query = query
		},
		saveSearch() {
			this.saveSearchHistory(this.query)
		},
		//  使输入框失去焦点->手机上的键盘可以消失
		blurInput() {
			this.$refs.searchBox.blur()
		},
		...mapActions([
			'saveSearchHistory',
			'deleteSearchHistory'
		])
	}
}
