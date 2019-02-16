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
      
      var initial_audio = this.$store.getters.audio(this.initial)
      console.log(initial_audio);
      
      if ('audio' === initial_audio.category) {
        this.value[0] = initial_audio.id;
      } else {
        this.value[0] = initial_audio.category;
        this.value[1] = initial_audio.id;
      }
      console.log(this.value);
      
    }
    if (!this.audios) {
      this.$store.dispatch('loadAudios');
    }
  },
  methods: {
    onChange(value, selectedData) {
      console.log(this.value);
      console.log(value);
      console.log(selectedData);
      
      this.$emit('select', value[value.length - 1])
    }
  }
};
</script>

<style>
</style>
