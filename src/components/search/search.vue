<template>
  <div class="search">
    <div class="search-box-wrapper">
    	<search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
    	<scroll class="shortcut" :data="shortcut" ref="shortcut">
	    	<div>
	    		<div class="hot-key">
	    			<h1 class="title">热门搜索</h1>
	    			<ul>
	    				<li v-for="item in hotKey" @click="addQuery(item.k)" class="item">
	    					<span>{{item.k}}</span>
	    				</li>
	    			</ul>
	    		</div>
	    		<div class="search-history" v-show="searchHistory.length">
	    		<h1 class="title">
		    		<span class="text">搜索历史</span>
		    		<span class="clear" @click="showConfirm">
		    			<i class="icon-clear"></i>
		    		</span>
	    		</h1>
	    		<search-list @select="addQuery" @delete="deleteOne" :searches="searchHistory"></search-list>
	    		</div>
	    	</div>
    	</scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
    	<suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm @confirm="deleteAll" text="确定要清空搜索历史吗？" confirmBtnText="清空" ref="confirm"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript">
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {mapActions, mapGetters} from 'vuex'
import {playListMixin} from 'common/js/mixin'
export default {
	mixins: [playListMixin],
	data() {
		return {
			hotKey: [],
			query: ''
		}
	},
	created() {
		this._getHotKey()
	},
	computed: {
		shortcut() {
			return this.hotKey.concat(this.searchHistory)
		},
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		_getHotKey() {
			getHotKey().then((res) => {
				if (res.code === ERR_OK) {
					this.hotKey = res.data.hotkey.slice(0, 10)
				}
			})
		},
		addQuery(query) {
			this.$refs.searchBox.setQuery(query)
		},
		onQueryChange(query) {
			this.query = query
		},
		//  使输入框失去焦点->手机上的键盘可以消失
		blurInput() {
			// this.$refs.searcBox.blur()
		},
		saveSearch() {
			this.saveSearchHistory(this.query)
		},
		// 点击删除某一项搜索历史
		deleteOne(item) {
			this.deleteSearchHistory(item)
		},
		// 删除所有搜索历史缓存
		deleteAll() {
			this.clearSearchHistory()
		},
		showConfirm() {
			this.$refs.confirm.show()
		},
		handlePlayList(playList) {
			const bottom = playList.length > 0 ? '60px' : ''
			this.$refs.shortcutWrapper.style.bottom = bottom
			this.$refs.shortcut.refresh()
			this.$refs.searchResult.style.bottom = bottom
			this.$refs.suggest.refresh()
		},
		...mapActions([
			'saveSearchHistory',
			'deleteSearchHistory',
			'clearSearchHistory'
		])
	},
	watch: {
		query(newQuery) {
			if (!newQuery) {
				setTimeout(() => {
					this.$refs.shortcut.refresh()
				},20)
			}
		}
	},
  components: {
   	SearchBox,
   	Suggest,
   	SearchList,
   	Confirm,
   	Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.search
	.search-box-wrapper
		margin: 20px
	.shortcut-wrapper
		position: fixed
		top: 178px
		bottom: 0
		width: 100%
		.shortcut
			height: 100%
			overflow: hidden
			.hot-key
				margin: 0 20px 20px
				.title
					margin-bottom: 20px
					font-size: $font-size-medium
					color: $color-text-l
				.item
					display: inline-block
					padding: 5px 10px
					margin: 0 20px 10px 0
					border-radius: 6px
					background: $color-highlight-background
					font-size: $font-size-medium
					color: $color-text-d
			.search-history
				position: relative
				margin: 0 20px
				.title
					display: flex
					align-items: center
					height: 40px
					font-size: $font-size-medium
					color: $color-text-l
					.text
						flex: 1
					.clear
						extend-click()
						.icon-clear
							font-size: $font-size-medium
							color: $color-text-d
	.search-result
		position: fixed
		width: 100%
		top: 178px
		bottom: 0


</style>
