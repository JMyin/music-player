webpackJsonp([4],{545:function(t,e,i){function n(t){i(580)}var s=i(8)(i(595),i(570),n,"data-v-11e4bbef",null);t.exports=s.exports},549:function(t,e,i){e=t.exports=i(539)(!0),e.push([t.i,".music-list[data-v-25690c2e]{position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;z-index:100;background:#222}.music-list .back[data-v-25690c2e]{position:absolute;top:5px;left:6px;width:30px;height:30px;z-index:50}.music-list .back .icon-back[data-v-25690c2e]{display:block;padding:10px;font-size:20px;color:#ffcd32}.music-list .title[data-v-25690c2e]{position:absolute;top:0;left:10%;z-index:40;width:80%;text-align:center;line-height:40px;font-size:18px;color:#fff}.music-list .bg-image[data-v-25690c2e]{position:relative;width:100%;height:0;padding-top:70%;transfrom-origin:top;background-size:cover}.music-list .bg-image .play-wrapper[data-v-25690c2e]{position:absolute;bottom:20px;left:50%;margin-left:-65px;color:#ffcd32}.music-list .bg-image .play-wrapper .play[data-v-25690c2e]{width:130px;height:25px;line-height:25px;text-align:center;padding:3px;border:1px solid #ffcd32;border-radius:10px}.music-list .bg-layer[data-v-25690c2e]{position:relative;height:100%;width:100%;background:#222}.music-list .list[data-v-25690c2e]{position:fixed;top:0;bottom:0;width:100%;background:#222}.music-list .list .song-list-wrapper[data-v-25690c2e]{padding:20px 30px}.music-list .list .loading-container[data-v-25690c2e]{position:absolute;width:100%;top:50%;transfrom:translate3d(-50%)}","",{version:3,sources:["D:/workspace/music-player/src/components/music-list/music-list.vue"],names:[],mappings:"AACA,6BACE,eAAgB,AAChB,MAAO,AACP,OAAQ,AACR,SAAU,AACV,QAAS,AACT,WAAY,AACZ,YAAa,AACb,YAAa,AACb,eAAiB,CAClB,AACD,mCACE,kBAAmB,AACnB,QAAS,AACT,SAAU,AACV,WAAY,AACZ,YAAa,AACb,UAAY,CACb,AACD,8CACE,cAAe,AACf,aAAc,AACd,eAAgB,AAChB,aAAe,CAChB,AACD,oCACE,kBAAmB,AACnB,MAAO,AACP,SAAU,AACV,WAAY,AACZ,UAAW,AACX,kBAAmB,AACnB,iBAAkB,AAClB,eAAgB,AAChB,UAAY,CACb,AACD,uCACE,kBAAmB,AACnB,WAAY,AACZ,SAAU,AACV,gBAAiB,AACjB,qBAAsB,AACtB,qBAAuB,CACxB,AACD,qDACE,kBAAmB,AACnB,YAAa,AACb,SAAU,AACV,kBAAmB,AACnB,aAAe,CAChB,AACD,2DACE,YAAa,AACb,YAAa,AACb,iBAAkB,AAClB,kBAAmB,AACnB,YAAa,AACb,yBAA0B,AAC1B,kBAAoB,CACrB,AACD,uCACE,kBAAmB,AACnB,YAAa,AACb,WAAY,AACZ,eAAiB,CAClB,AACD,mCACE,eAAgB,AAChB,MAAO,AACP,SAAU,AACV,WAAY,AACZ,eAAiB,CAClB,AACD,sDACE,iBAAmB,CACpB,AACD,sDACE,kBAAmB,AACnB,WAAY,AACZ,QAAS,AACT,2BAA6B,CAC9B",file:"music-list.vue",sourcesContent:["\n.music-list[data-v-25690c2e] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 100;\n  background: #222;\n}\n.music-list .back[data-v-25690c2e] {\n  position: absolute;\n  top: 5px;\n  left: 6px;\n  width: 30px;\n  height: 30px;\n  z-index: 50;\n}\n.music-list .back .icon-back[data-v-25690c2e] {\n  display: block;\n  padding: 10px;\n  font-size: 20px;\n  color: #ffcd32;\n}\n.music-list .title[data-v-25690c2e] {\n  position: absolute;\n  top: 0;\n  left: 10%;\n  z-index: 40;\n  width: 80%;\n  text-align: center;\n  line-height: 40px;\n  font-size: 18px;\n  color: #fff;\n}\n.music-list .bg-image[data-v-25690c2e] {\n  position: relative;\n  width: 100%;\n  height: 0;\n  padding-top: 70%;\n  transfrom-origin: top;\n  background-size: cover;\n}\n.music-list .bg-image .play-wrapper[data-v-25690c2e] {\n  position: absolute;\n  bottom: 20px;\n  left: 50%;\n  margin-left: -65px;\n  color: #ffcd32;\n}\n.music-list .bg-image .play-wrapper .play[data-v-25690c2e] {\n  width: 130px;\n  height: 25px;\n  line-height: 25px;\n  text-align: center;\n  padding: 3px;\n  border: 1px solid #ffcd32;\n  border-radius: 10px;\n}\n.music-list .bg-layer[data-v-25690c2e] {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  background: #222;\n}\n.music-list .list[data-v-25690c2e] {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  width: 100%;\n  background: #222;\n}\n.music-list .list .song-list-wrapper[data-v-25690c2e] {\n  padding: 20px 30px;\n}\n.music-list .list .loading-container[data-v-25690c2e] {\n  position: absolute;\n  width: 100%;\n  top: 50%;\n  transfrom: translate3d(-50%);\n}"],sourceRoot:""}])},550:function(t,e,i){function n(t){i(552)}var s=i(8)(i(553),i(551),n,"data-v-25690c2e",null);t.exports=s.exports},551:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"music-list"},[i("div",{staticClass:"back",on:{click:t.back}},[i("i",{staticClass:"icon-back"})]),t._v(" "),i("h1",{staticClass:"title"},[t._v(t._s(t.title))]),t._v(" "),i("div",{ref:"bgImage",staticClass:"bg-image",style:t.bgStyle},[i("div",{staticClass:"play-wrapper"},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.songs.length>0,expression:"songs.length>0"}],ref:"playBtn",staticClass:"play",on:{click:t.random}},[i("i",{staticClass:"icon-play"}),t._v(" "),i("span",{staticClass:"text"},[t._v("随机播放全部")])])]),t._v(" "),i("div",{ref:"filter",staticClass:"filter"})]),t._v(" "),i("div",{ref:"layer",staticClass:"bg-layer"}),t._v(" "),i("scroll",{ref:"list",staticClass:"list",attrs:{data:t.songs,"probe-type":t.probeType,"listen-scroll":t.listenScroll},on:{scroll:t.scroll}},[i("div",{staticClass:"song-list-wrapper"},[i("song-list",{attrs:{songs:t.songs,rank:t.rank},on:{select:t.selectItem}})],1),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.songs.length,expression:"!songs.length"}],staticClass:"loading-container"},[i("loading")],1)])],1)},staticRenderFns:[]}},552:function(t,e,i){var n=i(549);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i(540)("1e104224",n,!0)},553:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(54),s=i.n(n),a=i(63),o=i.n(a),l=i(187),A=i.n(l),r=i(185),c=i.n(r),d=i(122),p=i(45),g=i(81),u=i.i(d.a)("transform"),f=i.i(d.a)("backdrop-filter");e.default={mixins:[g.c],props:{bgImage:{type:String,default:""},songs:{type:Array,default:[]},title:{type:String,default:""},rank:{type:Boolean,default:!1}},data:function(){return{scrollY:0}},created:function(){this.probeType=3,this.listenScroll=!0},computed:{bgStyle:function(){return"background-image: url("+this.bgImage+")"}},mounted:function(){this.imageHeight=this.$refs.bgImage.clientHeight,this.minTranslateY=40-this.imageHeight,this.$refs.list.$el.style.top=this.imageHeight+"px"},methods:s()({scroll:function(t){this.scrollY=t.y},back:function(){this.$router.back()},selectItem:function(t,e){this.selectPlay({list:this.songs,index:e})},random:function(){this.randomPlay({list:this.songs})},handlePlayList:function(t){var e=t.length>0?"60px":"";this.$refs.list.$el.style.bottom=e,this.$refs.list.refresh()}},i.i(p.c)(["selectPlay","randomPlay"])),watch:{scrollY:function(t){var e=Math.max(this.minTranslateY,t),i=0,n=1,s=0;this.$refs.layer.style[u]="translate3d(0, "+e+"px, 0)";var a=Math.abs(t/this.imageHeight);t>0?(n=1+a,i=10):s=Math.min(20*a,20),this.$refs.filter.style[f]="blur("+s+"px)",t<this.minTranslateY?(i=10,this.$refs.bgImage.style.paddingTop=0,this.$refs.bgImage.style.height="40px",this.$refs.playBtn.style.display="none"):(this.$refs.bgImage.style.paddingTop="70%",this.$refs.bgImage.style.height=0,this.$refs.playBtn.style.display=""),this.$refs.bgImage.style.zIndex=i,this.$refs.bgImage.style[u]="scale("+n+")"}},components:{Scroll:o.a,SongList:A.a,Loading:c.a}}},556:function(t,e,i){"use strict";function n(){var t=o()({},A.b,{channel:"singer",page:"list",key:"all_all_all",pagesize:100,pagenum:1,hostUin:0,platform:"yqq",needNewCode:0,g_tk:5381});return i.i(l.a)("https://c.y.qq.com/v8/fcg-bin/v8.fcg",t,A.c)}function s(t){var e=o()({},A.b,{order:"listen",begin:0,num:80,singermid:t,platform:"yqq",needNewCode:0,hostUin:0,songstatus:1});return i.i(l.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg",e,A.c)}e.b=n,e.a=s;var a=i(82),o=i.n(a),l=i(186),A=i(62)},558:function(t,e,i){e=t.exports=i(539)(!0),e.push([t.i,".slide-enter-active[data-v-11e4bbef],.slide-leave-active[data-v-11e4bbef]{transition:all 1.3s}.silde-enter[data-v-11e4bbef],.slide-leave-to[data-v-11e4bbef]{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}","",{version:3,sources:["D:/workspace/music-player/src/components/singer-detail/singer-detail.vue"],names:[],mappings:"AACA,0EAEE,mBAAqB,CACtB,AACD,+DAEE,wCAA2C,AACnC,+BAAmC,CAC5C",file:"singer-detail.vue",sourcesContent:["\n.slide-enter-active[data-v-11e4bbef],\n.slide-leave-active[data-v-11e4bbef] {\n  transition: all 1.3s;\n}\n.silde-enter[data-v-11e4bbef],\n.slide-leave-to[data-v-11e4bbef] {\n  -webkit-transform: translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0);\n}"],sourceRoot:""}])},570:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("transition",{attrs:{name:"slide"}},[i("music-list",{attrs:{songs:t.songs,title:t.title,"bg-image":t.bgImage}})],1)},staticRenderFns:[]}},580:function(t,e,i){var n=i(558);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i(540)("3833fea2",n,!0)},595:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(54),s=i.n(n),a=i(45),o=i(556),l=i(62),A=i(123),r=i(550),c=i.n(r);e.default={data:function(){return{songs:[]}},created:function(){this._getDetail()},computed:s()({title:function(){return this.singer.name},bgImage:function(){return this.singer.avatar}},i.i(a.a)(["singer"])),methods:{_getDetail:function(){var t=this;if(!this.singer.id)return console.log(this.singer),void this.$router.push("./singer");i.i(o.a)(this.singer.id).then(function(e){e.code===l.a&&(t.songs=t._normallizeSongs(e.data.list))})},_normallizeSongs:function(t){var e=[];return t.forEach(function(t){var n=t.musicData;n.songid&&n.albummid&&e.push(i.i(A.b)(n))}),e}},components:{musicList:c.a}}}});
//# sourceMappingURL=4.6cc0d8166a71f5821dc3.js.map