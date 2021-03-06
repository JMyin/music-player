import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
	constructor({id, mid, singer, name, album, duration, image, url}) {
		this.id = id
		this.mid = mid
		this.singer = singer
		this.name = name
		this.album = album
		this.duration = duration
		this.image = image
		this.url = url
	}
	getLyric() {
		if (this.lyric) {
			return Promise.resolve(this.lyric)
		}
		return new Promise((resolve, reject) => {
			// 获取歌词 然后返回出去
			getLyric(this.mid).then((res) => {
				if (res.retcode === ERR_OK) {
					this.lyric = Base64.decode(res.lyric)
					resolve(this.lyric)
				} else {
					reject('no lyric')
				}
			})
		})
	}
}
// 将得到的数据转换成song的一个实例
export function createSong(musicData) {
	return new Song({
		id: musicData.songid,
		mid: musicData.songmid,
		singer: filterSinger(musicData.singer),
		name: musicData.songname,
		album: musicData.albumname,
		duration: musicData.interval,
		image: `http://y.gtimg.cn/music/photo_new/T002R150x150M000${musicData.albummid}.jpg?max_age=2592000`,
		url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
	})
}
// singer是一个数组 而需要的是一个字符串
export function filterSinger(singer) {
	let ret = []
	if (!singer) {
		return ''
	}
	singer.forEach((s) => {
		ret.push(s.name)
	})
	return ret.join('/')
}
