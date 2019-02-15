import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import config from "../config/config.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    diagram: {},
    audios: []
  },
  getters: {
    formated_audios: state => {
      var audios = [];
      state.audios.reduce((last_audio, audio) => {
        if ('audio' === audio.category) {
          audios.push({ value: audio.id, label: audio.name, content: audio.content });
        } else {
          var group_value = audios.findIndex(item => {
            return (item.label === audio.category && item.children);
          })
          if (-1 !== group_value) {
            audios[group_value].children.push({ value: audio.id, label: audio.name, content: audio.content });
          } else {
            audios.push({
              value: audio.category, label: audio.category,
              children: [{ value: audio.id, label: audio.name, content: audio.content }]
            });
          }
        }
      });
      return audios;
    }
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
