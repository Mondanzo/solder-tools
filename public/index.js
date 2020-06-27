import Vue from "vue";
import App from "./App.vue";

import vmodal from "vue-js-modal";
import vSelect from "vue-select";
import VueToastify from "vue-toastify";

import "vue-select/dist/vue-select.css";

Vue.use(VueToastify);
Vue.use(vmodal, { dynamic: true });
Vue.component("v-select", vSelect);

new Vue({ render: (createElement) => createElement(App) }).$mount("#app");
