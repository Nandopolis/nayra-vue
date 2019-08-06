import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import config from "../config/config.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    diagram: '{"id":"demo@0.1.0","nodes":{}}',
    audios: [],
    audio_categories: [],
    actions: [],
    words: []
  },
  getters: {
    formated_audios: state => {
      var audios = [];
      state.audios.map((audio) => {
        var group_value = audios.findIndex(item => item.category_id === audio.category_id);
        if (-1 !== group_value) {
          audios[group_value].children.push({value: audio.id, label: audio.name, content: audio.content});
        } else {
          var category = state.audio_categories.find(item => item.id === audio.category_id);
          audios.push({
            value: category.name, label: category.name, category_id: category.id,
            children: [{ value: audio.id, label: audio.name, content: audio.content }]
          });
        }
      });
      return audios;
    },
    audio: state => id => {
      return state.audios.find(item => {
        return item.id === id;
      })
    },
    is_category_empty: state => category_id => {
      return state.audios.findIndex(item => item.category_id === category_id) === -1;
    },
    audio_category: state => id => {
      return state.audio_categories.find(item => {
        return item.id === id;
      })
    },
    formated_actions: state => {
      var actions = [];
      state.actions.map((action) => {
        if ('action' === action.category) {
          actions.push({ value: action.id, label: action.action });
        } else {
          var group_value = actions.findIndex(item => {
            return (item.label === action.category && item.children);
          })
          if (-1 !== group_value) {
            actions[group_value].children.push({ value: action.id, label: action.action });
          } else {
            actions.push({
              value: action.category, label: action.category,
              children: [{ value: action.id, label: action.action }]
            });
          }
        }
      });
      return actions;
    },
    action: state => id => {
      return state.actions.find(item => {
        return item.id === id;
      })
    },
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
          commit('setAudios', audios.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadAudioCategories({commit}) {
      axios({
        method: "get",
        url: config.backend + "/api/audios/categories",
        withCredentials: true,
        crossDomain: true
      })
        .then(audio_categories => {
          commit('setAudioCategories', audio_categories.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadActions({commit}) {
      axios({
        method: "get",
        url: config.backend + "/api/actions",
        withCredentials: true,
        crossDomain: true
      })
        .then(actions => {
          commit('setActions', actions.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadWords({commit}) {
      axios({
        method: "get",
        url: config.backend + "/api/words",
        withCredentials: true,
        crossDomain: true
      })
        .then(words => {
          commit('setWords', words.data);
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
    },
    addAudio(state, audio) {
      state.audios.push(audio);
    },
    delAudio(state, audio_id) {
      var new_audios = state.audios.filter(audio => audio.id !== audio_id);
      state.audios = new_audios;
    },
    setAudioCategories(state, audio_categories) {
      state.audio_categories = audio_categories;
    },
    addAudioCategory(state, audio_category) {
      state.audio_categories.push(audio_category);
    },
    updateAudioCategory(state, audio_category) {
      state.audio_categories = [
        ...state.audio_categories.filter(item => item.id !== audio_category.id),
        audio_category
      ];
    },
    delAudioCategory(state, audio_category_id) {
      state.audio_categories = [...state.audio_categories.filter(audio_category => audio_category.id !== audio_category_id)];
    },
    setActions(state, actions) {
      state.actions = actions;
    },
    setWords(state, words) {
      state.words = words;
    }
  }
});
