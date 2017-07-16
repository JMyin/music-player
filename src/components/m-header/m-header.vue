<template>
	<div class="m-header">
		<div class="icon"></div>
		<h1 class="text">FAMily Music</h1>
		<router-link to="/user" class="user" tag="div">
			<i class="icon-mine"></i>
		</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
	.m-header
		position: relative
		padding-top: 8px
		text-align: center
		color: $color-theme
		.user
			position: absolute;
			top: 8px
			right: 15px

</style>
