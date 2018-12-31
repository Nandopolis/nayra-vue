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
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-pulse"></Icon>Audios
              </template>
              <MenuItem name="upload">Upload</MenuItem>
              <MenuItem name="rename_audio">Rename</MenuItem>
              <MenuItem name="delete_audio">Delete</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-code"></Icon>Diagrams
              </template>
              <MenuItem name="new">Create</MenuItem>
              <MenuItem name="rename">Rename</MenuItem>
              <MenuItem name="delete">Delete</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Content :style="{padding: '24px', minHeight: '600px', maxHeight: '600px'}">
          <Breadcrumb :style="{margin: '0 0 24px'}">
            <BreadcrumbItem>Diagrams</BreadcrumbItem>
            <BreadcrumbItem>New Diagram</BreadcrumbItem>
          </Breadcrumb>
          <ReteComp
            :style="{background: '#fff', maxHeight: '500px', maxWidth: '1050px'}"
            :editor-json="newEditorJson"
            @update:editor-json="val => editorJson = val"
          />
        </Content>
      </Layout>
      {{newEditorJson}}
    </Layout>
  </div>
</template>
<script>
import ReteComp from "./ReteComp";

export default {
  name: "Index",
  components: {
    ReteComp
  },
  data: () => ({
    header_menus: [
      { id: 1, name: "new", display: "New", icon: "ios-create" },
      { id: 2, name: "open", display: "Open", icon: "ios-folder-open" },
      { id: 3, name: "save", display: "Save", icon: "ios-paper" },
      { id: 4, name: "run", display: "Run", icon: "ios-play" },
      { id: 5, name: "stop", display: "Stop", icon: "ios-pause" },
      { id: 6, name: "help", display: "Help", icon: "md-help" }
    ],
    editorJson: {
      id: "demo@0.1.0",
      nodes: {
        "1": {
          id: 1,
          data: { num: 2 },
          inputs: {},
          outputs: {
            num: {
              connections: [{ node: 3, input: "num1", data: { pins: [] } }]
            }
          },
          position: [80, 200],
          name: "Number"
        },
        "2": {
          id: 2,
          data: { num: 0 },
          inputs: {},
          outputs: {
            num: {
              connections: [{ node: 3, input: "num2", data: { pins: [] } }]
            }
          },
          position: [80, 400],
          name: "Number"
        },
        "3": {
          id: 3,
          data: {},
          inputs: {
            num1: {
              connections: [{ node: 1, output: "num", data: { pins: [] } }]
            },
            num2: {
              connections: [{ node: 2, output: "num", data: { pins: [] } }]
            }
          },
          outputs: { num: { connections: [] } },
          position: [500, 240],
          name: "Add"
        }
      },
      comments: []
    },
    newEditorJson: { id: "demo@0.1.0", nodes: {}, comments: [] }
  }),
  methods: {
    action(name) {
      console.log(name);
    }
  }
};
</script>
