<template>
	<scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" :beforeScroll="beforeScroll" @beforeScroll="listScroll" ref="suggest">
		<ul class="suggest-list">
			<li class="suggest-item" v-for="item in result" @click="selectItem(item)">
				<div class="icon">
					<i :class="getIconCls(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayName(item)"></p>
				</div>
			</li>
			<loading v-show="hasMore"></loading>
		</ul>
		<div v-show="!hasMore && !result.length" class="no-result-wrapper">
			<no-result title="抱歉，暂无搜索数据"></no-result>
		</div>
	</scroll>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
// 每页显示多少个
const perpage = 20

export default {
	props: {
		query: {
			type: String,
			default: ''
		},
		// 表示是否在搜索结果中显示歌手
		showSinger: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			// 搜索的时候需要传第几页
			page: 1,
			// 经过处理的搜索结果
			result: [],
			// 上拉刷新
			pullup: true,
			hasMore: true,
			beforeScroll: true
		}
	},
	methods: {
		search() {
			// 开始的时候要初始化一些数据 避免更改搜索内容之后 还在之前的page等基础上搜索加载
			this.page = 1
			this.hasMore = true
			this.$refs.suggest.scrollTo(0, 0)
			console.log('search')
			search(this.query, this.page, this.showSinger, perpage).then((res) => {
				if (res.code === ERR_OK) {
					this.result = this._getResult(res.data)
					this._checkMore(res.data)
				}
			})
		},
		// 上拉刷新 加载更多 搜索结果
		searchMore() {
			if (!this.hasMore) {
				return
			}
			this.page++
			search(this.query, this.page, this.showSinger, perpage).then((res) => {
				this.result = this.result.concat(this._getResult(res.data))
				this._checkMore()
			})
		},
		// 检查是否还有更多数据
		_checkMore(data) {
			const song = data.song
			if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
				this.hasMore = false
			}
		},
		_getResult(data) {
			let ret = []
			if (data.zhida && data.zhida.singerid) {
				ret.push({...data.zhida, ...{type: TYPE_SINGER}})
			}
			if (data.song) {
				ret = ret.concat(this._normalizeSongs(data.song.list))
			}
			return ret
		},
		_normalizeSongs(list) {
			let ret = []
			list.forEach((musicData) => {
				if (musicData.songid && musicData.albumid) {
					ret.push(createSong(musicData))
				}
			})
			return ret
		},
		getIconCls(item) {
			if (item.type === TYPE_SINGER) {
				return 'icon-mine'
			} else {
				return 'icon-music'
			}
		},
		getDisplayName(item) {
			if (item.type === TYPE_SINGER) {
				return item.singername
			} else {
				return `${item.name}-${item.singer}`
			}
		},
		selectItem(item) {
			// 如果选择的是歌手 就进入歌手的歌曲列表页
			if (item.type === TYPE_SINGER) {
				const singer = new Singer({
					id: item.singermid,
					name: item.singername
				})
				this.$router.push({
					path: `/search/${singer.id}`
				})
				this.setSinger(singer)
			} else {
				// 如果选择的是歌曲，就将歌曲插入现在的播放列表中 调用insertSong实际上就触发了
				// mapActions  就提交了action 然后修改playList 、sequenceList、currentIndex
				this.insertSong(item)
			}
		},
		listScroll() {
			this.$emit('listScroll')
		},
		...mapMutations({
			setSinger: 'SET_SINGER'
		}),
		...mapActions([
			'insertSong'
		])
	},
	watch: {
		query(newQuery) {
			this.search(newQuery)
		}
	},
	components: {
		Scroll,
		Loading,
		NoResult
	}
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.suggest
	height: 100%
	overflow: hidden
	.suggest-list
		padding: 0 30px
		.suggest-item
			display: flex
			align-items: center
			padding-bottom: 20px
		.icon
			flex: 0 0 30px
			width: 30px
			[class^="icon-"]
				font-size: 14px
				color: $color-text-d
		.name
			flex: 1
			font-size: $font-size-medium
			color: $color-text-d
			overflow: hidden
			.text
				no-wrap()
	.no-result-wrapper
		position: absolute
		width: 100%
		top: 50%
		transform: translateY(-50%)

</style>
