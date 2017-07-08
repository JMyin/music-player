<template>
	<div class="player" v-show="playList.length>0">
	<transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
		<div class="normal-player" v-show="fullScreen">
			<div class="background">
				<img :src="currentSong.image" width="100%" height="100%">
			</div>
			<div class="top">
				<div class="back" @click="back">
					<i class="icon-back"></i>
				</div>
				<h1 class="title" v-html="currentSong.name"></h1>
				<h2 class="subtitle" v-html="currentSong.singer"></h2>
			</div>
			<div class="middle" @touchstart.prevent="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
				<div class="middle-l" ref="middleL">
					<div class="cd-wrapper" ref="cdWrapper">
						<div class="cd" :class="cdCls">
							<img :src="currentSong.image" alt="" class="image">
						</div>
					</div>
					<div class="playing-lyric-wrapper">
						<div class="playing-lyric">{{playingLyric}}</div>
					</div>
				</div>
				<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
					<div class="lyric-wrapper">
						<div v-if="!!(currentLyric)">
							<p class="text" :class="{'current': currentLineNum === index}" ref="lyricLine" v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
						</div>
					</div>
				</scroll>
			</div>
			<div class="bottom">
				<div class="dot-wrapper">
					<span class="dot" :class="{'active': currentShow === 'cd'}"></span>
					<span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
				</div>
			    <!-- 歌曲进度条 -->
				<div class="progress-wrapper">
					<span class="time time-l">{{format(currentTime)}}</span>
					<div class="progress-bar-wrapper">
						<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
					</div>
					<span class="time time-r">{{format(currentSong.duration)}}</span>
				</div>
				<div class="operators">
					<div class="icon i-left" @click="changeMode">
						<i :class="iconMode"></i>
					</div>
					<div class="icon i-left" :class="disableCls">
						<i class="icon-prev" @click="prev"></i>
					</div>
					<div class="icon i-center" :class="disableCls">
						<i :class="playIcon" @click="togglePlaying"></i>
					</div>
					<div class="icon i-right" :class="disableCls">
						<i class="icon-next" @click="next"></i>
					</div>
					<div class="icon i-right">
						<i class="icon-not-favorite"></i>
					</div>
				</div>
			</div>
		</div>
	</transition>
	<!-- 最小化播放页面 在页面底部显示 -->
	<transition name="mini">
		<div class="mini-player" v-show="!fullScreen" @click="open">
			<div class="icon">
				<img :src="currentSong.image" width="40" height="40" :class="cdCls">
			</div>
			<div class="text">
				<h2 class="name" v-html="currentSong.name"></h2>
				<p class="desc" v-html="currentSong.singer"></p>
			</div>
			<div class="control">
			<!--给子元素传递 radius="32" 是一个固定值 所以前面不用加v-bind 加的时候表示传递的是变量-->
				<progress-circle :radius="32" :percent="percent">
					<i :class='miniIcon' class="icon-mini" @click.stop="togglePlaying"></i>
				</progress-circle>
			</div>
			<div class="control">
				<i class="icon-playlist"></i>
			</div>
		</div>
	</transition>
	<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
	</div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import progressBar from 'base/progress-bar/progress-bar.vue'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
	data() {
		return {
			// 歌曲准备就绪（从加载到播放）标志位 为了避免这个错误：DOMException: The play() request was interrupted by a new load request.
			songReady: false,
			currentTime: 0,
			radius: 32,
			// 当前歌曲的歌词
			currentLyric: null,
			// 当前歌词所在行
			currentLineNum: 0,
			// 歌曲播放页面是在cd页面还是歌词页面
			currentShow: 'cd',
			// 播放歌曲处于cd界面 显示当前正在播放的是哪句
			playingLyric: ''
		}
	},
	created() {
		this.touch = {}
	},
	computed: {
		playIcon() {
			return this.playing ? 'icon-pause' : 'icon-play'
		},
		miniIcon() {
			return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
		},
		// 播放模式 3种
		iconMode() {
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
		},
		cdCls() {
			return this.playing ? 'play' : 'play-pause'
		},
		disableCls() {
			return this.songReady ? '' : 'disable'
		},
		// 歌曲播放进度比例
		percent() {
			return this.currentTime / this.currentSong.duration
		},
		...mapGetters([
			'currentIndex',
			// 决定是否显示
			'fullScreen',
			// 播放列表
			'playList',
			'currentSong',
			'playing',
			'mode',
			'sequenceList'
		])
	},
	methods: {
		back() {
			this.setFullScreen(false)
		},
		open() {
			this.setFullScreen(true)
		},
		// 钩子函数
		enter(el, done) {
			const {x, y, scale} = this._getPosAndScale()
			let animation = {
				0: {
					transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
				},
				60: {
					transform: `translate3d(0, 0, 0) scale(1.1)`
				},
				100: {
					transform: `translate3d(0, 0, 0) scale(1)`
				}
			}
			animations.registerAnimation({
				name: 'move',
				animation,
				presets: {
					duration: 400,
					easing: 'linear'
				}
			})
			animations.runAnimation(this.$refs.cdWrapper, 'move', done)
			// done执行之后就会跳到afterEnter
		},
		afterEnter() {
			animations.unregisterAnimation('move')
			// 动画完成之后清除这些动画
			this.$refs.cdWrapper.style.animation = ''
		},
		leave(el, done) {
			// 定义leave时的动画
			this.$refs.cdWrapper.style.transition = 'all 0.4s'
			const {x, y, scale} = this._getPosAndScale()
			this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
			this.$refs.cdWrapper.addEventListener('transitionend', done)
		},
		afterLeave() {
			this.$refs.cdWrapper.style.transition = ''
			this.$refs.cdWrapper.style[transform] = ''
		},
		_getPosAndScale() {
			// 目标位置是全屏情况下图片的中心点
			const targetWidth = 40
			const paddingLeft = 40
			const paddingBottom = 30
			const paddingTop = 80
			const width = window.innerWidth * 0.8
			const scale = targetWidth / width
			const x = -(window.innerWidth / 2 - paddingLeft)
			const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
			return {
				x,
				y,
				scale
			}
		},
		togglePlaying() {
			// 歌曲没有ready时，不允许切换歌曲播放状态(暂停/播放)
			if (!this.songReady) {
				return
			}
			// 切换播放状态
			this.setPlayingState(!this.playing)
			// 相应的歌词播放状态也要随着切换
			if (this.currentLyric) {
				this.currentLyric.togglePlay()
			}
		},
		end() {
			if (this.mode === playMode.loop) {
				this.loop()
			} else {
				this.next()
			}
		},
		// 当mode为循环模式时
		loop() {
			this.$refs.audio.currentTime = 0
			this.$refs.audio.play()
			// 重新开始时，让歌词回到最开始位置
			if (this.currentLyric) {
				this.currentLyric.seek(0)
			}
		},
		next() {
			if (!this.songReady) {
				return
			}
			if (this.playList.length === 1) {
				this.loop()
			} else {
				let index = this.currentIndex + 1
				if (index === this.playList.length) {
					index = 0
				}
				this.setCurrentIndex(index)
				if (!this.playing) {
					this.togglePlaying()
				}
			}
			this.songReady = false
		},
		prev() {
			if (!this.songReady) {
				return
			}
			if (this.playList.length === 1) {
				this.loop()
			} else {
				let index = this.currentIndex - 1
				if (index === -1) {
					index = this.playList.length - 1
				}
				this.setCurrentIndex(index)
				if (!this.playing) {
					this.togglePlaying()
				}
			}
			this.songReady = false
		},
		ready() {
			// 保证不会因为切换太快出现异常
			this.songReady = true
		},
		// 歌曲加载失败时（无网络或下一首歌曲不存在）
		error() {
			this.songReady = true
		},
		updateTime(e) {
			// audio有一个currentTime属性 表示当前播放的时间
			this.currentTime = e.target.currentTime
		},
		// 时间格式
		format(interval) {
			// | 0或0操作符 相当于向下取整 相当于调用Math.floor()
			interval = interval | 0
			// 分
			const minute = interval / 60 | 0
			// 秒
			const second = this._pad(interval % 60)
			return `${minute}:${second}`
		},
		// 补位
		_pad(num, n = 2) {
			let len = num.toString().length
			if (len < n) {
				num = '0' + num
				len++
			}
			return num
		},
		onProgressBarChange(percent) {
			// 保存当前歌曲播放时间进度
			const currentTime = this.currentSong.duration * percent
			this.$refs.audio.currentTime = this.currentSong.duration * percent
			if (!this.playing) {
				this.togglePlaying()
			}
			// 当手动改变音乐播放进度的时候，使歌词进度也随之改变
			if (this.currentLyric) {
				this.currentLyric.seek(currentTime * 1000)
			}
		},
		changeMode() {
			// 改变播放模式
			const mode = (this.mode + 1) % 3
			this.setPlayMode(mode)
			let list = null
			if (mode === playMode.random) {
				list = shuffle(this.sequenceList)
			} else {
				// 当为顺序或循环播放模式时
				list = this.sequenceList
			}
			this.resetCurrentIndex(list)
			this.setPlayList(list)
		},
		/** 当切换播放模式的时候，为了避免歌曲切换模式时播放的歌曲发生改变 将正在播放歌曲的id设置为切换之后播放的
		当playList改变的时候，也让currentIndex改变 来保证currentSong的id不变**/
		resetCurrentIndex(list) {
			let index = list.findIndex((item) => {
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
		// 获取歌词
		getLyric() {
			this.currentSong.getLyric().then((lyric) => {
				this.currentLyric = new Lyric(lyric, this.handleLyric)
				// 如果歌曲正在播放，设置歌词随之相应'播放'
				if (this.playing) {
					// 使歌词‘播放’
					this.currentLyric.play()
				}
			}).catch(() => {
				// 获取歌词失败时
				this.currentLyric = null
				this.playingLyric = ''
				this.currentLineNum = 0
			})
		},
		handleLyric({lineNum, txt}) {
			this.currentLineNum = lineNum
			// 歌曲播放到歌词的第五行之后 使歌词向上滚动
			if (lineNum > 5) {
				let lineEl = this.$refs.lyricLine[lineNum - 5]
				this.$refs.lyricList.scrollToElement(lineEl, 1000)
			} else {
				// 否则 一直保持在顶部
				this.$refs.lyricList.scrollTo(0, 0, 1000)
			}
			// 当前歌曲的歌词 并使其显示在cd页面
			this.playingLyric = txt
		},
		middleTouchStart(e) {
			this.touch.initiated = true
			const touch = e.touches[0]
			this.touch.startX = touch.pageX
			this.touch.startY = touch.pageY
		},
		middleTouchMove(e) {
			if (!this.touch.initiated) {
				return
			}
			const touch = e.touches[0]
			const deltaX = touch.pageX - this.touch.startX
			const deltaY = touch.pageY - this.touch.startY
			// 如果是一个纵向滚动 就什么都不做
			if (Math.abs(deltaY) > Math.abs(deltaX)) {
				return
			}
			const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
			const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
			this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
			this.$refs.lyricList.$el.style[transitionDuration] = 0
			this.$refs.middleL.style.opacity = 1 - this.touch.percent
			this.$refs.middleL.style[transitionDuration] = 0
		},
		middleTouchEnd(e) {
			// 一个是从左向右，一个是从右向左
			let offsetWidth
			let opacity
			if (this.currentShow === 'cd') {
				if (this.touch.percent > 0.1) {
					offsetWidth = -window.innerWidth
					opacity = 0
					this.currentShow = 'lyric'
				} else {
					offsetWidth = 0
					opacity = 1
				}
			} else {
				if (this.touch.percent < 0.9) {
					offsetWidth = 0
					this.currentShow = 'cd'
					opacity = 1
				} else {
					offsetWidth = -window.innerWidth
					opacity = 0
				}
			}
			const time = 300
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
			this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
			this.$refs.middleL.style.opacity = opacity
			this.$refs.middleL.style[transitionDuration] = `${time}ms`
		},
		...mapMutations({
			setFullScreen: 'SET_FULL_SCREEN',
			setPlayingState: 'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayMode: 'SET_PLAY_MODE',
			setPlayList: 'SET_PLAYLIST'
		})
	},
	watch: {
		currentSong(newSong, oldSong) {
			if (newSong.id === oldSong.id) {
				return
			}
			// 在重新getLYric之前 要把当前的currentLyric停掉（stop）
			if (this.currentLyric) {
				this.currentLyric.stop()
				this.currentTime = 0
				this.playingLyric = ''
				this.currentLineNum = 0
			}
			clearTimeout(this.timer)
			this.timer = setTimeout(() => {
				this.$refs.audio.play()
				this.getLyric()
			}, 1000)
		},
		playing(newPlaying) {
			const audio = this.$refs.audio
			newPlaying ? audio.play() : audio.pause()
		}
	},
	components: {
		progressBar,
		ProgressCircle,
		Scroll
	}
}
	
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.player
	z-index: 100
	.normal-player
		width: 100%
		height: 100%
		position: fixed
		top: 0
		left: 0
		right: 0
		bottom: 0
		background: $color-background
		&.mini-enter-active, &.mini-leave-active
			transition: all .4s
			.top, .bottom
				transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
		&.mini-enter, &.mini-leave-to
			opacity: 0
			.top
				transition: translate3d(0, -100px, 0)
			.bottom
				transition: translate3d(0, 100px, 0)
		.background
			position: absolute
			left: 0
			top: 0
			width: 100%
			height: 100%
			z-index: -1
			opacity: 0.6
			filter: blur(20px)
		.top
			position: relative
			margin-bottom: 25px
			.back
				position: absolute
				top: 0
				left: 6px
				z-index: 50
				.icon-back
					display: block
					padding: 9px
					font-size: $font-size-large-x
					color: $color-theme
					transform: rotate(-90deg)
			.title
				width: 70%
				margin: 0 auto
				line-height: 40px
				text-align: center
				font-size: $font-size-large
				color: $color-text
			.subtitle
				line-height: 20px
				text-align: center
				font-size: $font-size-medium
				color: $color-text
		.middle
			position: fixed
			width: 100%
			top: 80px
			bottom: 170px
			white-space: nowrap
			font-size: 0
			.middle-l
				display: inline-block
				vertical-align: top
				position: relative
				width: 100%
				height: 0
				padding-top: 80%
				.cd-wrapper
					position: absolute
					left: 10%
					top: 0
					width: 80%
					height: 100%
					.cd
						width: 100%
						height: 100%
						box-sizing: border-box
						border: 10px solid rgba(255, 255, 255, 0.1)
						border-radius: 50%
						&.play
							animation: rotate 20s linear infinite
						&.pause
							animation-play-state: paused
						.image
							position: absolute
							left: 0
							top: 0
							width: 100%
							height: 100%
							border-radius: 50%
				.playing-lyric-wrapper
					width: 80%
					margin: 30px auto
					text-align: center
					.playing-lyric
						height: 20px
						line-height: 20px
						color: $color-text-l
						font-size: $font-size-medium
			.middle-r
				display: inline-block
				vertical-align: top
				width: 100%
				height: 100%
				overflow: hidden
				.lyric-wrapper
					width: 80%
					margin: 0 auto
					overflow: hidden
					text-align: center
					.text
						height: 30px
						line-height: 30px
						color: $color-text-l
						font-size: $font-size-medium
						&.current
							color: $color-text
		.bottom
			position: absolute
			bottom: 50px
			width: 100%
			.dot-wrapper
				position: relative
				width: 35px
				height: 30px
				margin: 0 auto
				.dot
					display: inline-block
					height: 10px
					width: 10px
					border-radius: 5px
					background: $color-text
					&.active
						width: 20px
			.progress-wrapper
				display: flex
				align-items: center
				width: 80%
				margin: 0 auto
				padding: 10px 0
				.time
					color: $color-text
					font-size: $font-size-small
					flex: 0 0 30px
					width: 30px
					line-height: 30px
					&.time-l
						text-align: left
					&.time-r
						text-align: right
				.progress-bar-wrapper
					flex: 1
			.operators
				display: flex
				align-items: center
				.icon
					flex: 1
					color: $color-theme
					i
						font-size: 30px
				.i-left
					text-align: right
				.i-center
					padding: 0 20px
					text-align: center
					i
						font-size: 40px
				.i-right
					text-align: left
				.icon-favorite
					color: $color-sub-theme
				.disable
					color: $color-theme-d
	.mini-player
		display: flex
		align-items: center
		width: 100%
		position: fixed
		bottom: 0
		left: 0
		right: 0
		height: 60px
		z-index:  180
		background: $color-highlight-background
		&.mini-enter-active, &.mini-leave-active
			transition: all .3s
		&.mini-enter, &.mini-leave-to
			opacity: 0
		.icon
			flex: 0 0 40px
			width: 40px
			padding: 10px 10px 0 20px
			img
				border-radius: 50%
		.text
			display: flex
			flex-direction: column
			justify-content: center
			flex: 1
			line-height: 20px
			overflow: hidden
			.name
				margin-bottom: 2px
				font-size: $font-size-medium
				color: $color-text
			.desc
				font-size: $font-size-small
				color: $color-text-d
		.control
			flex: 0 0 30px
			width: 30px
			padding: 0 10px
			align-items: center
			.icon-playlist, .icon-play-mini, .icon-pause-mini
				font-size: 30px
				color: $color-theme-d
			.icon-mini
				font-size: 32px
				position: absolute
				left: 0
				top: 0

@keyframes rotate
	0%
		transform: rotate(0)
	100%
		transform: rotate(360deg)

</style>
