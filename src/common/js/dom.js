export default function addClass(el, className) {
	// 如果已有此类名，就跳过
	if (hasClass(el, className)) {
		return
	}

	// 如果没有此类名， 就向其中加入
	let newclass = el.className.split(' ')
	newclass.push(className)
	el.className = newclass.join(' ')
}

export function hasClass(el, className) {
	// 以className开头或者空白字符在className前面
	let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
	return reg.test(el.className)
}

// 获取/设置 DOM元素的属性值
export function getData(el, name, val) {
	const prefix = 'data-'
	// 如果有这个值， 就获取这个值 没有就设置一下这个值
	if (val) {
		return el.setAttribute(prefix + name, val)
	} else {
		return el.getAttribute(prefix + name)
	}
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
	let transformNames = {
		webkit: 'webkitTransform',
		o: 'OTransform',
		Moz: 'MozTransform',
		ms: 'msTransform',
		standard: 'transform'
	}
	for (let key in transformNames) {
		// 根据transformNames[key]是否在elementStyle里就可以知道是那个供应商
		if (elementStyle[transformNames[key]] !== undefined) {
			return key
		}
	}
	return false
})()

export function prefixStyle(style) {
	if (vendor === false) {
		return false
	}
	if (vendor === 'standard') {
		return style
	}
	return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
