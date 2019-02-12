<template>
  <!-- <Select v-model="value" size="large" placeholder="select an audio" :transfer="true">
    <Option v-for="item in audios" :key="item.id" :value="item.id" :label="item.name">
      <Tooltip :content="item.content" placement="right">
        <div>{{ item.name }}</div>
      </Tooltip>
    </Option>
  </Select> -->
  <Cascader
    :data="audios2"
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
      value: "",
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
  // watch: {
  //   value() {
  //     this.$emit('select', this.value)
  //   }
  // },
  computed: {
    audios() {
      return this.$store.state.audios;
    }
  },
  mounted() {
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
