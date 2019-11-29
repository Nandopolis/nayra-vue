<template>
  <Input
    v-model="value" placeholder="Enter something..."
    size="large" :style="{width: '200px', maxWidth: '200px', minWidth: '200px'}" clearable>
    <Icon slot="prepend" type="md-text" />
  </Input>
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
      if (this.value) {
        var normal_string = this.value.replace(/[^a-zA-Z ]/g, "");
        this.$emit('input', normal_string);
        this.value = normal_string
      }
    }
  },
  created() {
    if (undefined !== this.initial) {
      this.value = this.initial;
    }
  },
  methods: {
    
  }
};
</script>

<style>
</style>
