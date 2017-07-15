<template>
<!-- 添加歌曲页面 -->
	<transition>
	<!-- @click.stop阻止冒泡 -->
		<div class="add-song" v-show="showFlag" @click.stop>
			<div class="header">
				<h1 class="title">添加歌曲</h1>
				<div class="close" @click="hide">
					<i class="icon-close"></i>
				</div>
			</div>
			<div class="search-box-wrapper">
			<!-- 为 search-box组件传一个placeholder 同时需要监听query事件-->
				<search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
			</div>
			<div class="shortcut" v-show="!query">
				<switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
			</div>
			<div class="list-wrapper" v-show="!query">
				<scroll v-if="currentIndex === 0" :data="playHistory" class="list-scroll" ref="songList">
					<div class="inner-list">
						<song-list :songs="playHistory" @select="selectSong"></song-list>
					</div>
				</scroll>
				<scroll v-if="currentIndex === 1" :data="playHistory" class="list-scroll" ref="searchList">
					<div class="inner-list">
						<search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
					</div>
				</scroll>
			</div>
			<div class="search-result" v-show="query">
				<suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import {searchMixin} from 'common/js/mixin'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import {mapGetters, mapActions} from 'vuex'
import SongList from 'base/song-list/song-list'
import Song from 'common/js/song'
import SearchList from 'base/search-list/search-list'
export default {
	mixins: [searchMixin],
	data() {
		return {
			// 组件的显示或隐藏
			showFlag: false,
			// 搜索词
			// query: '',
			// 是否搜索歌手
			showSinger: false,
			currentIndex: 0,
			switches: [
				{name: '最近播放'},
				{name: '搜索历史'}
			]
		}
	},
	computed: {
		...mapGetters([
			'playHistory'
		])
	},
	methods: {
		// 使组件显示
		show() {
			this.showFlag = true
			setTimeout(() => {
				if (this.currentIndex === 0) {
					this.$refs.songList.refresh()
				} else {
					this.$refs.searchList.refresh()
				}
			}, 20)
		},
		// 使组件隐藏
		hide() {
			this.showFlag = false
		},
		search(query) {
			this.query = query
		},
		selectSuggest() {
			this.saveSearchHistory(this.query)
		},
		switchItem(index) {
			this.currentIndex = index
		},
		selectSong(song, index) {
			if (index !== 0) {
				this.insertSong(new Song(song))
			}
		},
		...mapActions([
			'insertSong'
		])
	},
	components: {
		SearchBox,
		Suggest,
		Switches,
		Scroll,
		SongList,
		SearchList
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.add-song
	position: fixed
	top: 0
	left: 0
	right: 0
	bottom: 0
	width: 100%
	background: $color-background
	z-index: 200
	.header
		position: relative
		line-height: 45px
		text-align: center
		font-size: $font-size-large
		color: $color-text
		.close
			position: absolute
			top: 0
			right: 15px
			color: $color-theme
	.search-box-wrapper
		margin: 20px
	.shortcut
		position: relative
	.list-wrapper
		padding: 0 30px
		.inner-list
			height: 100%
			overflow: hidden
	.search-result
		position: fixed
		top: 124px
		bottom: 0
		width: 100%
</style>
