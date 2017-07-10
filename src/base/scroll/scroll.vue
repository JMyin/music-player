<!-- 滚动的基础组件 -->
<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
	props: {
		// 监听的时候慢速滚动可以监听到，快速滚动也可以监听到
		probeType: {
			type: Number,
			default: 1
		},
		// scroll可不可以点击，需不需要手动派发
		click: {
			type: Boolean,
			default: true
		},
		// 动态变化的数据，变化时需要从此你refresh
		data: {
			type: Array,
			default: null
		},
		// 规定scroll是否需要监听滚动事件
		listenScroll: {
			type: Boolean,
			default: false
		},
		pullup: {
			type: Boolean,
			default: false
		}
	},
	// 当DOmready后
	mounted() {
		// 保证组件已渲染
		setTimeout(() => {
			this._initScroll()
		}, 20)
	},
	methods: {
		// 初始化
		_initScroll() {
			// 当组件被调用时，如果$refs.wrapper还是undefined的时候
			if (!this.$refs.wrapper) {
				return
			}
			this.scroll = new BScroll(this.$refs.wrapper, {
				probeType: this.probeType,
				click: this.click
			})
			if (this.listenScroll) {
				// 保存vue实例的this
				let that = this
				// better-scroll的this在这里默认是指向scroll的
				this.scroll.on('scroll', (pos) => {
					that.$emit('scroll', pos)
				})
			}
			// 监听上拉刷新，在滚动结束的时候会派发一个scrollEnd事件
			if (this.pullup) {
				this.scroll.on('scrollEnd', () => {
					if (this.scroll.y <= this.scroll.maxScrollY + 50) {
						// scrollEnd表示滚动停止了,scrollToEnd表示滚动到底部了
						this.$emit('scrollToEnd')
					}
				})
			}
		},
		// 以下都与better-scroll的方法有关
		enable() {
			this.scroll && this.scroll.enable()
		},
		disable() {
			this.scroll && this.scroll.disable()
		},
		refresh() {
			this.scroll && this.scroll.refresh()
		},
		scrollTo() {
			this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
		},
		scrollToElement() {
			this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
		}
	},
	watch: {
		data() {
			setTimeout(() => {
			this.refresh()
		}, 20)
		}
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable'
</style>
