<template>
	<div class="song-list">
		<ul>
			<li v-for="(song, index) in songs" class="item" @click="selectItem(song, index)">
				<div class="content">
					<h2 class="name">{{song.name}}</h2>
					<p class="desc">{{getDesc(song)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		songs: {
			type: Array,
			default: []
		}
	},
	methods: {
		getDesc(song) {
			return `${song.singer}、${song.album}`
		},
		// 不需要业务逻辑 只需要派发事件
		selectItem(item, index) {
			this.$emit('select', item, index)
		}
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.song-list
	width: 100%
	height: 100%
	.item
		width: 100%
		.content
			padding: 10px 0
			font-size: $font-size-medium
			.name
				color: $color-text
				line-height: 30px
			.desc
				color: $color-text-l
				line-height: 20px

</style>
