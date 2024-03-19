import { ltm } from "./persist";
import { syncPlugin } from "./sync";
import { topology } from "./topology";
import exporter from "@/exporter";
import router from "../router";
import { getData } from "../firebase";

export const ready = ltm.ready;
export const config = {
  strict: process.env.NODE_ENV === "development",
  state: {
    topologies: ["bEiivYnl5olZKCgY5qfr", "e22qNHJwYxKMaGlThti5"],
    topoList: null,
    userId: null,
    username: null,
    email: null,
    logined: false,
    loading: true,
    working: false,
    isUpdateAvailable: false,
    alert: { show: false },
  },
  mutations: {
    init(state, user) {
      state.logined = true;
      state.userId = user.id;
      state.username = user.username;
      state.email = user.email;
      router.push("/home");
    },

    getTopo() {},
    loadTopolist(state, data) {
      state.topoList = data;
    },
    testLogin(state) {
      state.logined = !state.logined;
    },
    login(state, user) {
      state.logined = true;
      state.userId = user.id;
      state.username = user.username;
      state.email = user.email;
      state.topologies = user.topologies;
      router.push("/user");
    },
    logout(state) {
      state.logined = false;
      state.userId = null;
      state.username = null;
      state.email = null;
      state.topologies = null;
      router.push("/login");
    },
    loaded(state) {
      state.loading = false;
    },
    setLoginState(state, value) {
      return (state.logined = value);
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
