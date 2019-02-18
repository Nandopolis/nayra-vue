<template>
  <Checkbox v-model="single">
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
