// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Message from 'vue-m-message'
import axiosHttp from '@/utils/axiosHttp'
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$http = axiosHttp // 在Vue的原型上添加$axios

Vue.use(Message, {name: 'msg'})

Vue.use(require('vue-moment'))
Vue.prototype.moment = moment

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
})
