<template>
  <Modal v-model="localShow" title="Edit audio" width="40%">
    <Form :model="formAudio">
      <FormItem label="Category">
        <Select v-model="formAudio.category_id">
          <Option v-for="item in audioCategories" :value="item.id" :key="item.id">
            {{ item.name }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="Content">
        <Input type="textarea" v-model="formAudio.content" :autosize="{minRows: 5}" placeholder="audio content"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="error" @click="localShow=false" :disabled="loading">Cancel</Button>
      <Button type="primary" @click="send" :loading="loading">Save</Button>
    </div>
  </Modal>
</template>

<script>
import axios from "axios";
import config from "../../config/config";

export default {
  name: "EditAudioModal",
  props: ["show", "audio-id"],
  data: () => ({
    backend: config.backend,
    formAudio: { content: "", category_id: "" },
    loading: false
  }),
  computed: {
    audioCategories() { return this.$store.state.audio_categories; },
    localShow: {
      get() { return this.show; },
      set(value) { this.$emit('update:show', value); }
    }
  },
  watch: {
    show(state) {
      if (state) {
        var audio = this.$store.getters.audio(this.audioId);
        this.formAudio = { content: audio.content, category_id: audio.category_id };
      } else {
        this.formAudio = { content: "", category_id: "" };
      }
    }
  },
  methods: {
    send() {
      this.loading = true;
      axios({
        method: "put",
        url: this.backend + "/api/audios/" + this.audioId,
        withCredentials: true,
        crossDomain: true,
        headers: { "Content-Type": "application/json" },
        data: this.formAudio
      }).then(response => {
        console.log(response);
        this.$store.commit('updateAudio', response.data);
        this.localShow = false;
      }).catch(error => {
        console.log(error);
      }).then(() => this.loading = false);
    }
  }
}
</script>

<style>

</style>
