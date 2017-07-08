<template>
	<div class="progress-bar" ref="progressBar" @click="progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn-wrapper" ref="progressBtn" @touchstart="progressTouchStart" @touchmove="progressTouchMove" @touchend="progressTouchEnd">
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')

const progressBtnWidth = 16

export default {
	props: {
		percent: {
			type: Number,
			default: 0
		}
	},
	created() {
		// 共享数据
		this.touch = {}
	},
	methods: {
		progressTouchStart(e) {
			this.touch.initiated = true
			// touch的点击位置 pageX表示横向坐标
			this.touch.startX = e.touches[0].pageX
			// 开始点击的时候 已经在进度条上偏移的位置
			this.touch.left = this.$refs.progress.clientWidth
		},
        progressTouchMove(e) {
            if (!this.touch.initiated) {
                return
            }
            // 纵向偏移量
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
            this._offset(offsetWidth)
        },
        progressTouchEnd(e) {
            this.touch.initiated = false
            this._triggerPercent()
        },
        // 通知外层percent的改变
        _triggerPercent() {
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
            const percent = this.$refs.progress.clientWidth / barWidth
            // 派发一个percentChange事件， 把percent派发出去
            this.$emit('percentChange', percent)
        },
        // 偏移
        _offset(offsetWidth) {
            // 目前的偏移量
            this.$refs.progress.style.width = `${offsetWidth}px`
            // 小球的偏移
			this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        },
        progressClick(e) {
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            // 当点击progress-btn的时候，e.offsetX获取不对
            // this._offset(e.offsetX)
            this._offset(offsetWidth)
            this._triggerPercent()
        }
	},
	watch: {
		percent(newPercent) {
			if (newPercent >= 0 && !this.touch.initiated) {
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
				// 应该偏移的宽度
				const offsetWidth = newPercent * barWidth
				this._offset(offsetWidth)
			}
		}
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.progress-bar
	height: 30px
	.bar-inner
		position: relative
		top: 13px
		height: 4px
		background: rgba(0, 0, 0, 0.4)
		.progress
			position: absolute
			height: 100%
			background: $color-theme
		.progress-btn-wrapper
			position: absolute
			left: -8px
			top: -13px
			width: 30px
			height: 30px
			.progress-btn
				position: relative
				top: 7px
				left: 7px
				box-sizing: border-box
				width: 16px
				height: 16px
				border: 3px solid $color-text
				border-radius: 50%
				background: $color-theme

</style>
