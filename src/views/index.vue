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
            <Button @click="resize"><Icon type="md-resize" /> Resize </Button>
            <Button @click="update_content" :disabled="!savable || openedDiagram.id==0"> Save <Icon type="md-done-all"/></Button>
          </ButtonGroup>
          <div :style="{margin: '5px', float: 'right', fontSize:'14px'}">
            {{processText}}
            <Switch size="large" v-model="processing" true-value="online" false-value="offline"/>
          </div>
        </Row>
        <Row :style="{height: 'calc(100vh - 160px)', width: '100%'}">
          <ReteComp :style="{background: '#fff', height: 'calc(100vh - 159px'}" :editor-json="editorJson" ref="reteComp"/>
        </Row>
      </Content>
      
      <!-- Open diagram Drawer -->
      <Drawer v-model="modals.open" title="Saved diagrams" width="70%">
        <Table v-if="programs" highlight-row :columns="columns" :data="programs" @on-current-change="open"></Table>
      </Drawer>

      <!-- Edit and Save as Program Modal -->
      <EditProgramModal :show.sync="modals.rename" :program.sync="openedDiagram" ref="editProgram"/>

      <!-- Delete diagram Drawer -->
      <Drawer v-model="modals.delete" title="Delete diagram" width="70%">
        <Table v-if="programs" highlight-row :columns="columns" :data="programs" @on-current-change="val=>diagram_id=val.id"></Table>
        <div class="item demo-drawer-footer">
          <Button style="margin-right: 8px" type="primary" @click="modals.delete=false">Cancel</Button>
          <Button type="error" @click="del">Delete</Button>
        </div>
      </Drawer>

      <!-- Edit audio Drawer -->
      <Drawer v-model="modals.edit_audio" title="Manage Audios" width="70%">
        <Table highlight-row v-if="audios" :columns="columns_audio" :data="audios" @on-current-change="val=>audio_id=val.id">
          <template slot-scope="{row}" slot="category">
            {{ getAudioCategory(row.category_id).name }}
          </template>
        </Table>
        <div class="demo-drawer-footer">
          <Button type="primary" @click="rename_audio_modal=true">Edit</Button>
          <Button type="error" @click="delete_audio">Delete</Button>
        </div>
      </Drawer>

      <!-- Edit audio Modal -->
      <EditAudioModal :show.sync="rename_audio_modal" :audio-id="audio_id"/>

      <!-- Upload audio Modal -->
      <NewAudioModal :show.sync="modals.upload_audio"/>

      <!-- Edit audio_category Drawer -->
      <Drawer v-model="modals.audio_category" title="Manage Audio Categoriess" width="70%">
        <Button type="primary" style="margin-bottom: 15px;" icon="md-add" @click="new_audio_category">New</Button>
        <Table highlight-row v-if="audioCategories" :columns="columns_audio_category" :data="audioCategories" @on-current-change="val=>audio_category_id=val.id"></Table>
        <div class="demo-drawer-footer">
          <Button type="primary" @click="edit_audio_category">Edit</Button>
          <Button type="error" :disabled="!$store.getters.is_category_empty(audio_category_id)" @click="delete_audio_category">Delete</Button>
        </div>
      </Drawer>

      <!-- create audio category Modal -->
      <Modal v-model="create_audio_category_modal" title="audio category" width="40%">
        <Form :model="formAudioCategory">
          <FormItem label="Category Name">
            <Input type="text" v-model="formAudioCategory.name" placeholder="audio category name"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="error" @click="create_audio_category_modal=false">Cancel</Button>
          <Button type="primary" @click="create_audio_category">Save</Button>
        </div>
      </Modal>

      <!-- Edit audio category Modal -->
      <Modal v-model="save_audio_category_modal" title="audio category" width="40%">
        <Form :model="formAudioCategory">
          <FormItem label="Category Name">
            <Input type="text" v-model="formAudioCategory.name" placeholder="audio category name"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="error" @click="save_audio_category_modal=false">Cancel</Button>
          <Button type="primary" @click="save_audio_category">Save</Button>
        </div>
      </Modal>

      <!-- Help drawer -->
      <HelpDrawer :show.sync="modals.help"/>
    </Layout>
  </div>
</template>
<script>
import ReteComp from "../components/ReteComp";
import EditAudioModal from "../components/modals/EditAudioModal";
import EditProgramModal from "../components/modals/EditProgramModal";
import NewAudioModal from "../components/modals/NewAudioModal";
import HelpDrawer from '../components/drawers/HelpDrawer';
import * as Diagrams from "../libs/SavedDiagrams.js";
import axios from "axios";
import config from "../config/config.js";
import deepEqual from "deep-equal";

export default {
  name: "Index",
  components: {
    ReteComp, EditAudioModal, EditProgramModal, NewAudioModal, HelpDrawer
  },
  data: () => ({
    backend: config.backend,
    modals: {
      help: false,
      open: false,
      delete: false,
      rename: false,
      upload_audio: false,
      edit_audio: false,
      audio_category: false
    },
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
          { id: 1, name: "upload_audio", display: "Upload", icon: "md-cloud-upload" },
          { id: 2, name: "edit_audio", display: "Manage", icon: "md-clipboard" },
          { id: 3, name: "audio_category", display: "Categories", icon: "logo-buffer" },
        ]
      },
      { id: 3, name: "run", display: "Run", icon: "ios-play", visible: true },
      { id: 4, name: "stop", display: "Stop", icon: "ios-pause", visible: false },
      { id: 5, name: "help", display: "Help", icon: "md-help", visible: true }
    ],
    openedDiagram: {},
    diagram_id: 0,
    columns: [
      { title: "id", key: "id", width: 65, sortable: true, sortType: "desc" },
      { title: "Name", key: "name" },
      { title: "Description", key: "description" },
      { title: "Updated at", key: "modified", sortable: true }
    ],
    audio_category_id: 0,
    columns_audio_category: [
      { title: "id", key: "id", width: 65, sortable: true },
      { title: "Name", key: "name" },
      { title: "Modified Date", key: "modified" },
    ],
    formAudioCategory: { name: "" },
    create_audio_category_modal: false,
    save_audio_category_modal: false,
    audio_id: 0,
    columns_audio: [
      { title: "id", key: "id", width: 65, sortable: true },
      { title: "Name", key: "name" },
      { title: "Description", key: "content" },
      { title: "Category", slot: "category", sortable: true, sortType: "asc" }
    ],
    rename_audio_modal: false,
    processing: "offline",
  }),
  computed: {
    diagram() { return this.$store.state.diagram; },
    programs() { return this.$store.state.programs; },
    editorJson() { return this.openedDiagram.content; },
    audioCategories() { return this.$store.state.audio_categories; },
    audios() { return this.$store.state.audios; },
    savable() {
      return !deepEqual(JSON.parse(this.diagram), JSON.parse(this.openedDiagram.content));
    },
    processText() {
      return this.processing.charAt(0).toUpperCase() + this.processing.slice(1);
    }
  },
  mounted() {
    this.$store.dispatch('loadPrograms');
    this.$store.dispatch('loadAudioCategories');
    this.$store.dispatch('loadAudios');
    this.$store.dispatch('loadActions');
  },
  methods: {
    getAudioCategory(id) {
      var audio_category = this.$store.getters.audio_category(id);
      return audio_category ? audio_category : {};
    },
    toggleRunStop() {
      var state = this.header_menus[2].visible;
      this.header_menus[2].visible = !state;
      this.header_menus[3].visible = state;
    },
    action(name) {
      console.log(name);
      switch (name) {
        case "help":
        case "open":
        case "delete":
        case "rename":
        case "upload_audio":
        case "edit_audio":
        case "audio_category":
          this.modals[name] = true;
          break;
        case "save":
          this.modals.rename = true;
          break;
        case "new":
          this.openedDiagram = Diagrams.newEditor;
          break;
        case "run":
          this.toggleRunStop();
          axios({
            method: "get",
            url: this.backend + "/api/programs/" + this.openedDiagram.id + "/run" + "?proc=" + this.processing
          }).then(response => {
            console.log(response);
            this.toggleRunStop();
          }).catch(error => {
            console.log(error);
            this.toggleRunStop();
          });
          break;
        case "stop":
          this.toggleRunStop();
          axios({
            method: "get",
            url: this.backend + "/api/programs/stop"
          }).then(response => {
            console.log(response);
            this.toggleRunStop();
          }).catch(error => {
            console.log(error);
            this.toggleRunStop();
          });
          break;
      }
    },
    open(val) {
      this.diagram_id = val.id;
      this.openedDiagram = this.$store.getters.program(this.diagram_id);
      this.modals.open = false;
    },
    del() {
      axios({
        method: "delete",
        url: this.backend + "/api/programs/" + this.diagram_id,
      }).then(response => {
        console.log(response);
        this.$store.commit('delProgram', this.diagram_id)
        this.modals.delete = false;
      }).catch(error => {
        console.log(error);
      });
    },
    update_content() {
      this.$refs["editProgram"].send();
    },
    resize() { this.$refs["reteComp"].resize(); },
    delete_audio() {
      axios({
        method: "delete",
        url: this.backend + "/api/audios/" + this.audio_id,
      }).then(response => {
        this.$store.commit('delAudio', this.audio_id);
        this.modals.edit_audio = false;
      }).catch(error => {
        console.log(error);
        this.modals.edit_audio = false;
      });
    },
    delete_audio_category() {
      axios({
        method: "delete",
        url: this.backend + "/api/audios/categories/" + this.audio_category_id,
      }).then(response => {
        this.$store.commit('delAudioCategory', this.audio_category_id);
        this.modals.audio_category = false;
      }).catch(error => {
        console.log(error);
        this.modals.audio_category = false;
      });
    },
    new_audio_category() {
      this.formAudioCategory.name = "";
      this.create_audio_category_modal = true;
    },
    edit_audio_category() {
      var audio_category = this.$store.getters.audio_category(this.audio_category_id)
      this.formAudioCategory.name = audio_category.name;
      this.save_audio_category_modal = true;
    },
    save_audio_category() {
      axios({
        method: "put",
        url: this.backend + "/api/audios/categories/" + this.audio_category_id,
        headers: { "Content-Type": "application/json" },
        data: this.formAudioCategory
      }).then(response => {
        console.log(response);
        this.$store.commit('updateAudioCategory', response.data);
        this.save_audio_category_modal = false;
      }).catch(error => {
        console.log(error);
      });
    },
    create_audio_category() {
      axios({
        method: "post",
        url: this.backend + "/api/audios/categories",
        headers: { "Content-Type": "application/json" },
        data: this.formAudioCategory
      }).then(response => {
        console.log(response);
        this.$store.commit('addAudioCategory', response.data);
        this.create_audio_category_modal = false;
      }).catch(error => {
        console.log(error);
      });
    },
  },
  created() {
    this.openedDiagram = Diagrams.newEditor;
  }
};
</script>
