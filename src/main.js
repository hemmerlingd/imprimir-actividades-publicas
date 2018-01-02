import Vue from 'vue'
import App from './App'
import {ServerTable} from 'vue-tables-2';
Vue.use(ServerTable);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
