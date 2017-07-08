<!-- 滚动的基础组件 -->
<template>
	<scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
		<ul>
			<li v-for="group in data" class="list-group" ref="listgroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
						<img class="avatar" v-lazy="item.avatar" />
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<!-- 右侧字母导航 -->
		<div class="list-shortcut" @touchstart="onShortcutTouchStart"
		@touchmove.stop.prevent="onShortcutTouchMove">
			<ul>
				<li v-for="(item, index) in shortcutList" class="item" :data-index="index"  :class="{'current' : currentIndex === index}">
					{{item}}
				</li>
			</ul>
		</div>
		<div class="list-fixed" v-show="fixedTitle "ref="fixed">
			<h1 class="fixed-title">{{fixedTitle}}</h1>
		</div>
		<!-- 加载中 -->
		<div v-show="!data.length" class="loading">
			<loading></loading>
		</div>
	</scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom.js'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
	props: {
		data: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			scrollY: -1,
			currentIndex: 0,
			diff: -1
		}
	},
	created() {
		this.touch = {}
		this.listenScroll = true
		this.listHeight = []
		this.probeType = 3
	},
	computed: {
		shortcutList() {
			return this.data.map((group) => {
				return group.title.substring(0, 1)
			})
		},
		fixedTitle() {
			if (this.scrollY > 0) {
				return
			}
			return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
		}
	},
	methods: {
		// 右侧导航相关操作事件
		onShortcutTouchStart(e) {
			let anchorIndex = getData(e.target, 'index')
			// e.touches[0]是手指最初的位置 要保存其pageY
			let firstTouch = e.touches[0]
			this.touch.y1 = firstTouch.pageY
			// 初始化记录当前锚点索引
			this.touch.anchorIndex = anchorIndex
			this._scrollTo(anchorIndex)
		},
		onShortcutTouchMove(e) {
			// 计算从touchstart到touchmove滚动的位置，计算当前位置与一开始滚动的位置的距离差
			let firstTouch = e.touches[0]
			this.touch.y2 = firstTouch.pageY
			let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
			// 再次记录move的时候的锚点索引 this.touch.anchorIndex是一个字符串 delta是一个数字 两者直接相加会出错
			let anchorIndex = parseInt(this.touch.anchorIndex) + delta
			// 可以得到move的时候可以滚动到第几个位置
			this._scrollTo(anchorIndex)
		},
		refresh() {
			this.$refs.listview.refresh()
		},
		scroll(pos) {
			this.scrollY = pos.y
		},
		// 滚动到指定位置
		_scrollTo(index) {
			console.log(index)
			if (!index && index !== 0) {
				return
			}
			if (index < 0) {
				index = 0
			} else if (index > this.listHeight - 2) {
				index = this.listHeight - 2
			}
			this.scrollY = -this.listHeight[index]
			// this.$refs.listgroup[anchorIndex] ????????
			this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
		},
		// 调用时机： 当传给listview的data发生变化的时候要去计算高度
		_calculateHeight() {
			this.listHeight = []
			const list = this.$refs.listgroup
			let height = 0
			this.listHeight.push(height)
			for (let i = 0; i < list.length; i++) {
				let item = list[i]
				height += item.clientHeight
				this.listHeight.push(height)
			}
		},
		// 派发事件
		selectItem(item) {
			this.$emit('select', item)
		}
	},
	watch: {
		// 当data变化的时候 重新计算高度
		data() {
			setTimeout(() => {
				this._calculateHeight()
			}, 20)
		},
		scrollY(newY) {
			const listHeight = this.listHeight
			// 当滚动到顶部 newY > 0
			if (newY > 0) {
				this.currentIndex = 0
				return
			}
			// 当在中间部分滚动时
			for (let i = 0; i < listHeight.length - 1; i++) {
				let h1 = listHeight[i]
				let h2 = listHeight[i + 1]
				// !h2 变量的最后一个的情况 newY是一个负值 盖度计算都是正值
				if (-newY >= h1 && -newY < h2) {
					this.currentIndex = i
					// 在中间滚动的时候 上限h2 减去滚动的高度newY（负值） 就是 diff
					this.diff = h2 + newY
					return
				}
			}
			// 当滚动到底部 且 -newY大于最后一个元素的上限
			this.currentIndex = listHeight.length - 2
		},
		diff(newVal) {
			// 向上偏移是负值
			let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
			//  diff是实时变化的 当new
			if (this.fixedTop === fixedTop) {
				return
			}
			this.fixedTop = fixedTop
			this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
		}
	},
	components: {
		Scroll,
		Loading
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable'
.listview
	position: relative
	width: 100%
	height: 100%
	overflow: hidden
	background: $color-background
	.list-group
		/* padding-left: 20px */
		.list-group-title
			height: 30px
			line-height: 30px
			padding-left: 20px
			font-size: $font-size-small
			color: $color-text-l
			background: $color-highlight-background
		.list-group-item
			width: 100%
			display: flex
			padding: 15px 20px
			:hover
				background-color: $color-highlight-background
			.avatar
				flex: 0 0 60px
				width: 60px
				height: 60px
				border-radius: 50%
				margin-right: 20px
			.name
				flex: 1
				line-height: 60px
	.list-shortcut
		position: absolute;
		top: 50px
		right: 0px
		z-index: 30
		width: 20px
		padding: 20px 0
		border-radius: 10px
		text-align: center
		background: $color-background-d
		transfrom: translateY(-50%)
		color: $color-text-l
		.item
			padding: 3px
			line-height: 1
			color: $color-text-l
			font-size: $font-size-small
			&.current
				color: $color-theme
	.list-fixed
		position: absolute
		top: 0
		left: 0
		height: 30px
		line-height: 30px
		width: 100%
		background: $color-highlight-background
		color: $color-text-l
		font-size: $font-size-small
		padding-left: 20px
	.loading
		position: relative
		top: 50px
		left: 0
		width: 100%
</style>
