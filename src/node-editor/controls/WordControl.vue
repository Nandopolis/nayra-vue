<template>
  <word-select :initial="this.getData(this.ikey)" @options="onOptions"></word-select>
</template>

<script>
export default {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  data() {
    return {
      value: []
    };
  },
  methods: {
    onOptions(event) {
      this.value = event.detail[0];
      if (this.ikey) this.putData(this.ikey, this.value.join(' '));
      this.emitter.trigger("process");
    }
  }
};
</script>

<style>
</style>
