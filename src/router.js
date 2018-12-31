const routers = [
  {
    path: "/",
    meta: {
      title: "Nayra GPI"
    },
    component: resolve => require(["./views/index.vue"], resolve)
  }
];
export default routers;
