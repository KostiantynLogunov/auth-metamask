// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import { store } from './store/'
import BigNumber from "big-number"
import BigInt from "big-integer"
import Web3 from 'web3'


Vue.use(BigNumber, BigInt, Web3);

Vue.prototype.$http = Axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
