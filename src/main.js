import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import { errorHandler } from '@/utils'
import '@/plugins/moment'
import '@/plugins/vuelidate'

Vue.config.productionTip = false
Vue.config.errorHandler = errorHandler

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
