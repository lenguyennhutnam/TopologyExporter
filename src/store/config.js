import { ltm } from "./persist";
import { syncPlugin } from "./sync";
import { topology } from "./topology";
import exporter from "@/exporter";
import router from "../router";

export const ready = ltm.ready;
export const config = {
  strict: process.env.NODE_ENV === "development",
  state: {
    userid: "tXBy8I43cyNeX0ymeuve",
    logined: true,
    loading: true,
    working: false,
    isUpdateAvailable: false,
    alert: { show: false },
  },
  mutations: {
    testLogin(state){
      state.logined = !state.logined;
    },
    login(id) {
      this.logined = true;
      this.userid = id;
      router.push("/");
    },
    logout() {
      this.logined = false;
      this.userid = null;
      router.push("/login");
    },
    loaded(state) {
      state.loading = false;
    },
    setWorking(state, { working, curr, max }) {
      if (!isNaN(curr) && !isNaN(max)) {
        state.working = { curr, max };
      } else {
        state.working = !!working;
      }
    },
    setAlert(state, { type, text }) {
      state.alert = { show: true, type, text };
    },
    clearAlert(state) {
      state.alert.show = false;
    },
    setUpdateAvailable(state) {
      state.isUpdateAvailable = true;
    },
  },
  actions: {},
  modules: {
    topology,
  },
  plugins: [ltm.plugin, syncPlugin],
};
