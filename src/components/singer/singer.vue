<template>
  <div class="singer" ref="singer">
  	<list-view :data="singers" @select="selectSinger" ref="list"></list-view>
  	<router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer.js'
import ListView from 'base/listview/listview'
// vuex的语法糖 vuex对数据的获取和修改提供了一系列的语法糖
// 如果不用语法糖 需要写很长的代码 mapMutations对mutations做了一层封装
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
	mixins: [playListMixin],
	data() {
		return {
			singers: []
		}
	},
	created() {
		this._getSingerList()
	},
	methods: {
		// 当播放歌曲页面在底部最小化显示时 控制本组件的底部距离视口底部一定的距离 避免内容被底部的最小化歌曲播放条遮住
		handlePlayList(playList) {
			// 设置组件距离视口底部的距离
			const bottom = playList.length > 0 ? '60px' : ''
			this.$refs.singer.style.bottom = bottom
			// 刷新列表vielist组件
			this.$refs.list.refresh()
		},
		selectSinger(singer) {
			this.$router.push({
				path: `/singer/${singer.id}`
			})
			this.setSinger(singer)  // 就实现了对mutation的提交
		},
		_getSingerList() {
			getSingerList().then((res) => {
				if (res.code === ERR_OK) {
					this.singers = this._normalizeSinger(res.data.list)
				}
			})
		},
		// 将得到的数据修改为我们需要的
		_normalizeSinger(list) {
			let map = {
				hot: {
					title: HOT_NAME,
					items: []
				}
			}

			list.forEach((item, index) => {
				if (index < HOT_SINGER_LEN) {
					map.hot.items.push(new Singer({
						id: item.Fsinger_mid,
						name: item.Fsinger_name
					}))
				}
				const key = item.Findex
				// 如果没有以这个key为聚合的对象的话 就创建一个
				if (!map[key]) {
					map[key] = {
						title: key,
						items: []
					}
				}
				map[key].items.push(new Singer({
					id: item.Fsinger_mid,
					name: item.Fsinger_name
				}))
			})
			// 因为对象的遍历是无序的，为了得到有序列表，我们需要处理map
			// 热门的
			let hot = []
			// 剩下的
			let ret = []
			for (let key in map) {
				let val = map[key]
				if (val.title.match(/[a-zA-Z]/)) {
					ret.push(val)
				} else if (val.title === HOT_NAME) {
					hot.push(val)
				}
			}
			ret.sort((a, b) => {
				return a.title.charCodeAt(0) - b.title.charCodeAt(0)
			})
			return hot.concat(ret)
		},
		...mapMutations({
			// 将mutation的修改映射成一个方法名
			setSinger: 'SET_SINGER'
		})
	},
    components: {
        ListView
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
	position: fixed
	top: 88px
	bottom: 0
	width: 100%
</style>
