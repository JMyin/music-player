import {mapGetters} from 'vuex'
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

