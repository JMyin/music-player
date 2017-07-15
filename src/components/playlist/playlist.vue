<template>
	<transition name="list-fade">
		<div class="playlist" v-show="showFlag" @click="hide">
			<div class="list-wrapper" @click.stop>
				<div class="list-header">
					<h1 class="title">
						<i class="icon" :class="iconMode" @click="changeMode"></i>
						<span class="text">{{modeText}}</span>
						<span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
					</h1>
				</div>
				<scroll ref="listContent" :data="sequenceList" class="list-content">
					<transition-group name="list" tag="ul">
						<li :key="item.id" class="item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)">
							<i class="current" :class="getCurrentIcon(item)"></i>
							<span class="text">{{item.name}}</span>
							<span class='like'>
								<i class="icon-not-favorite"></i>
							</span>
							<span class="delete" @click.stop="deleteOne(item)">
								<i class="icon-delete"></i>
							</span>
						</li>
					</transition-group>
				</scroll>
				<div class="list-operate">
					<div class="add">
						<i class="icon-add"></i>
						<span class="text">添加歌曲到队列</span>
					</div>
				</div>
				<div class="list-close"  @click="hide">
					<span>关闭</span>
				</div>
			</div>
			<confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import {playerMixin} from 'common/js/mixin'

export default {
	mixins: [playerMixin],
	data() {
		return {
			showFlag: false
		}
	},
	computed: {
		// 通过mapGetters拿到sequenceList 封装在mixin里
		// ...mapGetters([
		// 	'sequenceList',
		// 	'currentSong',
		// 	'playList',
		// 	'mode'
		// ])
		modeText() {
			return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '循环播放'
		}
	},
	methods: {
		show() {
			this.showFlag = true
			// 保证DOM渲染之后
			setTimeout(() => {
				this.$refs.listContent.refresh()
				this.scrollToCurrent(this.currentSong)
			}, 20)
		},
		hide() {
			this.showFlag = false
		},
		getCurrentIcon(item) {
			if (this.currentSong.id === item.id) {
				return 'icon-play'
			} else {
				return
			}
		},
		selectItem(item, index) {
			if (this.mode === playMode.random) {
				// 通过当前的播放列表的id  找到当前这个item在playList里的索引，然后设置这个索引即可
				index = this.playList.findIndex((song) => {
					return song.id === item.id
				})
			}
			this.setCurrentIndex(index)
			this.setPlayingState(true)
		},
		// 选择歌曲播放页面的playlist里的歌曲时 或者打开playlist时，使页面显示在正在播放的歌曲所在位置
		scrollToCurrent(current) {
			const index = this.sequenceList.findIndex((song) => {
				return current.id === song.id
			})
			this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
		},
		// 删除playlist列表里的一首歌
		deleteOne(item) {
			this.deleteSong(item)
			if (!this.playList.length) {
				this.hide()
			}
		},
		// 显示是否清空列表提示
		showConfirm() {
			this.$refs.confirm.show()
		},
		// 清空列表 要先定义action
		confirmClear() {
			this.deleteSongList()
			this.hide()
		},
		// 封装到mixin里
		// ...mapMutations({
		// 	setCurrentIndex: 'SET_CURRENT_INDEX',
		// 	setPlayingState: 'SET_PLAYING_STATE'
		// }),
		...mapActions([
			'deleteSong',
			'deleteSongList'
		])
	},
	watch: {
		currentSong(newSong, oldSong) {
			if (!this.showFlag || newSong.id === oldSong.id) {
				return
			}
			this.scrollToCurrent(newSong)
		}
	},
	components: {
		Scroll,
		Confirm
	}
}
	
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.playlist
	position: fixed
	top: 0
	left: 0
	right: 0
	bottom: 0
	z-index: 200
	background: $color-background-d
	.list-wrapper
		position: absolute
		bottom: 0
		width: 100%
		box-sizing: border-box
		color: $color-text-l
		font-size: $font-size-medium
		background-color: $color-highlight-background
		.list-header
			height: 40px
			line-height: 40px
			padding: 5px 15px
			border-bottom: 1px solid $color-background
			.title
				display: flex
				align-items: center
				.icon
					margin-right: 10px
					font-size: 30px
					color: $color-theme-d
				.text
					flex: 1
				.clear
					extend-wrap()
					.icon-clear
						color: $color-text-d
						font-size: $font-size-medium
		.list-content
			width: 100%
			overflow: hidden
			max-height: 240px
			box-sizing: border-box
			.item
				display: flex
				align-items: center
				height: 30px
				overflow: hidden
				padding: 5px 20px 5px 10px
				&.list-enter-active, &.list-leave-active
					transition: all 0.3s linear
				&.list-enter, &.list-leave
					height: 0
				.current
					flex: 0 0 20px
					width: 20px
				.text
					flex: 1
				.like
					extend-click()
					margin-right: 15px
				.delete
					extend-click()
		.list-operate
			width: 100%
			height: 40px
			line-height: 30px
			.add
				width: 150px
				height: 30px
				margin: 0 auto
				text-align: center
				border: 1px solid $color-text-l
				border-radius: 20px
				.icon-add
					display: inline-block
					margin-right: 5px

		.list-close
			width: 100%
			height: 40px
			line-height: 40px
			text-align: center
			background: $color-background
			font-size: $font-size-large
				


	&.list-fade-enter-active, &.list-fade-leave-active
		transfrom: all .3s
	&.list-fade-enter, &.list-fade-leave
		transfrom: translate3d(100%, 0, 0)
</style>
