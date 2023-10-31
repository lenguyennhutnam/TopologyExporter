<template>
  <v-flex xs12 pb-5>
    <v-layout>
      <v-flex xs12 sm4>
        <h3 class="headline">Save</h3>
      </v-flex>
      <v-flex xs12 sm4>
        <h3 class="headline">Load</h3>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12 sm4>
        <v-menu :disabled="working" bottom offset-y>
          <template #activator="{ on }">
            <v-btn :disabled="working" outlined block color="primary" v-on="on"
              >Save</v-btn
            >
          </template>
          <v-list>
            <v-list-item @click.stop>
              <v-list-item-title @click="save"> Save </v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop>
              <v-list-item-title @click="saveAs"> Save As </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-flex>
      <v-flex xs12 sm4>
        <v-menu :disabled="working" bottom offset-y>
          <template #activator="{ on }">
            <v-btn :disabled="working" outlined block color="primary" v-on="on"
              >Load</v-btn
            >
          </template>
          <v-list>
            <v-list-item
              v-for="(topo, i) in topoList"
              :key="'topo' + i"
              @click.stop
            >
              <v-list-item-title @click="loadTopo(topo.id)">{{
                topo.projectName.slice(18)
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
var db = "http://localhost:3001/usertopo";
import exporter from "@/exporter";
import { mapGetters } from "vuex";
export default {
  name: "SaveLoad",
  data() {
    return {
      topoList: null,
    };
  },
  created() {
    this.fetchAllTopo();
  },
  computed: {
    ...mapGetters("topology", ["data"]),
    working: {
      get() {
        return !!this.$store.state.working;
      },
      set(value) {
        if (value === true) {
          this.$store.commit("clearAlert");
        }
        this.$store.commit("setWorking", { working: value });
      },
    },
  },
  methods: {
    showAlert(type, text) {
      this.$store.commit("setAlert", { type, text });
    },
    fetchAllTopo() {
      fetch(db)
        .then((res) => res.json())
        .then((topo) => {
          this.topoList = topo;
        });
    },

    async confirmLoad(loadData) {
      const confirmed = await this.$confirm(
        "<p>This will <strong>erase all your work</strong> (except what you have save or exported).<br/>Are you sure you want to continue?</p>",
        {
          buttonFalseText: "Keep existing project",
          buttonTrueText: "Load",
          icon: this.$vuetify.icons.warning,
          title: "Warning",
          width: 600,
        }
      );
      if (confirmed) {
        this.$store.commit("topology/importData", loadData);
        this.showAlert("success", "Loaded.");
      } else {
        this.showAlert("info", "Load canceled.");
      }
    },

    loadTopo(id) {
      fetch(db + "/" + id)
        .then((res) => res.json())
        .then((topo) => {
          this.confirmLoad(topo);
        });
    },

    save() {
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

    saveAs() {
      console.log(23232);
    },
  },
};
</script>
