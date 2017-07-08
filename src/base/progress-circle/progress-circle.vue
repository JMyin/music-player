<template>
	<div class="progress-circle">
	<!-- viewBox是一个视口的宽度和位置 从左上角的（0， 0）一直到(100, 100)这样的一个区域 与下面的circle的半径是相对应的 半径为50可以直接填满这个svg  width与height是实际显示的大小 可以设置成一个从外部传入的 这样通用性更好-->
		<svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<!-- r是半径 cx cy 是圆心坐标-->
			<circle class="progress-background" r="50" cx="50" cy="50"></circle>
			<!-- stroke-dasharray="100" 描边距离 stroke-dashoffset描边偏移 所以percent要映射到这个偏移变化 偏移为0时表示一整圈 就是播放完毕-->
			<circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
		</svg>
		<slot></slot>
	</div>
</template>
<script type="text/ecmascript-6">
export default {
	props: {
		radius: {
			type: Number,
			default: 100
		},
		percent: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			// 表示周长 50*2*PI
			dashArray: Math.PI * 100
		}
	},
	computed: {
		dashOffset() {
			// percent为0 时 表示歌曲进度为0 此时stroke-dashoffset偏移为360度
			return (1 - this.percent) * this.dashArray
		}
	}
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
.progress-circle
	position: relative
	circle
		stroke-width: 8px
		/* stroke-width表示描边宽度 */
		transform-origin: center
		&.progress-background
			transform: scale(0.9)
			stroke: $color-theme-d
		&.progress-bar
			transform: scale(0.9) rotate(-90deg)
			stroke: $color-theme

</style>
