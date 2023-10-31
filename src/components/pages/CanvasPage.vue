<template>
  <div class="canvas-container">
    <LoadingSpinner v-if="loading !== false" />
    <template v-else>
      <VisContainer ref="vis" @edit-item="editItem" @saveTopo="save" />
      <Edit ref="edit" />
      <v-speed-dial
      v-if="!isView"
      v-model="fab"
      bottom
      right
      open-on-hover
      style="position: fixed"
      >
      <p>asdsad</p>
      <template #activator>
          <v-btn v-model="fab" fab dark color="primary" data-cy="fab-activator">
            <v-icon v-if="fab">mdi-chevron-down</v-icon>
            <v-icon v-else>mdi-chevron-up</v-icon>
          </v-btn>
        </template>
        <v-btn
          :color="theme.edge.menu"
          fab
          dark
          small
          title="Edge"
          data-cy="fab-edge"
          @click="$refs.vis.addEdge()"
        >
          <v-icon>$vuetify.icons.net-edge</v-icon>
        </v-btn>
        <v-btn
          :color="theme.port.menu"
          fab
          dark
          small
          title="Port"
          data-cy="fab-port"
          @click="$refs.vis.addPort()"
        >
          <v-icon>$vuetify.icons.net-port</v-icon>
        </v-btn>
        <v-btn
          :color="theme.host.menu"
          fab
          dark
          small
          title="Host"
          data-cy="fab-host"
          @click="$refs.vis.addHost()"
        >
          <v-icon>$vuetify.icons.net-host</v-icon>
        </v-btn>
        <v-btn
          :color="theme.switch.menu"
          fab
          dark
          small
          title="Switch"
          data-cy="fab-switch"
          @click="$refs.vis.addSwitch()"
        >
          <v-icon>$vuetify.icons.net-switch</v-icon>
        </v-btn>
        <v-btn
          :color="theme.controller.menu"
          fab
          dark
          small
          title="Controller"
          data-cy="fab-controller"
          @click="$refs.vis.addController()"
        >
          <v-icon>$vuetify.icons.net-controller</v-icon>
        </v-btn>
        <v-btn
          :color="theme.dummy.menu"
          fab
          dark
          small
          title="Label"
          data-cy="fab-dummy"
          @click="$refs.vis.addDummy()"
        >
          <v-icon>$vuetify.icons.net-label</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="red"
          title="Delete"
          data-cy="fab-delete"
          @click="$refs.vis.deleteSelected()"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
      <LoadSection @click="this.emit('save')"></LoadSection>
    </template>
  </div>
</template>

<script>
var db = "http://localhost:3001/usertopo";
import Edit from "../Edit.vue";
import LoadingSpinner from "../LoadingSpinner.vue";
import VisContainer from "../VisContainer.vue";
import LoadSection from "../export/LoadSection.vue";
import { items as theme } from "@/theme.js";
import exporter from "@/exporter";
import { mapGetters } from "vuex";

export default {
  name: "CanvasPage",
  components: { Edit, LoadingSpinner, VisContainer, LoadSection },
  data: () => ({
    fab: false,
    theme,
  }),
  computed: {
    ...mapGetters("topology", ["data"]),
    loading() {
      return this.$store.state.loading;
    },
    isView() {
      return this.$route.meta.isView;
    },
  },
  methods: {
    showAlert(type, text) {
      this.$store.commit("setAlert", { type, text });
    },
    save() {
      console.log("kkkk");
      const savedData = JSON.stringify(
        exporter.exportData(this.data),
        undefined,
        4
      );
      fetch(db + "/" + this.data.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: savedData,
      })
        .then((res) => res.json())
        .then((savedData) => {
          if (savedData) {
            this.showAlert("success", "Saved.");
          } else {
            this.showAlert("info", "Saved canceled.");
          }
        });
    },
    editItem(item, callback) {
      this.$refs.edit.edit(item, callback);
    },
  },
};
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  padding: 0px;
}
.invert-color {
  filter: invert(100%);
}
</style>
