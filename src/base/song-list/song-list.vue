<!-- 可复用的音乐歌曲列表页 -->
<template>
	<div class="song-list">
		<ul>
			<li v-for="(song, index) in songs" class="item" @click="selectItem(song, index)">
				<div class="rank" v-show="rank">
					<span :class="getRankCls(index)">{{getRankText(index)}}</span>
				</div>
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
		},
		rank: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		getDesc(song) {
			return `${song.singer}、${song.album}`
		},
		// 不需要业务逻辑 只需要派发事件
		selectItem(item, index) {
			this.$emit('select', item, index)
		},
		// 扩张music-list 在列表前面添加排行 为添加的元素设置类
		getRankCls(index) {
			if (index <= 2) {
				return `icon icon${index}`
			} else {
				return `text`
			}
		},
		getRankText(index) {
			if (index > 2) {
				return index + 1
			}
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
	overflow: hidden
	.item
		width: 100%
		display: flex
		.rank
			flex: 0 0 25px
			width: 25px
			margin-right: 30px
			padding: 20px 0
			text-align: center
			.icon
				display: inline-block
				width: 25px
				height: 24px
				background-size: 25px 24px
				&.icon0
					bg-image('first')
				&.icon1
					bg-image('second')
				&.icon2
					bg-image('third')
				.text
					color: $color-theme
					font-size: $font-size-large
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
