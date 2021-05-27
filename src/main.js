import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
import { MessageBox } from 'element-ui'
import { Message } from 'element-ui'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入NProgress进度条的js
import NProgress from 'nprogress'
// 导入NProgress进度条的css样式
import 'nprogress/nprogress.css'
// 网页粒子效果
import VueParticles from 'vue-particles'

// 使用屏幕自适应js
(function () {
  var rem = document.createElement("script");
  rem.src = "./rem.js";
  document.body.appendChild(rem);
})();
// 设置后台的请求根路径
axios.defaults.baseURL = "http://blog.losakali.top/public/index.php"
// http request拦截器 添加一个请求拦截器
// config 其实就是 res
// 使用laravel Sanctum 的时候 要设置axios.defaults.withCredentials = true; 才能实现请求时携带cookie操作
axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  config => {
    // 显示进度条 NProgress.start()
    NProgress.start();
    // config为请求对象
    // 判断sessionStorage中是否有token 如果有 把它放到请求头中带到后台
    // if (window.sessionStorage.getItem("token")) {
    //   // 在响应头中携带token
    //   config.headers['Authorization'] = 'Bearer ' + window.sessionStorage.getItem("token") // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // 请求预处理完后 需要return config请求对象
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
// axios.interceptors.response.use(res => {
//   const code = res.data.meta.status
//   // 状态码401说明token已过期
//   if (code !== 200) {
//     Message.error(res.data.meta.msg);
//     return res
//   }
//   // 没有问题 直接返回 res
//   Message.success(res.data.meta.msg);
//   return res
// })
axios.interceptors.response.use(config => {
  // 隐藏进度条 NProgress.done()
  NProgress.done();
  return config
});

// 把axios挂载到Vue的原型对象上 以$http命名
Vue.prototype.$http = axios
// 全局注册粒子效果
Vue.use(VueParticles)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 注册全局的时间过滤器
// originVal时间戳
// dateFormat 过滤器名称
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  // 年月日
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月份 因为是从0开始的 所以加1 转换成字符串 padStart 不足两位补0
  const d = (dt.getDate() + '').padStart(2, '0')
  // 时分秒
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // 返回处理过后的时间
  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
