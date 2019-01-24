<template>
  <select v-model="value" size="small" style="width:100px">
    <option disabled selected value>Please select one</option>
    <option
      v-for="item in audioList"
      :value="item.id"
      :key="item.id"
    >{{ item.content }} ({{item.name}})</option>
  </select>
</template>

<script>
import axios from "axios";
import config from "../../config/config.js";

export default {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  data() {
    return {
      backend: config.backend,
      audioList: [],
      value: ""
    };
  },
  watch: {
    value() {
      if (this.ikey) this.putData(this.ikey, this.value);
      this.emitter.trigger("process");
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
    axios({
      method: "get",
      url: backend + "/api/audios",
      withCredentials: true,
      crossDomain: true
    })
      .then(response => {
        console.log(response);
        this.audioList = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style>
</style>
