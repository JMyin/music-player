<template>
<!-- 添加歌曲页的搜索框下方的按钮 -->
	<div>
		<ul class="switches">
			<li class="switches-item" v-for="(item, index) in switches" :class="{'active': currentIndex===index}" @click="switchItem(index)">
				<span>{{item.name}}</span>
			</li>
		</ul>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		switches: {
			type: Array,
			default: []
		},
		currentIndex: {
			type: Number,
			default: 0
		}
	},
	methods: {
		switchItem(index) {
			// 向父组件派发一个switch事件 并把index传出去
			this.$emit('switch', index)
		}
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.switches
	display: flex
	align-items: center
	width: 240px
	margin: 0 auto
	border: 1px solid $color-highlight-background
	border-radius: 5px
	.switches-item
		flex: 1
		padding: 10px
		color: $color-text-l
		&.active
			color: $color-text

</style>
