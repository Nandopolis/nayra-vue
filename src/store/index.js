import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import config from "../config/config.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    diagram: '{"id":"demo@0.1.0","nodes":{}}',
    programs: [],
    audios: [],
    audio_categories: [],
    actions: [],
    words: []
  },
  getters: {
    program: state => id => {
      return state.programs.find(item => {
        return item.id === id;
      })
    },
    formated_audios: state => {
      var audios = [];
      state.audios.map((audio) => {
        var group_value = audios.findIndex(item => item.value === audio.category_id);
        if (-1 !== group_value) {
          audios[group_value].children.push({value: audio.id, label: audio.name, content: audio.content});
        } else {
          var category = state.audio_categories.find(item => item.id === audio.category_id);
          audios.push({
            value: category.id, label: category.name,
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
    loadPrograms({commit}) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: config.backend + "/api/programs",
        })
        .then(programs => {
          commit('setPrograms', programs.data);
          resolve(programs);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
      });
    },
    loadAudios({commit}) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: config.backend + "/api/audios",
        })
        .then(audios => {
          commit('setAudios', audios.data);
          resolve(audios);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
      });
    },
    loadAudioCategories({commit}) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: config.backend + "/api/audios/categories",
        })
        .then(audio_categories => {
          commit('setAudioCategories', audio_categories.data);
          resolve(audio_categories);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
      });
    },
    loadActions({commit}) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: config.backend + "/api/actions",
        })
        .then(actions => {
          commit('setActions', actions.data);
          resolve(actions);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
      });
    },
    loadWords({commit}) {
      axios({
        method: "get",
        url: config.backend + "/api/words",
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
    setPrograms(state, programs) {
      state.programs = programs;
    },
    addProgram(state, program) {
      state.programs.push(program);
    },
    updateProgram(state, program) {
      state.programs = [
        ...state.programs.filter(item => item.id !== program.id),
        program
      ];
    },
    delProgram(state, program_id) {
      state.programs = [...state.programs.filter(program => program.id !== program_id)];
    },
    setAudios(state, audios) {
      state.audios = audios;
    },
    addAudio(state, audio) {
      state.audios.push(audio);
    },
    updateAudio(state, audio) {
      state.audios = [
        ...state.audios.filter(item => item.id !== audio.id),
        audio
      ];
    },
    delAudio(state, audio_id) {
      state.audios = [...state.audios.filter(audio => audio.id !== audio_id)];
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
