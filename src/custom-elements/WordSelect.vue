<template>
  <Select
    v-model="value"
    :transfer="true"
    multiple
    filterable
    placeholder="construct your sentence">
    <Option v-for="(option, index) in options_full" :value="option" :key="index">{{option}}</Option>
  </Select>
</template>

<script>
import axios from "axios";
import config from "../config/config.js";

export default {
  props: ['initial'],
  data() {
    return {
      value: [],
      loading: false,
      options: [],
    };
  },
  watch: {
    value() {
      this.$emit('options', this.value)
    }
  },
  computed: {
    options_full() {
      return this.$store.state.words;
    }
  },
  created() {
    if (undefined !== this.initial) {
      this.value = this.initial.split(' ');
    }
  },
  methods: {
    remoteWords (query) {
      if (query !== '') {
        this.loading = true;
        axios({
          method: "get",
          url: config.backend + "/api/words/" + query,
          withCredentials: true,
          crossDomain: true
        })
          .then(words => {
            this.loading = false;
            this.options = words.data;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.options = [];
      }
    }
  }
};
</script>

<style>
</style>
