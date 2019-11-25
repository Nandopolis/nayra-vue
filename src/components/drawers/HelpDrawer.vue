<template>
  <Drawer v-model="localShow" title="Help" width="70%" :styles="{padding: 0}">
    <Row v-if="localShow">
      <Col span="6">
        <!-- <Scroll height="100px"> -->
          <Menu width="auto" @on-select="(name) => step=name" :active-name="step">
            <MenuGroup v-for="topic in topics" :key="topic.title" :title="topic.title">
              <MenuItem v-for="lesson in topic.lessons" :key="lesson.name" :name="lesson.name" class="menu-item">
                {{lesson.title}}
              </MenuItem>
            </MenuGroup>
          </Menu>
        <!-- </Scroll> -->
      </Col>
      <Col span="18" style="padding: 10px">
        <Carousel v-model="step" dots="outside">
          <CarouselItem v-for="(lesson, index) in lessons" :key="lesson.name">
            <Row type="flex" justify="center">
              <h2 :style="{marginBottom:'20px'}">{{lesson.title}}</h2>
            </Row>
            <Row v-if="index == step" type="flex" justify="center">
              <video autoplay loop muted playsinline width="80%" height="auto" :src="`/videos/${lesson.video}.webm`"></video>
            </Row>
            <Row type="flex" justify="center">
              <p :style="{margin:'20px'}">{{lesson.title}}</p>
            </Row>
          </CarouselItem>
        </Carousel>
      </Col>
    </Row>
  </Drawer>
</template>

<script>
export default {
  name: "HelpDrawer",
  props: ["show"],
  data: () => ({
    topics: [
      {title: "Editor", lessons: [
        {name: 0, title: "Component placement", video: "put_component"},
        {name: 1, title: "Setting an action", video: "set_action_component"},
        {name: 2, title: "Playing an audio", video: "set_audio_component"},
        {name: 3, title: "Setting recognition keywords", video: "set_recognition_component"},
        {name: 4, title: "Setting a text to speech phrase", video: "set_tts_component"},
        {name: 5, title: "Presentation-Terminate components", video: "terminate_component"},
        {name: 6, title: "Connecting components", video: "connection"},
        {name: 7, title: "Rerouting a connection", video: "connection_reroute"},
        {name: 8, title: "Deleting a component", video: "delete_component"},
        {name: 9, title: "Zoom", video: "zoom"},
        {name: 10, title: "Resize", video: "resize"},
        {name: 11, title: "Minimap", video: "minimap"},
      ]},
      {title: "Diagrams", lessons: [
        {name: 12, title: "Creating a new diagram", video: "create_program"},
        {name: 13, title: "Saving a new diagram", video: "save_program"},
        {name: 14, title: "Quick save", video: "save_opened_program"},
        {name: 15, title: "Renaming a diagram", video: "rename_program"},
        {name: 16, title: "Opening a diagram", video: "open_program"},
        {name: 17, title: "Deleting a diagram", video: "delete_program"},
        {name: 18, title: "Running and stoping a diagram", video: "run_stop_program"},
      ]},
      {title: "Audios", lessons: [
        {name: 19, title: "Uploading an audio", video: "upload_audio"},
        {name: 20, title: "Editing an audio", video: "edit_audio"},
        {name: 21, title: "Deleting an audio", video: "delete_audio"},
      ]},
      // {title: "Audio categories", lessons: [
      //   {name: 7, title: "Lesson 7", video: ""},
      //   {name: 8, title: "Lesson 8", video: ""},
      //   {name: 9, title: "Lesson 9", video: ""},
      // ]},
    ],
    step: 0,
    lessons: []
  }),
  computed: {
    localShow: {
      get() { return this.show; },
      set(value) { this.$emit('update:show', value); }
    },
  },
  created() { this.topics.forEach(topic => this.lessons.push(...topic.lessons)); },
  methods: {}
}
</script>

<style>
  .menu-item {
    padding: 5px 20px !important;
  }
  .menu-ivu-menu-item-group-title {
    height: 40px !important;
    line-height: 40px !important;
  }
</style>
