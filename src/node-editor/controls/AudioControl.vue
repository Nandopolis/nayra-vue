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

export default {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  data() {
    return {
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
      url: "http://192.168.1.7:5000/api/audios",
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
