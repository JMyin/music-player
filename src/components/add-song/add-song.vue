<template>
	<transition>
		<div class="add-song">
			<div class="header">
				<h1 class="title">添加歌曲</h1>
				<div class="close">
					<i class="icon-close"></i>
				</div>
			</div>
			<div class="search-box-wrapper"></div>
			<div class="shortcut"></div>
			<div class="search-result"></div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
export default {}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.add-song
	position: fixed
	top: 0
	left: 0
	right: 0
	bottom: 0
	width: 100%
	background: $color-background
	z-index: 200
	.header
		position: relative
		height: 40px
		line-height: 40px
		text-align: center
		font-size: $font-size-large
		color: $color-text
	.search-box-wrapper
		margin: 20px
	.shortcut
		position: relative
	.search-result
		position: fixed
		top: 124px
		bottom: 0
		width: 100%
</style>
