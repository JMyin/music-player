<template>
	<div class="search-list" v-show="searches.length">
		<ul>
			<li class="search-item" v-for="item in searches">
				<span class="text">{{item}}</span>
				<span class="icon">
					<i class="icon-delete"></i>
				</span>
			</li>
		</ul>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		searches: {
			type: Array,
			default: []
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
		.text
			flex: 1
		.icon
			extend-click()
			.icon-delete
				font-size: $font-size-medium
				color: $color-text-d

</style>
