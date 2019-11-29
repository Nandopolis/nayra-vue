<template>
  <Cascader 
    :data="formated_actions"
    v-model="value"
    :style="{width: '200px', maxWidth: '200px', minWidth: '200px'}"
    size="large"
    trigger="hover"
    placeholder="select an action"
    :clearable="false"
    :transfer="true"
    @on-change="onChange">
  </Cascader>
</template>

<script>
export default {
  props: ['initial'],
  data() {
    return {
      value: []
    };
  },
  computed: {
    actions() {
      return this.$store.state.actions;
    },
    formated_actions() {
      return this.$store.getters.formated_actions;
    }
  },
  created() {
    if (undefined !== this.initial) {
      var initial_action = this.$store.getters.action(this.initial)
      if ('action' === initial_action.category) {
        this.value[0] = initial_action.id;
      } else {
        this.value[0] = initial_action.category;
        this.value[1] = initial_action.id;
      }
    }
    if (!this.actions) {
      this.$store.dispatch('loadAudios');
    }
  },
  methods: {
    onChange(value, selectedData) {
      this.$emit('select', value[value.length - 1])
    }
  }
};
</script>

<style>
</style>
