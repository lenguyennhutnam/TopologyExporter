<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="dialog"
      :fullscreen="fullscreen || $vuetify.breakpoint.xsOnly"
      persistent
      scrollable
      max-width="600px"
      @keydown.esc="cancel"
      @keydown.enter="saveAs"
    >
      <v-card>
        <v-card-title
          primary-title
          style="flex-grow: 0"
          @dblclick="fullscreen = !fullscreen"
        >
          <v-icon class="mr-2">$vuetify.icons.save-as</v-icon>
          <h3 class="headline">Save as</h3>
        </v-card-title>
        <v-card-text style="flex-grow: 1">
          <v-text-field label="Project Name" v-model="setName"></v-text-field>
        </v-card-text>
        <v-card-actions style="flex-grow: 0">
          <v-spacer />
          <v-btn
            color="primary"
            text
            data-cy="edit-cancel"
            @click.native="cancel"
            >Cancel</v-btn
          >
          <v-btn
            :disabled="!valid"
            color="primary"
            text
            data-cy="edit-save"
            @click.native="saveAs"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { addTopo, getData } from "../firebase";

export default {
  name: "SaveAs",
  data: () => ({
    dialog: false,
    fullscreen: true,
    valid: true,
    setName: "",
  }),
  computed: {
    ...mapGetters("topology", ["data", "jsonData"]),
    projectName: {
      get() {
        return this.data["projectName"];
      },
      set(value) {
        this.$store.commit("topology/setValues", {
          ["projectName"]: value,
        });
      },
    },
    working: {
      get() {
        return !!this.$store.state.working;
      },
      set(value) {
        if (value === true) {
          this.$store.commit("clearAlert");
        }
        this.$store.commit("setWorking", { working: !!value });
      },
    },
  },
  mounted() {
    this.setName = this.$store.state.topology.data.projectName;
  },
  methods: {
    saveAsDialog() {
      this.lastPjName = this.$store.state.topology.data.projectName;
      this.dialog = true;
      this.fullscreen = false;
    },
    async saveAs() {
      this.working = true;
      const dataObj = JSON.parse(this.jsonData);
      const newTopoId = await addTopo({
        data: JSON.stringify(dataObj),
        projectName: this.setName,
        userId: this.$store.state.userId,
      });
      this.$store.commit("setTopoId", newTopoId);
      await getData(this.$store.state.userId, "users").then((res) => {
        console.log(res.topologies);
        this.$store.commit("loadTopoKey", res.topologies);
      });
      this.working = false;
      this.dialog = false;
    },

    cancel() {
      this.dialog = false;
      this.setName = this.lastPjName;
    },
  },
};
</script>
