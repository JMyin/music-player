<!-- 排行页面 -->
<template>
  	<div class="rank" ref="rank">
		<scroll class="top-list" :data="topList" ref="topList">
			<ul>
				<li class="item" v-for="item in topList" @click="selectItem(item)">
					<div class="icon">
						<img v-lazy="item.picUrl" alt="" width="100" height="100">
					</div>
					<ul class="song-list">
						<li class="song" v-for="(song, index) in item.songList">
							<span>{{index + 1}}</span>
							<span>{{song.songname}}-{{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-container" v-show="!topList">
				<loading></loading>
			</div>
		</scroll>
		<router-view></router-view>
  	</div>
</template>

<script type="text/ecmascript">
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
	mixins: [playListMixin],
	data() {
		return {
			topList: []
		}
	},
	created() {
		this._getTopList()
	},
	methods: {
		handlePlayList(playList) {
			const bottom = playList.length ? '60px' : ''
			this.$refs.rank.style.bottom = bottom
			this.$refs.topList.refresh()
		},
		_getTopList() {
			getTopList().then((res) => {
				if (res.code === ERR_OK) {
					this.topList = res.data.topList
				}
			})

		},
		// 点击排行榜页面的任意行然后跳转到子(路由)页面
		selectItem(item) {
			this.$router.push({
				path: `/rank/${item.id}`
			})
			// 类似于函数 传入函数的item就县对应到vuex里的topList 这样就把topList写到vuex的数据里了
			// 可以在别的组件通过mapGeeters拿到
			this.setTopList(item)
		},
		...mapMutations({
			setTopList: 'SET_TOP_LIST'
		})
	},
  components: {
  	Scroll,
  	Loading
  }
}
</script>

<style scoped lang="stylus" type="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.rank
	position: fixed
	top: 88px
	bottom: 0
	width: 100%
	.top-list
		width: 100%
		height: 100%
		overflow: hidden
		.item
			display: flex
			margin: 0 20px
			padding-top: 20px
			height: 100px
			&:last-child
				padding-bottom: 20px
			.icon
				flex: 0 0 100px
				width: 100px
				height: 100px
			.song-list
				flex: 1
				display: flex
				flex-direction: column
				justify-content: center
				padding: 0 20px
				height: 100px
				overflow: hidden
				background: $color-highlight-background
				color: $color-text-d
				font-size: $font-size-small
				.song
					line-height: 26px
					no-wrap()

</style>
