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
            @click="loginTo"
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
            <v-btn
              :disabled="working || !logined"
              outlined
              block
              color="primary"
              v-on="on"
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
            <v-btn
              :disabled="working || !logined"
              outlined
              block
              color="primary"
              v-on="on"
              @click="loadSavedTopo"
              >Load</v-btn
            >
          </template>
          <div class="loadTopoList">
            <v-list>
              <v-list-item
                v-for="topo in this.$store.state.topoList"
                :key="topo.projectName"
                @click.stop
              >
                <v-list-item-title @click="loadTopo(topo)">{{
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
import SaveAs from "../SaveAs.vue";
import { mapGetters } from "vuex";
import { getData, updateTopo } from "../../firebase";

export default {
  name: "SaveLoad",
  components: { SaveAs },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("topology", ["data", "jsonData"]),
    logined: {
      get() {
        return this.$store.state.logined;
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
  methods: {
    async loadSavedTopo() {
      const topoList = [];
      const idList = this.$store.state.topologies;
      for (const i in idList) {
        await getData(idList[i], "topologies").then((data) => {
          topoList.push(data);
        });
      }
      this.$store.commit("loadTopolist", topoList);
    },
    loginTo() {
      this.$store.commit("testLogin");
    },

    showAlert(type, text) {
      this.$store.commit("setAlert", { type, text });
    },

    loadTopo(topo) {
      const data = JSON.parse(topo.data);
      data["projectName"] = topo.projectName;
      this.confirmLoad(data, topo.id);
    },

    async confirmLoad(loadData, id) {
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
        this.$store.commit("topology/importData", loadData);
        this.$store.commit("setTopoId", id);
        this.showAlert("success", "Loaded.");
      } else {
        this.showAlert("info", "Load canceled.");
      }
      this.working = false;
    },

    save() {
      const currId = this.$store.state.topoId;
      if (!currId) {
        this.saveAsDialog();
        return;
      } else {
        const dataObj = JSON.parse(this.jsonData);
        const projectName = dataObj.projectName;
        delete dataObj.projectName;
        updateTopo({
          data: JSON.stringify(dataObj),
          id: currId,
          projectName: projectName,
        });
      }
    },
    saveAsDialog() {
      this.$refs.saveAs.saveAsDialog();
    },
    saveAs(data) {
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
