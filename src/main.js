import Vue from 'vue'
import './plugins/bootstrap-vue'
import Vuetify from 'vuetify'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuetify)
new Vue({
  vuetify: new Vuetify(),
  render: h => h(App),
}).$mount('#app')
