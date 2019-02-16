<template>
  <div class="grid-container">
    <div class="grid-item">
      <tts-radio :initial="this.getData('key')" @check-change="onCheckChange"></tts-radio>
    </div>
    <br>
    <div class="grid-item">
      <input-text v-if="this.key === 'text'" :initial="this.getData('text')" @input="onSelect"></input-text>
      <audio-select v-else :initial="this.getData('audio')" @select="onSelect"></audio-select>
    </div>
    <br>
    <div class="grid-item">
      <action-select :initial="this.getData('action')" @select="onActionSelect"></action-select>
    </div>
  </div>
</template>

<script>
export default {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  data() {
    return {
      value: "",
      tts: false,
      key: 'audio'
    };
  },
  mounted() {
    this.putData('key', this.key);
    this.emitter.trigger("process");
  },
  methods: {
    onSelect(event) {
      this.value = event.detail[0];
      this.putData(this.key, this.value);
      this.emitter.trigger("process");
    },
    onCheckChange(event) {
      this.key = event.detail[0];
      this.putData('key', this.key);
      this.emitter.trigger("process");
    },
    onActionSelect(event) {
      this.putData('action', event.detail[0]);
      this.emitter.trigger("process");
    }
  }
};
</script>

<style>
</style>
