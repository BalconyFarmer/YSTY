import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import axios from 'axios';
import Vuex from 'vuex'
import cookies from 'vue-cookies'
import VuexPersistence from "vuex-persist";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(Vuex)
Vue.prototype.$axios = axios
Vue.use(cookies)
Vue.use(ElementUI);

// 先创建一个对象并进行配置
const vuexPersist = new VuexPersistence({
    strictMode: true,
    storage: window.localStorage, // 存入localStorage
    reducer: state => ({
        count: state.count,       // 这个就是存入localStorage的值
        userInf: state.userInf,
    })
});

const store = new Vuex.Store({
    state: {
        count: 0,
        userInf: {},
    },
    mutations: {},
    getters: {},

    plugins: [vuexPersist.plugin]
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    cookies,
    components: {App},
    template: '<App/>'
})

