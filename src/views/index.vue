<style>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout .ivu-menu-submenu-title {
  height: 60px !important;
}
.demo-badge-alone {
  background: #5cadb8 !important;
}
.layout-footer-center{
  text-align: center;
}
.demo-drawer-footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.grid-container {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto auto;
  grid-gap: 5px;
}
</style>

<template>
  <div class="layout">
    <Layout>
      <!-- Header Menu -->
      <Header :style="{padding: '0 25px'}">
        <Menu mode="horizontal" theme="dark" @on-select="action">
          <div class="grid-container">
            <div class="ivu-menu-item">
              <Icon type="ios-ionitron" size="30"></Icon>Nayra GPI
            </div>
            <div class="grid-item"></div>
            <div class="grid-item" v-if="menu.visible" v-for="menu in header_menus" :key="menu.id">
              <Submenu v-if="menu.items" :name="menu.name">
                <template slot="title">
                  <Icon :type="menu.icon"></Icon>
                  {{menu.display}}
                </template>
                <MenuItem v-for="item in menu.items" :key="item.id" :name="item.name">
                  {{item.display}}
                  <Icon v-if="item.icon" :type="item.icon" :style="{float: 'right'}"></Icon>
                </MenuItem>
              </Submenu>
              <MenuItem v-else :name="menu.name">
                <Icon :type="menu.icon"></Icon>
                {{menu.display}}
              </MenuItem>
            </div>
          </div>
        </Menu>
      </Header>

      <!-- App Content -->
      <Content :style="{padding: '24px'}">
        <Row>
          <Breadcrumb :style="{margin: '0 0 24px', float: 'left'}">
            <BreadcrumbItem>Diagrams</BreadcrumbItem>
            <BreadcrumbItem>
              {{openedDiagram.name}}
              <Badge v-if="savable" status="processing"></Badge>
            </BreadcrumbItem>
          </Breadcrumb>
          <ButtonGroup shape="circle" :style="{margin: '0 10px 0', float: 'right'}">
            <Button @click="resize">
              <Icon type="md-resize" /> Resize
            </Button>
            <Button @click="update_content">
              Save <Icon type="md-done-all" />
            </Button>
          </ButtonGroup>
        </Row>
        
        <Row :style="{height: 'calc(100vh - 159px)', width: '100%'}">
          <ReteComp :style="{background: '#fff', height: 'calc(100vh - 159px'}" :editor-json="editorJson" ref="reteComp"/>
        </Row>
        
      </Content>

      <!-- Footer -->
      <!-- <Footer class="layout-footer-center">{{diagram}}</Footer> -->
      
      <!-- Open diagram Drawer -->
      <Drawer v-model="open_modal" title="Saved programs" width="70%">
        <Table highlight-row :columns="columns" :data="diagrams" @on-current-change="open"></Table>
      </Drawer>

      <!-- Save as diagram Modal -->
      <Modal v-model="save_modal" title="Save diagram" width="40%">
        <Form :model="formSave" :rules="ruleSave">
          <FormItem label="Name">
            <Input type="text" v-model="formSave.name" placeholder="name"></Input>
          </FormItem>
          <FormItem label="Description">
            <Input type="text" v-model="formSave.description" placeholder="Description"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button style="margin-right: 8px" type="error" @click="save_modal=false">Cancel</Button>
          <Button type="primary" @click="save">Save</Button>
        </div>
      </Modal>

      <!-- Edit diagram Modal -->
      <Modal v-model="rename_modal" title="Edit diagram" width="40%">
        <Form :model="formSave" :rules="ruleSave">
          <FormItem label="Name">
            <Input type="text" v-model="formSave.name" placeholder="name"></Input>
          </FormItem>
          <FormItem label="Description">
            <Input type="text" v-model="formSave.description" placeholder="description"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="error" @click="rename_modal=false">Cancel</Button>
          <Button type="primary" @click="update_metadata">Save</Button>
        </div>
      </Modal>

      <!-- Delete diagram Drawer -->
      <Drawer v-model="delete_modal" title="Delete diagram" width="80%">
        <Table highlight-row :columns="columns" :data="diagrams" @on-current-change="val=>diagram_id=val.id"></Table>
        <div class="item demo-drawer-footer">
          <Button style="margin-right: 8px" type="primary" @click="delete_modal=false">Cancel</Button>
          <Button type="error" @click="del">Delete</Button>
        </div>
      </Drawer>

      <!-- Edit audio Drawer -->
      <Drawer v-model="edit_audio_modal" title="Edit Audios" width="70%">
        <Table highlight-row v-if="audios" :columns="columns_audio" :data="audios" @on-current-change="val=>audio_id=val.id"></Table>
        <div class="demo-drawer-footer">
          <Button type="primary" @click="rename_audio">Rename</Button>
          <Button type="error" @click="delete_audio">Delete</Button>
        </div>
      </Drawer>

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

      <!-- Upload audio Drawer -->
      <Drawer v-model="upld_audio_modal" title="Upload audio" width="50%">
        <Form :model="formAudio">
          <FormItem label="Description">
            <Input type="text" v-model="formAudio.content" placeholder="description"></Input>
          </FormItem>
          <FormItem label="Category">
            <Input type="text" v-model="formAudio.category" placeholder="category"></Input>
          </FormItem>
          <FormItem label="File">
            <br>
            <Upload :before-upload="handleUpload" :action="backend + '/api/audios'">
              <Button icon="ios-cloud-upload-outline">{{file.name || "Select the file to upload"}}</Button>
            </Upload>
          </FormItem>
        </Form>
        <div class="item demo-drawer-footer">
          <Button style="margin-right: 8px" type="error" @click="upld_audio_modal=false">Cancel</Button>
          <Button type="primary" @click="upload_audio">Upload</Button>
        </div>
      </Drawer>
    </Layout>
  </div>
</template>
<script>
import ReteComp from "./ReteComp";
import * as Diagrams from "../libs/SavedDiagrams.js";
import axios from "axios";
import config from "../config/config.js";
import deepEqual from "deep-equal";

export default {
  name: "Index",
  components: {
    ReteComp
  },
  data: () => ({
    backend: config.backend,
    header_menus: [
      {
        id: 1, name: "1", visible: true, display: "Diagrams", icon: "ios-code",
        items: [
          { id: 1, name: "new", display: "Create", icon: "ios-create-outline" },
          { id: 2, name: "open", display: "Open", icon: "ios-folder-open-outline" },
          { id: 3, name: "save", display: "Save as", icon: "ios-document-outline" },
          { id: 4, name: "rename", display: "Rename", icon: "ios-clipboard-outline" },
          { id: 5, name: "delete", display: "Delete", icon: "md-close" }
        ]
      },
      {
        id: 2, name: "2", visible: true, display: "Audios", icon: "ios-pulse",
        items: [
          { id: 1, name: "upload_audio", display: "Upload", icon: "ios-cloud-upload-outline" },
          { id: 2, name: "edit_audio", display: "Edit", icon: "ios-clipboard-outline" }
        ]
      },
      { id: 3, name: "run", display: "Run", icon: "ios-play", visible: true },
      { id: 4, name: "stop", display: "Stop", icon: "ios-pause", visible: false },
      { id: 5, name: "help", display: "Help", icon: "md-help", visible: true }
    ],
    diagrams: [],
    openedDiagram: [],
    open_modal: false,
    diagram_id: 0,
    columns: [
      { title: "id", key: "id", width: 65, sortable: true },
      { title: "Name", key: "name" },
      { title: "Description", key: "description" },
      { title: "Updated at", key: "modified", sortable: true }
    ],
    edit_audio_modal: false,
    audio_id: 0,
    columns_audio: [
      { title: "id", key: "id", width: 65, sortable: true },
      { title: "Name", key: "name" },
      { title: "Description", key: "content" },
      { title: "Category", key: "category", sortable: true }
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
    editorJson() {
      return JSON.stringify(this.openedDiagram.content);
    },
    audios() {
      return this.$store.state.audios;
    },
    savable() {
      return !deepEqual(JSON.parse(this.diagram), this.openedDiagram.content);
    }
  },
  mounted() {
    this.$store.dispatch('loadAudios');
    this.$store.dispatch('loadActions');
    this.$store.dispatch('loadWords');
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
          this.formSave.name = this.openedDiagram.name;
          this.formSave.description = this.openedDiagram.description;
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
          this.file = "";
          this.formAudio = {};
          break;

        case "edit_audio":
          this.edit_audio_modal = true;
          break;

        case "run":
          this.header_menus[2].visible = false;
          this.header_menus[3].visible = true;
          axios({
            method: "get",
            url:
              this.backend + "/api/programs/" + this.openedDiagram.id + "/run",
            withCredentials: true,
            crossDomain: true
          })
            .then(response => {
              console.log(response);
              this.header_menus[2].visible = true;
              this.header_menus[3].visible = false;
            })
            .catch(error => {
              console.log(error);
              this.header_menus[2].visible = true;
              this.header_menus[3].visible = false;
            });
          break;

        case "stop":
          this.header_menus[2].visible = true;
          this.header_menus[3].visible = false;
          axios({
            method: "get",
            url: this.backend + "/api/programs/stop",
            withCredentials: true,
            crossDomain: true
          })
            .then(response => {
              console.log(response);
              this.header_menus[2].visible = false;
              this.header_menus[3].visible = true;
            })
            .catch(error => {
              console.log(error);
              this.header_menus[2].visible = false;
              this.header_menus[3].visible = true;
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
    open(val) {
      this.diagram_id = val.id;
      axios({
        method: "get",
        url: this.backend + "/api/programs/" + this.diagram_id,
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
      this.formSave.content = JSON.parse(this.diagram);
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
          this.open(response.data);
          this.save_modal = false;
        })
        .catch(error => {
          console.log(error);
          this.save_modal = false;
        });
    },
    del() {
      axios({
        method: "delete",
        url: this.backend + "/api/programs/" + this.diagram_id,
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
      var editor = JSON.parse(this.diagram);
      axios({
        method: "put",
        url: this.backend + "/api/programs/" + this.openedDiagram.id,
        withCredentials: true,
        crossDomain: true,
        data: { content: editor }
      })
        .then(response => {
          console.log(response);
          //this.diagrams.push(response.data);
          this.openedDiagram.content = editor;
        })
        .catch(error => {
          console.log(error);
        });
    },
    update_metadata() {
      this.formSave.content = JSON.parse(this.diagram);
      axios({
        method: "put",
        url: this.backend + "/api/programs/" + this.openedDiagram.id,
        withCredentials: true,
        crossDomain: true,
        headers: { "Content-Type": "application/json" },
        data: this.formSave
      })
        .then(response => {
          console.log(response);
          this.diagrams.push(response.data);
          this.rename_modal = false;
        })
        .catch(error => {
          console.log(error);
          this.rename_modal = false;
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
      let form = new FormData();
      form.append("content", this.formAudio.content);
      form.append("category", this.formAudio.category);
      form.append("file", this.file);
      console.log(form);
      
      axios({
        method: "post",
        url: this.backend + "/api/audios",
        withCredentials: true,
        crossDomain: true,
        mimeType: "multipart/form-data",
        data: form
      })
        .then(response => {
          this.upld_audio_modal = false;
          var data  = response.data;
          data['category'] = this.formAudio.category;
          this.$store.commit('addAudio', data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    delete_audio() {
      axios({
        method: "delete",
        url: this.backend + "/api/audios/" + this.audio_id,
        withCredentials: true,
        crossDomain: true
      })
        .then(response => {
          this.$store.commit('delAudio', this.audio_id);
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
        url: this.backend + "/api/audios/" + this.audio_id,
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
