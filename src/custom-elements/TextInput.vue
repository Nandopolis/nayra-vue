<template>
  <Input
    v-model="value" placeholder="Enter something..."
    size="large" style="width: 203px" clearable
  />
</template>

<script>
export default {
  props: ['initial'],
  data() {
    return {
      value: ''
    };
  },
  watch: {
    value() {
      var normal_string = this.value.replace(/[^a-zA-Z ]/g, "");
      this.$emit('input', normal_string);
      this.value = normal_string
    }
  },
  created() {
    this.value = this.initial;
  },
  methods: {
    
  }
};
</script>

<style>
</style>
