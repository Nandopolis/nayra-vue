<template>
  <input-text :initial="this.getData('text')" @input="onInput"></input-text>
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
    onInput(event) {
      this.value = event.detail[0];
      if (this.ikey) this.putData(this.ikey, this.value);
      this.emitter.trigger("process");
    }
  }
};
</script>

<style>
</style>
