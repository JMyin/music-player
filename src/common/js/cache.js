/*
* @Author: JMyin
* @Date:   2017-07-11 10:58:49
* @Last Modified by:   JMyin
* @Last Modified time: 2017-07-13 22:12:09
*/
import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 存储搜索值
export function saveSearch(query) {
	// 首先获取当前的存储情况，如果没有 就设置为一个空数组
	let searches = storage.get(SEARCH_KEY, [])
	inserArray(searches, query, (item) => {
		return item === query
	}, SEARCH_MAX_LENGTH)
	storage.set(SEARCH_KEY, searches)
	return searches
}

function inserArray(arr, val, compare, maxLen) {
	const index = arr.findIndex(compare)
	// 如果所有为0 表示数组中已经有这条数据 并且是第一个 那就什么都不用做
	if (index === 0) {
		return
	}
	// 如果要插入的值在数组中 但是不是第一个 就要先将其删除 然后再插入到数组的第一个位置
	if (index > 0) {
		arr.splice(index, 1)
	}
	arr.unshift(val)
	if (maxLen && arr.length > maxLen) {
		// 如果数组的长度超过最大值，将最后一个数组元素pop出来
		arr.pop()
	}
}

export function loadSearch() {
	return storage.get(SEARCH_KEY, [])
}

// 从数组中删除一个元素 compare是一个比较函数 返回TRUE的时候，就删除
function deleteFromArray(arr, compare) {
	const index = arr.findIndex(compare)
	if (index > -1) {
		arr.splice(index, 1)
	}
}
// 将query从数组中删除 并且返回一个新的数组
export function deleteSearch(query) {
	// 获取缓存中的搜索记录列表，没有的话就设置为一个空数组
	let searches = storage.get(SEARCH_KEY, [])
	deleteFromArray(searches, (item) => {
		return item === query
	})
	// 上面删除数组之后要再次保存数组
	storage.set(SEARCH_KEY, searches)
	return searches
}
// 清空搜索历史
export function clearSearch() {
	storage.remove(SEARCH_KEY)
	return []
}
