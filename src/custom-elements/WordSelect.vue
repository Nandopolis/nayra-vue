<template>
  <Select
    v-model="value" ref="select"
    :transfer="true" multiple
    remote :remote-method="remoteWords"
    filterable :loading="loading"
    loading-text="searching..."
    not-found-text="there is nothing to show..."
    placeholder="construct your sentence">
    <Option v-for="(option, index) in options" :value="option" :key="index">{{option}}</Option>
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
  mounted() {
    if (undefined !== this.initial) {
      var value = this.initial.split(' ');
      this.options = value;
      this.value = value;
    }
  },
  methods: {
    remoteWords (query) {
      if (query !== '') {
        this.loading = true;
        axios({
          method: "get",
          url: config.backend + "/api/words/" + query,
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
