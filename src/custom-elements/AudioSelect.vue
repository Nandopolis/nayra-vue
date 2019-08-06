<template>
  <Cascader 
    :data="formated_audios"
    v-model="value"
    ref="cascader"
    size="large"
    trigger="hover"
    placeholder="select an audio"
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
    audios() {
      return this.$store.state.audios;
    },
    formated_audios() {
      return this.$store.getters.formated_audios;
    }
  },
  created() {
    if (undefined !== this.initial) {
      console.log(this.initial);
      var initial_audio = this.$store.getters.audio(this.initial);
      this.value[0] = initial_audio.category_id;
      this.value[1] = initial_audio.id;
    }
    if (!this.audios) {
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
