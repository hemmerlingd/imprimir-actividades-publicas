import Vue from 'vue'
import App from './App'
import {ServerTable} from 'vue-tables-2';

require('bootstrap/dist/css/bootstrap.min.css');

Vue.use(ServerTable);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
