<template>
  <Modal v-model="localShow" :title="title" width="40%">
    <Form :model="formProgram">
      <FormItem label="Name">
        <Input type="text" v-model="formProgram.name" placeholder="name"></Input>
      </FormItem>
      <FormItem label="Description">
        <Input type="text" v-model="formProgram.description" placeholder="description"></Input>
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
  name: "EditProgramModal",
  props: ["show", "program"],
  data: () => ({
    backend: config.backend,
    formProgram: { name: "", description: "", content: {} },
    loading: false
  }),
  computed: {
    diagram() { return this.$store.state.diagram; },
    localShow: {
      get() { return this.show; },
      set(value) { this.$emit('update:show', value); }
    },
    title() { return this.program.id ? "Edit diagram" : "Save diagram" },
    http_method() { return this.program.id ? "put" : "post" },
    url_sufix() { return this.program.id ? "/" + this.program.id : "" },
    commit_type() { return this.program.id ? "updateProgram" : "addProgram" }
  },
  watch: {
    show(state) {
      if (state && this.program.id) {
        this.formProgram.name = this.program.name;
        this.formProgram.description = this.program.description;
      } else {
        this.formProgram = { name: "", description: "", content: {} };
      }
    }
  },
  methods: {
    send() {
      this.loading = true;
      if (this.formProgram.name == "" && this.formProgram.description == "") {
        this.formProgram.name = this.program.name;
        this.formProgram.description = this.program.description;
      }
      this.formProgram.content = this.diagram;
      axios({
        method: this.http_method,
        url: this.backend + "/api/programs" + this.url_sufix,
        headers: { "Content-Type": "application/json" },
        data: this.formProgram
      }).then(response => {
        console.log(response);
        this.$store.commit(this.commit_type, response.data)
        this.$emit('update:program', response.data);
        this.localShow = false;
      }).catch(error => {
        console.error(error);
        this.$Message.error({
          content: 'No se pudo guardar el diagrama, revise su conexión e inténtelo de nuevo.',
          duration: 10, closable: true
        });
      }).then(() => this.loading = false);
    }
  }
}
</script>

<style>

</style>
