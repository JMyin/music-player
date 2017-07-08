<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
    	<slot>
    		
    	</slot>
    </div>
    <div class="dots">
    	<span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import addClass from 'common/js/dom'
export default {
	// name: 'slider', ???????
	data() {
		return {
			dots: [],
			currentPageIndex: 0
		}
	},
	props: {
		// 可否轮播
		loop: {
			type: Boolean,
			default: true
		},
		// 可否自动轮播
		autoPlay: {
			type: Boolean,
			default: true
		},
		// 轮播时间间隔
		interval: {
			type: Number,
			default: 4000
		}
	},
	mounted() {
		setTimeout(() => {
			// 初始化轮播图容器的宽度
			this._setSliderWidth()
			this._initDots()
			this._initSlider()
			if (this.autoPlay) {
				this._play()
			}
		}, 20)
		// 监听浏览器的resize事件 然后重新设置轮播图的宽度（为了避免的不同的屏幕大小切换时，轮播图的宽度不等于屏幕的视口宽度）
		window.addEventListener('resize', () => {
			if (!this.slider) {
				return
			}
			this._setSliderWidth(true)
			this.slider.refresh()
		})
	},
	methods: {
		// 设置轮播图的宽度
		_setSliderWidth(isResize) {
			this.children = this.$refs.sliderGroup.children
			console.log(this.children.length)
			let width = 0
			let sliderWidth = this.$refs.slider.clientWidth

			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i]

				addClass(child, 'slider-item')

				child.style.width = sliderWidth + 'px'

				width += sliderWidth
			}
			if (this.loop && !isResize) {
				width += 2 * sliderWidth
			}
			this.$refs.sliderGroup.style.width = width + 'px'
		},
		// 初始化轮播图下方小圆的个数
		_initDots() {
			this.dots = new Array(this.children.length)
		},
		// 初始化轮播图的轮播设置
		_initSlider() {
			this.slider = new BScroll(this.$refs.slider, {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: true,
				snapLoop: this.loop,
				snapThreshold: 0.3,
				snapSpeed: 400
			})
			// 每次滚动完毕的时候都会派发一个 scrollEnd 事件
			this.slider.on('scrollEnd', () => {
				let pageIndex = this.slider.getCurrentPage().pageX
				if (this.loop) {
					pageIndex -= 1
				}
				this.currentPageIndex = pageIndex
				if (this.autoPlay) {
					clearTimeout(this.timer)
					this._play()
				}
			})
		},
		_play() {
			let pageIndex = this.currentPageIndex + 1
			if (this.loop) {
				pageIndex += 1
			}
			// goToPage是berrer-scroll的一个方法 ，0代表Y方向的，400代表时间间隔
			this.timer = setTimeout(() => {
				this.slider.goToPage(pageIndex, 0, 400)
			}, this.interval)
		}
	},
	destroyed() {
		// 清除定时器
		clearTimeout(this.timer)
	},
  components: {
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable'
.slider
	min-height: 1px
	position: relative
	.slider-group
		position: relative
		overflow: hidden
		white-space: none
		.slider-item
			float: left
			box-sizing: border-box
			overflow: hidden
			text-align: center
			a
				display: block
				width: 100%
				overflow: hidden
				text-decoration: none
			img
				display: block
				width: 100%
	.dots
		position: absolute
		right: 0
		left: 0
		bottom: 12px
		text-align: center
		font-size: 0
		.dot
			display: inline-block
			margin: 0 4px
			width: 8px
			height: 8px
			border-radius: 50%
			background: $color-text-l
			&.active
				background: $color-theme

</style>
