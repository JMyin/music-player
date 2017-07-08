<template>
	<transition name="slide">
		<music-list :title="title" :bg-image="bgImage" :songs="songs" class="icon"></music-list>
	</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
	data() {
		return {
			songs: []
		}
	},
	created() {
		this._getSongList()
	},
	computed: {
		title() {
			return this.disc.dissname
		},
		bgImage() {
			return this.disc.imgurl
		},
		...mapGetters([
			'disc'
		])
	},
	methods: {
		_getSongList() {
			if (!this.disc.dissid) {
				this.$router.push('/recommend')
				return
			}
			getSongList(this.disc.dissid).then((res) => {
				if (res.code === ERR_OK) {
					this.songs = this._normalizeSong(res.cdList[0].songlist)
				}
			})
		},
		_normalizeSong(list) {
			let ret = []
			list.forEach((musicData) => {
				if (musicData.songid && musicData.albumid) {
					ret.push(createSong(musicData))
				}
			})
			return ret
		}
	},
	components: {
		MusicList
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.slide-enter-active, .slide-leave-active
	transition: all .3s
.slide-enter, .slide-leave
	transition: translate3d(100%, 0, 0)

</style>
