<template>
	<div class="search-list" v-show="searches.length">
		<transition-group name="list" tag="ul">
			<li :key="item" @click="selectItem(item)" class="search-item" v-for="item in searches">
				<span class="text">{{item}}</span>
				<span class="icon" @click.stop="deleteOne(item)">
					<i class="icon-delete"></i>
				</span>
			</li>
		</transition-group>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		searches: {
			type: Array,
			default: []
		}
	},
	methods: {
		selectItem(item) {
			this.$emit('select', item)
		},
		deleteOne(item) {
			this.$emit('delete', item)
		}
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.search-list
	position: relative
	width: 100%
	.search-item
		display: flex
		height: 40px
		line-height: 40px
		color: $color-text-l
		&.list-enter-active, &.list-leave-active
			transition: all 0.3s
		&.list-enter, &.list-leave-to
			height: 0
		.text
			flex: 1
		.icon
			extend-click()
			.icon-delete
				font-size: $font-size-medium
				color: $color-text-d

</style>
