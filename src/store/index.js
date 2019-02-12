import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import config from "../config/config.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    diagram: {},
    audios: [
      { id: 1, name: "audio1", content: "audio 1" },
      { id: 2, name: "audio2", content: "audio 2" },
      { id: 3, name: "audio3", content: "audio 3" },
      { id: 4, name: "audio4", content: "audio 4" },
      { id: 5, name: "audio5", content: "audio 5" },
      { id: 6, name: "audio6", content: "audio 6" }
    ]
  },
  actions: {
    loadAudios({commit}) {
      axios({
        method: "get",
        url: config.backend + "/api/audios",
        withCredentials: true,
        crossDomain: true
      })
        .then(audios => {
          console.log(audios);
          commit('setAudios', audios);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mutations: {
    setDiagram(state, diagram) {
      state.diagram = diagram;
    },
    setAudios(state, audios) {
      state.audios = audios;
    }
  }
});
