import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/icon.css'
import VueQuillEditor from 'vue-quill-editor'
import ZkTable from 'vue-table-with-tree-grid'
// 导入 nprogress 包对应的JS和css
import NProgress from 'nprogress'

Vue.component('tree-table', ZkTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在 request 拦截器中，展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  NProgress.configure({ showSpinner: false })
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月份从 0 开始，所以+1 ,+ '' 是变成字符串
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}.`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
