<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: fit-content;
  float: left;
}
.layout-nav {
  width: fit-content;
  float: right;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" @on-select="action">
          <div class="layout-logo, ivu-menu-item">
            <Icon type="ios-ionitron" size="30"></Icon>Nayra GPI
          </div>
          <div class="layout-nav">
            <MenuItem v-for="menu in header_menus" :key="menu.id" :name="menu.name">
              <Icon :type="menu.icon"></Icon>
              {{menu.display}}
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu theme="light" width="auto" :open-names="['1', '2']" @on-select="action">
            <Submenu v-for="menu in sider_menus" :key="menu.id" :name="menu.name">
              <template slot="title">
                <Icon :type="menu.icon"></Icon>
                {{menu.display}}
              </template>
              <MenuItem v-for="item in menu.items" :key="item.id" :name="item.name">{{item.display}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Content :style="{padding: '24px', minHeight: '600px', maxHeight: '600px'}">
          <Breadcrumb :style="{margin: '0 0 24px', float: 'left'}">
            <BreadcrumbItem>Diagrams</BreadcrumbItem>
            <BreadcrumbItem>{{openedDiagram.name}}</BreadcrumbItem>
          </Breadcrumb>
          <Button
            :style="{margin: '0 10px 0', float: 'right'}"
            shape="circle"
            icon="md-done-all"
            @click="update_content"
          >Save</Button>
          <Button
            :style="{margin: '0 10px 0', float: 'right'}"
            shape="circle"
            icon="md-resize"
            @click="resize"
          >Resize</Button>
          <ReteComp
            :style="{background: '#fff', maxHeight: '500px', maxWidth: '1050px'}"
            :editor-json="openedDiagram.content"
            ref="reteComp"
          />
        </Content>
      </Layout>
      <Modal
        v-model="open_modal"
        title="Saved diagrams"
        width="80%"
        ok-text="Open"
        cancel-text="Cancel"
        @on-ok="open"
        @on-cancel="open_modal=false"
      >
        <Table
          highlight-row
          :columns="columns"
          :data="diagrams"
          @on-current-change="val => diagram_id = val.id"
        ></Table>
      </Modal>

      <Modal
        v-model="save_modal"
        title="Save diagram"
        width="80%"
        ok-text="Save"
        cancel-text="Cancel"
        @on-ok="save"
        @on-cancel="save_modal=false"
      >
        <Form :model="formSave" :rules="ruleSave">
          <FormItem label="Nombre">
            <Input type="text" v-model="formSave.name" placeholder="Nombre"></Input>
          </FormItem>
          <FormItem label="Description">
            <Input type="text" v-model="formSave.description" placeholder="Descripción"></Input>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        v-model="rename_modal"
        title="Edit diagram"
        width="80%"
        ok-text="Save"
        cancel-text="Cancel"
        @on-ok="update_metadata"
        @on-cancel="rename_modal=false"
      >
        <Form :model="formSave" :rules="ruleSave">
          <FormItem label="Nombre">
            <Input type="text" v-model="formSave.name" placeholder="Nombre"></Input>
          </FormItem>
          <FormItem label="Description">
            <Input type="text" v-model="formSave.description" placeholder="Descripción"></Input>
          </FormItem>
        </Form>
      </Modal>

      <Modal v-model="edit_audio_modal" title="Edit Audios" width="80%">
        <Table
          highlight-row
          v-if="audios"
          :columns="columns_audio"
          :data="this.audios"
          @on-current-change="val => audio_id = val.id"
        ></Table>
        <div slot="footer">
          <Button type="info" @click="rename_audio">Rename</Button>
          <Button type="error" @click="delete_audio">Delete</Button>
        </div>
      </Modal>

      <Modal
        v-model="rename_audio_modal"
        title="Rename audio"
        width="80%"
        ok-text="Save"
        cancel-text="Cancel"
        @on-ok="rename_content_audio"
        @on-cancel="rename_audio_modal=false"
      >Desccripción
        <Input type="text" v-model="audioContent" placeholder="Descripción"></Input>
      </Modal>

      <Modal
        v-model="upld_audio_modal"
        title="Upload audio"
        width="80%"
        ok-text="Upload"
        cancel-text="Cancel"
        @on-ok="upload_audio"
        @on-cancel="upld_audio_modal=false"
      >
        <Form :model="formAudio">
          <FormItem label="Nombre">
            <Input type="text" v-model="formAudio.content" placeholder="Nombre"></Input>
          </FormItem>
          <FormItem label="Archivo">
            <Upload :before-upload="handleUpload" :action="this.backend + '/api/audios'">
              <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
            </Upload>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        v-model="delete_modal"
        title="Delete diagram"
        width="80%"
        ok-text="Delete"
        cancel-text="Cancel"
        @on-ok="del"
        @on-cancel="delete_modal=false"
      >
        <Table
          highlight-row
          :columns="columns"
          :data="diagrams"
          @on-current-change="val => diagram_id = val.id"
        ></Table>
      </Modal>
      {{diagram}}
    </Layout>
  </div>
</template>
<script>
import ReteComp from "./ReteComp";
import * as Diagrams from "../libs/SavedDiagrams.js";
import axios from "axios";
import config from "../config/config.js";

export default {
  name: "Index",
  components: {
    ReteComp
  },
  data: () => ({
    backend: config.backend,
    header_menus: [
      { id: 1, name: "new", display: "New", icon: "ios-create" },
      { id: 2, name: "open", display: "Open", icon: "ios-folder-open" },
      { id: 3, name: "save", display: "Save as", icon: "ios-paper" },
      { id: 4, name: "run", display: "Run", icon: "ios-play" },
      { id: 5, name: "stop", display: "Stop", icon: "ios-pause" },
      { id: 6, name: "help", display: "Help", icon: "md-help" }
    ],
    sider_menus: [
      {
        id: 1,
        name: "1",
        display: "Audios",
        icon: "ios-pulse",
        items: [
          { id: 1, name: "upload_audio", display: "Upload" },
          { id: 2, name: "edit_audio", display: "Edit" }
        ]
      },
      {
        id: 2,
        name: "2",
        display: "Diagrams",
        icon: "ios-code",
        items: [
          { id: 1, name: "new", display: "Create" },
          { id: 2, name: "rename", display: "Rename" },
          { id: 3, name: "delete", display: "Delete" }
        ]
      }
    ],
    diagrams: Diagrams.savedEditors,
    openedDiagram: [],
    open_modal: false,
    diagram_id: 0,
    columns: [
      { type: "index", align: "center" },
      { title: "Nombre", key: "name" },
      { title: "Descripción", key: "description" },
      { title: "Última actualización", key: "modified" }
    ],
    edit_audio_modal: false,
    audio_id: 0,
    audios: [],
    columns_audio: [
      { type: "index", align: "center" },
      { title: "Nombre", key: "name" },
      { title: "Descripción", key: "content" }
    ],
    audioContent: "",
    save_modal: false,
    formSave: { name: "", description: "", content: {} },
    ruleSave: {
      name: [
        { required: true, message: "Please fill in the name.", trigger: "blur" }
      ],
      description: [
        {
          required: true,
          message: "Please fill in the description.",
          trigger: "blur"
        }
      ]
    },
    delete_modal: false,
    rename_modal: false,
    rename_audio_modal: false,
    upld_audio_modal: false,
    formAudio: {},
    file: ""
  }),
  computed: {
    diagram() {
      return this.$store.state.diagram;
    },
    savable() {
      return (
        JSON.stringify(this.diagram) !==
        JSON.stringify(this.openedDiagram.content)
      );
    },
    runable() {
      return !this.savable && this.openedDiagram.id != 0;
    }
  },
  methods: {
    action(name) {
      console.log(name);
      switch (name) {
        case "open":
          this.fetchDiagrams().then(() => {
            this.open_modal = true;
          });
          break;

        case "save":
          this.save_modal = true;
          break;

        case "delete":
          this.fetchDiagrams().then(() => {
            this.delete_modal = true;
          });
          break;

        case "rename":
          this.formSave.name = this.openedDiagram.name;
          this.formSave.description = this.openedDiagram.description;
          this.rename_modal = true;
          break;

        case "new":
          this.openedDiagram = Diagrams.newEditor;
          break;

        case "upload_audio":
          this.upld_audio_modal = true;
          break;

        case "edit_audio":
          axios({
            method: "get",
            url: this.backend + "/api/audios",
            withCredentials: true,
            crossDomain: true
          })
            .then(response => {
              console.log(response);
              this.audios = response.data;
            })
            .catch(error => {
              console.log(error);
            });
          this.edit_audio_modal = true;
          break;

        case "run":
          axios({
            method: "get",
            url:
              this.backend + "/api/programs/" + this.openedDiagram.id + "/run",
            withCredentials: true,
            crossDomain: true
          })
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            });
          break;

        case "stop":
          axios({
            method: "get",
            url: this.backend + "/api/programs/stop",
            withCredentials: true,
            crossDomain: true
          })
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            });
          break;

        default:
          break;
      }
    },
    fetchDiagrams() {
      return axios({
        method: "get",
        url: this.backend + "/api/programs",
        withCredentials: true,
        crossDomain: true
      })
        .then(response => {
          console.log(response);
          this.diagrams = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSubmit(name) {
      console.log("validating");

      this.$refs[name].validate(valid => {
        console.log(valid);

        return valid;
      });
    },
    open() {
      axios({
        method: "get",
        url: this.backend + "/api/programs" + "/" + this.diagram_id,
        withCredentials: true,
        crossDomain: true
      })
        .then(response => {
          console.log(response);
          this.openedDiagram = response.data;
          this.open_modal = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    save() {
      this.formSave.content = this.diagram;
      axios({
        method: "post",
        url: this.backend + "/api/programs",
        withCredentials: true,
        crossDomain: true,
        headers: { "Content-Type": "application/json" },
        data: this.formSave
      })
        .then(response => {
          console.log(response);
          this.diagrams.push(response.data);
          this.diagram_id = response.data.id;
          this.open();
          this.open_modal = false;
        })
        .catch(error => {
          console.log(error);
          this.open_modal = false;
        });
    },
    del() {
      axios({
        method: "delete",
        url: this.backend + "/api/programs" + "/" + this.diagram_id,
        withCredentials: true,
        crossDomain: true
      })
        .then(response => {
          console.log(response);
          //this.diagrams.push(response.data);
          this.delete_modal = false;
        })
        .catch(error => {
          console.log(error);
          this.delete_modal = false;
        });
    },
    update_content() {
      axios({
        method: "put",
        url: this.backend + "/api/programs" + "/" + this.openedDiagram.id,
        withCredentials: true,
        crossDomain: true,
        data: { content: this.diagram }
      })
        .then(response => {
          console.log(response);
          //this.diagrams.push(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    update_metadata() {
      this.formSave.content = this.diagram;
      axios({
        method: "put",
        url: this.backend + "/api/programs" + "/" + this.openedDiagram.id,
        withCredentials: true,
        crossDomain: true,
        headers: { "Content-Type": "application/json" },
        data: this.formSave
      })
        .then(response => {
          console.log(response);
          this.diagrams.push(response.data);
          this.open_modal = false;
        })
        .catch(error => {
          console.log(error);
          this.open_modal = false;
        });
    },
    resize() {
      this.$refs["reteComp"].resize();
    },
    handleUpload(file) {
      this.file = file;
      return false;
    },
    upload_audio() {
      console.log(this.file);
      let form = new FormData();
      form.append("content", this.formAudio.content);
      form.append("tipo", "audio");
      form.append("file", this.file);
      axios({
        method: "post",
        url: this.backend + "/api/audios",
        withCredentials: true,
        crossDomain: true,
        mimeType: "multipart/form-data",
        data: form
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    delete_audio() {
      axios({
        method: "delete",
        url: this.backend + "/api/audios" + "/" + this.audio_id,
        withCredentials: true,
        crossDomain: true
      })
        .then(response => {
          console.log(response);
          this.edit_audio_modal = false;
        })
        .catch(error => {
          console.log(error);
          this.edit_audio_modal = false;
        });
    },
    rename_audio() {
      this.rename_audio_modal = true;
    },
    rename_content_audio() {
      axios({
        method: "put",
        url: this.backend + "/api/audios" + "/" + this.audio_id,
        withCredentials: true,
        crossDomain: true,
        headers: { "Content-Type": "application/json" },
        data: { content: this.audioContent }
      })
        .then(response => {
          console.log(response);
          this.edit_audio_modal = false;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.openedDiagram = Diagrams.newEditor;
  }
};
</script>
