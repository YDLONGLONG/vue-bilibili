import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './assets/style/base.css'
//element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入字体图标库
import './assets/iconfont/iconfont.css'
// 过滤器
import './utils/filter'
//滑动验证
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);
//右键菜单
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);
let BASE_URL = 'http://localhost:3000'
Vue.prototype.$apiServer = BASE_URL
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
