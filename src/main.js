import Vue from "vue";
import iView from "iview";
import VueRouter from "vue-router";
import Routers from "./router";
import Util from "./libs/util";
import App from "./app.vue";
import "iview/dist/styles/iview.css";
import Vuex from "vuex";
import store from "./store";

import vueCustomElement from "vue-custom-element";
import TextInput from "./custom-elements/TextInput.vue";
import TtsRadio from "./custom-elements/TtsRadio.vue";

Vue.use(VueRouter);
Vue.use(iView, { locale: "en-US" });
Vue.use(Vuex);
Vue.use(vueCustomElement);

Vue.customElement("audio-select", () => 
  import('./custom-elements/AudioSelect.vue')
  .then(component => {
    component.store = store;
    return component;
  })
);
Vue.customElement("input-text", TextInput);
Vue.customElement("tts-radio", TtsRadio);

const RouterConfig = {
  mode: "history",
  routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  Util.title(to.meta.title);
  next();
});

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

new Vue({
  el: "#app",
  store,
  router: router,
  render: h => h(App)
});
