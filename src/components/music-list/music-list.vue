<template>
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<h1 class="title">{{title}}</h1>
		<div class="bg-image" :style="bgStyle" ref="bgImage">
			<div class="play-wrapper">
				<div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
			<div class="filter" ref="filter"></div>
		</div>
		<div class="bg-layer" ref="layer"></div>
		<scroll @scroll="scroll" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" class="list" ref="list">
			<div class="song-list-wrapper">
				<song-list :songs="songs" @select="selectItem"></song-list>
			</div>
			<div v-show="!songs.length" class="loading-container">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom'
// vuex的语法糖
import {mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
	// 组件里的同名方法可以覆盖掉mixin里的方法
	mixins: [playListMixin],
	props: {
		bgImage: {
			type: String,
			default: ''
		},
		songs: {
			type: Array,
			default: []
		},
		title: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			// bg-layer的纵向滚动的值
			scrollY: 0
		}
	},
	created() {
		this.probeType = 3
		// 需要监听滚动
		this.listenScroll = true
	},
	computed: {
		bgStyle() {
			return `background-image: url(${this.bgImage})`
		}
	},
	mounted() {
		// 获取图片高度
		this.imageHeight = this.$refs.bgImage.clientHeight
		this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
		this.$refs.list.$el.style.top = `${this.imageHeight}px`
	},
	methods: {
		scroll(pos) {
			// 实时的为scrollY赋值 拿到scrollY的值之后 设置bg-layer的偏移量
			this.scrollY = pos.y
		},
		back() {
			this.$router.back()
		},
		selectItem(item, index) {
			this.selectPlay({
				list: this.songs,
				index
			})
		},
		// 随机播放也要创建actions
		random() {
			this.randomPlay({
				list: this.songs
			})
		},
		// 操作本组件的scroll的bottom值
		handlePlayList(playList) {
			const bottom = playList.length > 0 ? '60px' : ''
			// this.$refs.list是一个vue组件 所以要取他的元素 得访问它的$el
			this.$refs.list.$el.style.bottom = bottom
			// 使scroll重新计算 重新刷新
			this.$refs.list.refresh()
		},
		// 通过mapActions这个语法糖将action包装成类似于函数调用的形式
		...mapActions([
			'selectPlay',
			'randomPlay'
			])
	},
	watch: {
		scrollY(newY) {
			// 最多滚动的高度
			let translateY = Math.max(this.minTranslateY, newY)
			let zIndex = 0
			let scale = 1
			let blur = 0
			this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
			const percent = Math.abs(newY / this.imageHeight)
			// newY > 0 就是往下拉的时候
			if (newY > 0) {
				scale = 1 + percent
				zIndex = 10
			} else {
				// 设置最大模糊度为20
				blur = Math.min(20 * percent, 20)
			}
			// iphone
			this.$refs.filter.style[backdrop] = `blur(${blur}px)`
			// 设置bg-layer滚动的高度达到最大高度时最上方部分背景图片的样式
			if (newY < this.minTranslateY) {
				zIndex = 10
				this.$refs.bgImage.style.paddingTop = 0
				this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
				this.$refs.playBtn.style.display = 'none'
			} else {
				this.$refs.bgImage.style.paddingTop = `70%`
				this.$refs.bgImage.style.height = 0
				this.$refs.playBtn.style.display = ''
			}
			this.$refs.bgImage.style.zIndex = zIndex
			this.$refs.bgImage.style[transform] = `scale(${scale})`
		}
	},
	components: {
		Scroll,
		SongList,
		Loading
	}
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.music-list
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
    height: 100%
    z-index: 100
    background: $color-background
    .back
    	position: absolute
    	top: 5px
    	left: 6px
    	width: 30px
    	height: 30px
    	z-index: 50
    	.icon-back
    		display: block
    		padding: 10px
    		font-size: $font-size-large-s
    		color: $color-theme
    .title
    	position: absolute
    	top: 0
    	left: 10%
    	z-index: 40
    	width: 80%
    	text-align: center
    	line-height: 40px
    	font-size: $font-size-large
    	color: $color-text
    .bg-image
    	position: relative
    	width: 100%
    	height: 0
    	padding-top: 70%
    	transfrom-origin: top
    	background-size: cover
    	.play-wrapper
    		position: absolute
    		bottom: 20px
    		left: 50%
    		margin-left: -65px
    		color: $color-theme
    		.play
    			width: 130px
    			height: 25px
    			line-height: 25px
    			text-align: center
    			padding: 3px
    			border: 1px solid $color-theme
    			border-radius: 10px
    .bg-layer
    	position: relative
    	height: 100%
    	width: 100%
    	background: $color-background
    .list
    	position: fixed
    	top: 0
    	bottom: 0
    	width: 100%
    	background: $color-background
    	.song-list-wrapper
    		padding: 20px 30px
    	.loading-container
    		position: absolute
    		width: 100%
    		top: 50%
    		transfrom: translate3d(-50%)

</style>
