<template>
  <audio-select @select="onSelect"></audio-select>
</template>

<script>
export default {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  data() {
    return {
      value: ""
    };
  },
  methods: {
    onSelect(event) {
      this.value = event.detail[0];
      if (this.ikey) this.putData(this.ikey, this.value);
      this.emitter.trigger("process");
    }
  }
};
</script>

<style>
</style>
