<template>
  <Input v-model="value" placeholder="Enter something..." style="width: 125px" clearable/>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    };
  },
  watch: {
    value() {
      this.$emit('input', this.value);
    }
  },
  mounted() {
    
  },
  methods: {
    
  }
};
</script>

<style>
</style>
