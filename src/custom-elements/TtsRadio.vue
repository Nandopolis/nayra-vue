<template>
  <Checkbox v-model="single" :style="{width: '200px', maxWidth: '200px', minWidth: '200px'}">
    <span class="checkbox-text"> Text to Speech</span>
  </Checkbox>
</template>

<script>
export default {
  props: ['initial'],
  data() {
    return {
      single: false
    };
  },
  watch: {
    single() {
      var value = this.single ? 'text' : 'audio';
      this.$emit('check-change', value);
    }
  },
  created() {
    this.single = 'text' === this.initial;
  }
};
</script>

<style>
.checkbox-text {
  color: white;
  font-size: 1.2em;
}
</style>
