<template>
	<transition name="drop">
		<div class="top-tip" v-show='showFlag' @click.stop="hide">
			<slot></slot>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		// 使父组件可以控制本组件的显示时间
		delay: {
			type: Number,
			default: 2000
		}
	},
	data() {
		return {
			showFlag: false
		}
	},
	methods: {
		show() {
			this.showFlag = true
			// 多次添加的时候 只执行一次
			if (this.timer) {
				clearTimeout(this.timer)
			}
			// 设置提示信息2s后自动消失
			this.timer = setTimeout(() => {
				this.hide()
			}, this.delay)
		},
		hide() {
			this.showFlag = false
		}
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.top-tip
	position: fixed
	top: 0
	width: 100%
	z-index: 500
	text-align: center
	color: $color-theme
	background: $color-dialog-background
	&.drop-enter-active, &.drop-leave-active
		transition: all .3s
	&.drop-enter, &.drop-leave-to
		transform: translate3d(100%, 0, 0)
</style>
