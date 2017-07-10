<!-- 排行页面的子页面 -->
<template>
	<transition name="slide">
		<music-list :songs="songs" :title="title" :bg-image="bgImage" :rank="rank"></music-list>
	</transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import musicList from 'components/music-list/music-list'
import {getMusicList} from 'api/rank'

export default {
	data() {
		return {
			songs: [],
			rank: true
		}
	},
	created() {
		setTimeout(() => {
			this._getMusicList()
		}, 20)
	},
	computed: {
		title() {
			return this.topList.topTitle
		},
		bgImage() {
			if (this.songs.length) {
				return this.songs[0].image
			}
			return ''
		},
		...mapGetters([
			'topList'
		])
	},
	methods: {
		_getMusicList() {
			// if (!this.topList.id) {
			// 	this.$router.push('/rank')
			// }
			getMusicList(this.topList.id).then((res) => {
				if (res.code === ERR_OK) {
					this.songs = this._normalizeSongs(res.songlist)
				}
			})
		},
		_normalizeSongs(list) {
			let ret = []
			list.forEach((item) => {
				const musicData = item.data
				if (musicData.songid && musicData.albumid) {
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
	transition: all 0.3s ease
.silde-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)

</style>
