import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSnackbar from "vue-snack";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import ButtonSpinner from "@/components/globals/ButtonSpinner";
import i18n from './i18n'
import VueTelInput from 'vue-tel-input'

UIkit.use(Icons);
window.UIkit = UIkit;

// loads the Icon plugin
window._ = require("lodash");

require("./styles/index.scss");
require("vue-snack/dist/vue-snack.min.css");

Vue.config.productionTip = false;

window.Event = new Vue();

Vue.use(VueSnackbar, {});

Vue.use(VueTelInput)

Vue.component("button-spinner", ButtonSpinner);
Vue.component('pagination', require('laravel-vue-pagination'));


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
