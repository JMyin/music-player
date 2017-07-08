<template>
	<transition name="slide">
		<music-list class="icon"></music-list>
	</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
export default {
	components: {
		MusicList
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.slide-enter-active, .slide-leave-active
	transition: all .3s
.slide-enter, .slide-leave
	transition: translate3d(100%, 0, 0)

</style>
