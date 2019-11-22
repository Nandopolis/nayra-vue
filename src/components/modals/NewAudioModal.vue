<template>
  <Modal v-model="localShow" title="Upload audio" width="40%">
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
      <FormItem label="File">
        <br>
        <Upload :before-upload="handleUpload" :action="backend + '/api/audios'">
          <Button icon="md-cloud-upload">{{file.name || "Select the file to upload"}}</Button>
        </Upload>
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
  name: "NewAudioModal",
  props: ["show"],
  data: () => ({
    backend: config.backend,
    formAudio: { content: "", category_id: "" },
    file: {},
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
        this.formAudio = { content: "", category_id: "" };
      }
    }
  },
  methods: {
    handleUpload(file) {
      this.file = file;
      return false;
    },
    send() {
      this.loading = true;
      let form = new FormData();
      form.append("content", this.formAudio.content);
      form.append("category_id", this.formAudio.category_id);
      form.append("file", this.file);
      axios({
        method: "post",
        url: this.backend + "/api/audios",
        mimeType: "multipart/form-data",
        data: form
      }).then(response => {
        this.$store.commit('addAudio', response.data);
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
