<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="dialog"
      :fullscreen="fullscreen || $vuetify.breakpoint.xsOnly"
      persistent
      scrollable
      max-width="600px"
      @keydown.esc="cancel"
      @keydown.enter="save"
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
            @click.native="save"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { addTopo } from "../firebase";

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
    save() {
      const dataObj = JSON.parse(this.jsonData);
      addTopo({
        data: JSON.stringify(dataObj),
        projectName: this.setName,
        userId: this.$store.state.userId,
      });
      this.dialog = false;
    },

    cancel() {
      this.dialog = false;
      this.setName = this.lastPjName;
    },
  },
};
</script>
