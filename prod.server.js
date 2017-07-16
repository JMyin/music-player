var express = require('express')
var config = require('./config/index')
var axios = require('axios')
var app = express()
/* 定义了这样的一个路由getDiscList 它的作用是就是从真实的qq
// 服务器地址 通过axios去发送一个http请求，同时修改headers，修改咸亨qq相关的
// 然后把从浏览器端发送过来的参数原封不动的传给qq服务端
// qq服务端收到这个请求这行就可以正确的为我们响应，再然后我们把相应的内容
// 通过res.json传给浏览器端 **/
var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  // 为了绕过QQ的限制 利用axios将headers设置为QQ music的
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port
module.exports = app.listen(port, function(err) {
	if (err) {
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
})
