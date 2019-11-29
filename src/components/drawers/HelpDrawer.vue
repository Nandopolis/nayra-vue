<template>
  <Drawer v-model="localShow" title="Help" width="80%" :styles="{padding: 0}">
    <Row v-if="localShow">
      <Col span="6">
        <!-- <Scroll height="100px"> -->
          <Menu width="auto" @on-select="(name) => step=name" :active-name="step">
            <MenuGroup v-for="topic in topics" :key="topic.title" :title="topic.title">
              <MenuItem v-for="lesson in topic.lessons" :key="lesson.name" :name="lesson.name" class="menu-item">
                {{`${lesson.name + 1}. ${lesson.title}`}}
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
              <p :style="{margin:'40px', fontSize: '14px'}">{{lesson.desc}}</p>
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
        {name: 0, title: "Añadir componentes", video: "put_component", desc: "Para añadir un componente haga click derecho en el editor y seleccione el componente que desea añadir, todos los diagramas deben contener un componente 'Presentation' y un 'Terminate'."},
        {name: 1, title: "Configurar una acción", video: "set_action_component", desc: "Para añadir una acción a un componente seleccione la acción en el segundo selector, esta acción se ejecutara cuando el flujo del diagrama llegue al componente. Solo los componentes Presentation, Audio y Terminate pueden ejecutar una acción."},
        {name: 2, title: "Reproducir un audio", video: "set_audio_component", desc: "Para reproducir un audio, seleccione el audio que desea reproducir del primer selector, este audio se reproducira cuando el flujo del diagrama llegue al componente. Los componentes Presentation, Audio y Terminate pueden reproducir un audio."},
        {name: 3, title: "Modo texto a voz", video: "set_tts_component", desc: "Es posible reproducir un texto en lugar de un audio, en los componentes que pueden reproducir un audio, para esto active el checkbox 'Text to Speech' y escriba el texto que desea reproducir."},
        {name: 4, title: "Reconocimiento de voz", video: "set_recognition_component", desc: "Para configurar el reconocimiento de voz primero debe añadir uno de los componentes 'Recognition: n', donde n denota el número de opciones que puede reconocer, e.g. 'Recognition: 2' puede reconocer 2 opciones. Una opción puede estar conformada por una o mas palabras. Para configurar las opciones busque la palabra que desea añadir a la opción en la entrada correspondiente y seleccione la palabra correspondente del selector que aparece a medida que realiza la búsqueda."},
        {name: 5, title: "Conectando componentes", video: "connection", desc: "Conectar componentes define el flujo que seguira el diagrama al ejecutarse. Para conectar dos componentes haga click en la salida de un componente y otro click en la entrada de otro componente, las conexiones siempre deben ser entre una salida y una entrada. Las entradas siempre se encuentran en el lado izquierdo de un componente y las salidas en el lado derecho."},
        {name: 6, title: "Componente Terminate", video: "terminate_component", desc: "El componente Terminate es un componente especial, al igual que el componente Presentation solo debe existir uno en cada diagrama, pero a diferencia del componente Presentation no es necesario que se haga una conexión, todas las conexiónes de salida de los componentes que no esten enrutadas serán enrutadas a este componente de forma interna."},
        {name: 7, title: "Re-enrutar una connección", video: "connection_reroute", desc: "Para re-enrutar una conexión haga click en la conexión, en ese punto aparecerá un pin el cual podrá moverlo a su elección para modificar el camino que sigue la conexión. Puede agregar varios pines a una misma conexión."},
        {name: 8, title: "Eliminar un componente", video: "delete_component", desc: "Para eliminar un componente haga click derecho en un componente y seleccione la opción 'Delete'."},
        {name: 9, title: "Zoom", video: "zoom", desc: "Para realizar un zoom al editor utilice la rueda central del ratón o su equivalente en el touchpad."},
        {name: 10, title: "Resize", video: "resize", desc: "Para ajustar el zoom a una vista que comprenda a todos los componente utilice el boton 'Resize'."},
        {name: 11, title: "Minimap", video: "minimap", desc: "En la esquina superior derecha del editor se encuentra un minimapa del editor, puede arrastra el minimapa para moverse a través del editor."},
      ]},
      {title: "Diagramas", lessons: [
        {name: 12, title: "Abrir un nuevo diagrama", video: "create_program", desc: "Para abrir un nuevo diagrama seleccione la opción Create del menú Diagrams."},
        {name: 13, title: "Guardar diagrama", video: "save_program", desc: "Para guardar un diagrama nuevo seleccione la opción 'Save as' en el menú Diagramas y llene los datos del formulario con el nombre del diagrama y una pequeña descripción del diagrama, Esta opción también le permite clonar un diagrama."},
        {name: 14, title: "Guardado rápido", video: "save_opened_program", desc: "Para actualizar el contenido de un diagrama que ya abrió y creó con anterioridad puede utilizar el botón Save, este botón estara habilitado solo cuando se haya abierto un diagrama y este se haya modificado."},
        {name: 15, title: "Renombrar un diagrama", video: "rename_program", desc: "Para renombrar o cambiar la descripción de un diagrama seleccione la opción Rename del menú Diagrams."},
        {name: 16, title: "Abrir un diagrama", video: "open_program", desc: "Para abrir un diagrama, que guardo con anterioridad, seelccione la opción Open del menú Diagrams, le aparecera una tabla con los diagramas que tiene guardados, haga click en el diagrama que desea abrir."},
        {name: 17, title: "Eliminar un diagrama", video: "delete_program", desc: "Para eliminar un diagrama seleccione la opción Delete del menú Diagrams, le aparecerá una tabla con los diagrams guardados, seleccione el diagrama que desea eliminar con un click y presione el boton Delete."},
        {name: 18, title: "Ejecutar y detener un diagrama", video: "run_stop_program", desc: "Para ejecutar el flujo de un diagrama presione el botón Run, este boton estará habilitado solo cuando tenga un diagrama abierto y este debidamente guardado, despues de presionarlo se ejecutará el flujo del diagrama establecido y el boton cambiará a Stop, puede detener la ejecución presionando este botón, cuando se detenga la ejecución o se llege al final del flujo el botón volvera a ser de ejecución (Run)."},
      ]},
      {title: "Audios", lessons: [
        {name: 19, title: "Subir audio", video: "upload_audio", desc: "Para subir un audio seleccione la opción Upload del menú Audios, seleccione el audio que desea subir y llene los campos de categoría y descripción, el nombre del audio se tomará del nombre del archivo que suba. Las extensiones permitidas para los archivos de audio son .wav y .mp3."},
        {name: 20, title: "Editar un audio", video: "edit_audio", desc: "Para editar la categoría y la descripción de un audio seleccione la opción Edit del menú Audios, seleccione con un click el audio que desea editar y presione el botón Edit."},
        {name: 21, title: "Eliminar un audio", video: "delete_audio", desc: "Para eliminar un audio seleccione la opción Edit del menú Audios, seleccione con un click el audio que desea eliminar y presione el botón Delete."},
      ]},
      // {title: "Audio categories", lessons: [
      //   {name: 7, title: "Lesson 7", video: "", desc: ""},
      //   {name: 8, title: "Lesson 8", video: "", desc: ""},
      //   {name: 9, title: "Lesson 9", video: "", desc: ""},
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
