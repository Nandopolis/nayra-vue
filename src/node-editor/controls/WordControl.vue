<template>
  <div class="grid-container">
    <div class="item">
      <span class="checkbox-text">{{this.ikey}}:</span>
    </div>
    <div class="item">
      <word-select :initial="this.getData(this.ikey)" @options="onOptions"></word-select>
    </div>
  </div>
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

<style scoped>
.checkbox-text {
  color: white;
  font-size: medium;
}
.grid-container {
  display: grid;
  grid-template-columns: auto 200px;
  grid-gap: 5px;
}
</style>
