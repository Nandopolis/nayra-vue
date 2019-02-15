<template>
  <Cascader
    :data="formated_audios"
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
  data() {
    return {
      audios2: [
        {
          value: "saludos", label: "Saludos",
          children: [
            {value: 1, label: "Mañana"},
            {value: 2, label: "Tarde"},
            {value: 3, label: "Noche"}
          ]
        },
        {
          value: "edad", label: "Edad",
          children: [
            {value: 4, label: "Mayor"},
            {value: 5, label: "Menor"}
          ]
        },
        {
          value: "color", label: "Color",
          children: [
            {value: 6, label: "Rojo"},
            {value: 7, label: "Verde"},
            {value: 8, label: "Azul"}
          ]
        }
      ]
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
  mounted() {
    if (!this.audios) {
      this.$store.dispatch('loadAudios');
    }
  },
  methods: {
    onChange(value, selectedData) {
      this.$emit('select', 1)
      // this.$emit('select', value[value.length - 1])
    }
  }
};
</script>

<style>
</style>
