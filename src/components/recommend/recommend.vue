<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
    <div>
    	<div v-if="recommends.length" class="slider-wrapper">
    		<slider>
    			<div v-for="item in recommends">
    				<a :href="item.linkUrl">
    					<img @load="loadImage()" :src="item.picUrl" />
    				</a>
    			</div>
    		</slider>
    	</div>
    	<div class="recommend-list">
    		<h1 class="list-title">热门歌单推荐</h1>
    		<ul>
    			<li v-for="item in discList" class="item">
    				<div class="icon">
    					<img v-lazy="item.imgurl" width="60" height="60" >
    				</div>
    				<div class="text">
    					<h2 class="name" v-html="item.creator.name"></h2>
    					<p class="desc" v-html="item.dissname"></p>
    				</div>
    			</li>
    		</ul>
    	</div>
    </div>
    <div class="loading-container" v-show="!discList.length">
    	<loading ></loading>
    </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import {getRecommend, getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config'
import {playListMixin} from 'common/js/mixin'
export default {
	mixins: [playListMixin],
	data() {
		return {
			recommends: [],
			discList: [],
			checkLoaded: false
		}
	},
	created() {
		this._getRecommend()
		this._getDiscList()
	},
	methods: {
		handlePlayList(playList) {
			const bottom = playList.length > 0 ? '60px' : ''
			// 设置最外层元素的bottom
			this.$refs.recommend.style.bottom = bottom
			// 调用scroll组件的refresh方法
			this.$refs.scroll.refresh()
		},
		_getRecommend() {
			getRecommend().then((res) => {
				if (res.code === ERR_OK) {
					this.recommends = res.data.slider
				}
			})
		},
		_getDiscList() {
			getDiscList().then((res) => {
				if (res.code === ERR_OK) {
					this.discList = res.data.list
				}
			})
		},
		// 监听图片是否已加载，如果已加载，就调用scroll的refresh方法，
		// 避免图片未加载前，歌单列表已加载完成，
		// 此时会造成scroll的滚动高度不包含上方图片的高度，向下滚动时最下方的大概图片过度的数据看不到
		loadImage() {
			if (!this.checkLoaded) {
				this.$refs.scroll.refresh()
				this.checkLoaded = true
			}
		}
	},
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable.styl'
.recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
			.recommend-list
				width: 100%
				.list-title
					height: 60px
					line-height: 60px
					text-align: center
					color: $color-theme
				ul
					.item
						display: flex
						box-sizing: border-box
						/*  左边和右边是保持垂直方向是居中的*/
						align-items: center
						padding: 0 20px 20px
						.icon				
							flex: 0 0 60px
							width: 60px
							padding-right: 20px
						.text
							display: flex
							/* 纵向排列 */
							flex-direction: column
							justify-content: center
							flex: 1
							line-height: 20px
							overflow: hidden
							font-size: $font-size-medium
							.name
								margin-bottom: 10px
								padding-top: 3px
								color: $color-text
							.desc
								color: $color-text-d
    .loading-container
    	position: absolute
    	width: 100%
    	top: 50%
    	transform: translateY(-50%)



</style>
