import { boot } from "quasar/wrappers";
import axios from "axios";

// const api = axios.create({ baseURL: "https://ambulance-blits.pptik.id:5134/" });
const api = axios.create({ baseURL: "http://localhost:5050/" });
// const api = axios.create({ baseURL: "http://192.168.18.28:5050" });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = api;

  app.config.globalProperties.$api = api;
});

export { api };
