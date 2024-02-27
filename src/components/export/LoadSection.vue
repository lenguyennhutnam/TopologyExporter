<template>
  <v-flex xs12 pb-5>
    <v-layout>
      <v-flex xs12 sm4>
        <h3 class="headline">Save</h3>
      </v-flex>
      <v-flex xs12 sm4>
        <div class="load">
          <h3 class="headline">Load</h3>
          <v-btn
            color="primary"
            icon
            small
            @click="fetchAllTopo"
            :disabled="working"
            style="position: relative; top: 3px"
            ><v-icon>$vuetify.icons.refresh</v-icon></v-btn
          >
        </div>
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
              <v-list-item-title @click="saveAsDialog">
                Save As
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <SaveAs ref="saveAs" @saveAs="saveAs"></SaveAs>
      </v-flex>
      <v-flex xs12 sm4>
        <v-menu :disabled="working" bottom offset-y>
          <template #activator="{ on }">
            <v-btn :disabled="working" outlined block color="primary" v-on="on"
              >Load</v-btn
            >
          </template>
          <div class="loadTopoList">
            <v-list>
              <v-list-item v-for="topo in topoList" :key="topo.id" @click.stop>
                <v-list-item-title @click="loadTopo(topo.id)">{{
                  topo.projectName
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-menu>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
// var db = "http://localhost:3001/usertopo";
import { mapGetters } from "vuex";
import SaveAs from "../SaveAs.vue";
import { getTopo, updateTopo } from "../../firebase";

export default {
  name: "SaveLoad",
  components: { SaveAs },
  data() {
    return {
      topoList: "",
    };
  },
  created() {
    // this.fetchAllTopo();
  },
  computed: {
    ...mapGetters("topology", ["data", "jsonData"]),
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
  methods: {
    showAlert(type, text) {
      this.$store.commit("setAlert", { type, text });
    },
    async fetchAllTopo() {
      getTopo("bEiivYnl5olZKCgY5qfr").then((res) => {
        this.topoList = JSON.parse(res.data);
        this.topoList.projectName = res.projectName;
        this.$store.commit("topology/importData", JSON.parse(res.data));
        // console.log(this.$store.commit("topology/impo"));
        // updateTopo("tXBy8I43cyNeX0ymeuve", this.$store.topology.state.data);
        this.$store.commit("topology/importData", this.topoList);
      });
      // .then((topo) => console.log(topo));

      // this.working = true;
      // await fetch(db)
      //   .then((res) => res.json())
      //   .then((topo) => {
      //     this.topoList = topo;
      //   });
      // this.working = false;
    },

    loadTopo(id) {
      fetch(db + "/" + id)
        .then((res) => res.json())
        .then((topo) => {
          this.confirmLoad(topo);
        });
    },

    async confirmLoad(loadData) {
      this.working = true;
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
        console.log(loadData);
        this.$store.commit("topology/importData", loadData);
        this.showAlert("success", "Loaded.");
      } else {
        this.showAlert("info", "Load canceled.");
      }
      this.working = false;
    },

    save() {
      if (!this.data.id) {
        this.saveAsDialog();
        return;
      }
      fetch(db + "/" + this.data.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: this.jsonData,
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

    saveAsDialog() {
      this.$refs.saveAs.saveAsDialog();
    },

    saveAs(data) {
      updateTopo("tXBy8I43cyNeX0ymeuve", "sss");
      // this.$store.commit("topology/saveAs", data);
      // this.$store.commit("topology/importData", data);
    },
  },
};
</script>

<style>
.load {
  display: flex;
}
/* .load button{
  margin-left: 10px;
} */
.loadTopoList {
  max-height: 250px;
}
</style>
