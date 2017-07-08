<template>
	<transition name="slide">
		<music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
	</transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import musicList from 'components/music-list/music-list'

export default {
	data() {
		return {
			songs: []
		}
	},
	created() {
		this._getDetail()
	},
	computed: {
		title() {
			return this.singer.name
		},
		bgImage() {
			return this.singer.avatar
		},
		...mapGetters([
			// 相当于在vue实例中挂载了一个singer实例
			'singer'
		])
	},
	methods: {
		_getDetail() {
			if (!this.singer.id) {
				console.log(this.singer)
				this.$router.push('./singer')
				return
			}
			getSingerDetail(this.singer.id).then((res) => {
				if (res.code === ERR_OK) {
					this.songs = this._normallizeSongs(res.data.list)
					console.log(this.songs)
				}
			})
		},
		_normallizeSongs(list) {
			let ret = []
			list.forEach((item) => {
				let {musicData} = item
				// songid albummids 是必须的
				if (musicData.songid && musicData.albummid) {
					ret.push(createSong(musicData))
				}
			})
			return ret
		}
	},
	components: {
		musicList
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.slide-enter-active, .slide-leave-active
	transition: all 1.3s
.silde-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)

</style>
