<template>
	<transition name="slide">
		<div class="user-center">
			<div class="back" @click="back"><i class="icon-back"></i></div>
			<div class="switch-wrapper">
				<switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
			</div>
			<div class="play-btn" ref="playBtn" @click="random">
				<i class="icon-play"></i>
				<span class="text">随机播放全部</span>
			</div>
			<div class="list-wrapper" ref="listWrapper">
				<scroll v-if="currentIndex === 0" :data="favoriteList" class="list-scroll" ref="favoriteList">
					<div class="inner-list">
						<song-list :songs="favoriteList" @select="selectSong"></song-list>
					</div>
				</scroll>
				<scroll v-if="currentIndex === 1" :data="playHistory" class="list-scroll" ref="playList">
					<div class="inner-list">
						<song-list :songs="playHistory" @select="selectSong"></song-list>
					</div>
				</scroll>
			</div>
			<div class="no-result-wrapper" v-show="noResult">
				<no-result :title="noResultDesc"></no-result>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Song from 'common/js/song'
import NoResult from 'base/no-result/no-result'
import {mapGetters, mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin'
export default {
	mixins: [playListMixin],
	data() {
		return {
			switches: [
				{name: '我喜欢的'},
				{name: '最近播放'}
			],
			currentIndex: 0
		}
	},
	computed: {
		noResult() {
			if (this.currentIndex === 0) {
				return !this.favoriteList.length
			} else {
				return !this.playHistory.length
			}
		},
		noResultDesc() {
			if (this.currentIndex === 0) {
				return '暂无收藏歌曲'
			} else {
				return '还没有听过歌曲'
			}
		},
		...mapGetters([
			'favoriteList',
			'playHistory'
		])
	},
	methods: {
		// 切换导航按钮
		switchItem(index) {
			this.currentIndex = index
		},
		back() {
			this.$router.back()
		},
		selectSong(song) {
			this.insertSong(new Song(song))
		},
		random() {
			let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
			if (list.length === 0) {
				return
			}
			// 目前的list还不是Song的实例
			list.map((item) => {
				return new Song(item)
			})
			// 调用actions里的随机播放
			this.randomPlay({list})
		},
		handlePlayList(playList) {
			const bottom = playList.length > 0 ? '60px' : 0
			this.$refs.listWrapper.style.bottom = bottom
			this.$refs.favoriteList && this.$refs.favoriteList.refresh()
			this.$refs.playList && this.$refs.playList.refresh()
		},
		...mapActions([
			'insertSong',
			'randomPlay'
		])
	},
	components: {
		Switches,
		Scroll,
		SongList,
		Song,
		NoResult
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.user-center
	position: fixed
	top: 0
	right: 0
	bottom: 0
	left: 0
	width: 100%
	overflow: hidden
	background: $color-background
	.back
		position: absolute
		top: 15px
		left: 15px
		color: $color-theme
		font-size: $font-size-large-s
	.switch-wrapper
		line-height: 40px
		text-align: center
	.play-btn
		width: 150px
		height: 35px
		line-height: 35px
		margin: 0 auto
		text-align: center
		color: $color-text-l
		border: 1px solid $color-text-d
		border-radius: 15px
	.list-wrapper
		position: absolute
		top: 110px
		bottom: 0
		padding: 10px 30px
		width: 100%
		.list-scroll
			overflow: hidden
			height: 100%
	.no-result-wrapper
		position: relative
		top: 100px
</style>
