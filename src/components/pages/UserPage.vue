<template>
  <h1>User page</h1>
</template>

<script>
export default {
  name: "UserPage",
  data() {
    return {
      currTopo: null,
    };
  },
  methods: {
    showAlert(type, text) {
      this.$store.commit("setAlert", { type, text });
    },
    loadTopo() {
      fetch("http://localhost:3001/usertopo")
        .then((res) => res.json())
        .then((topo) => {
          if (topo) {
            this.$store.commit("topology/importData", topo[0]);
            this.showAlert("success", "Successfully imported.");
          } else {
            this.showAlert("info", "Import canceled.");
          }
        });
    },

    saveTopo() {
      console.log(this.currTopo);
    },
  },
};
</script>

<!-- <script>
import importScript from "@/importScript";
import scriptImportWarning from "./scriptImportWarning.txt";
import { mapGetters } from "vuex";


export const haha {
  computed: {
    ...mapGetters("topology", ["data"]),
    working: {
      get() {
        return !!this.$store.state.working;
      },
      set(value) {
        if (value) {
          this.$store.commit("clearAlert");
        }
        this.$store.commit("setWorking", { working: !!value });
      },
    },
    importers() {
      function json(json) {
        return { data: JSON.parse(json), log: [] };
      }
      function python(script) {
        return importScript(script);
      }
      return {
        ".json": json,
        ".py": python,
        "application/json": json,
        "application/x-python-code": python,
        "text/x-python": python,
        json,
        python,
      };
    },
    importAccept() {
      return Object.keys(this.importers)
        .filter((key) => /(^.|\/)/.test(key))
        .join(",");
    },
  },
  methods: {

    openFileChooser() {
      const input = this.$refs.fileInput;
      input.click();
    },
    retrieveFile() {
      const input = this.$refs.fileInput;
      const file = input.files[0];
      input.value = "";
      // Some browsers emit input, some change and some both.
      // Return if the file was already collected by the other event handler.
      if (!file) {
        return;
      }

      this.working = true;

      const fr = new FileReader();
      fr.readAsBinaryString(file);
      fr.onloadend = async () => {
        try {
          const stringToImport =
            this.importers[file.type] ||
            this.importers[file.name.replace(/^.*(?=\.)/, "")];
          console.log(stringToImport);
          if (stringToImport) {
            const str = fr.result;
            const { data, log } = stringToImport(str);
            this.$emit("log", log);
            if (stringToImport === this.importers.python) {
              await this.confirmImport(data, scriptImportWarning);
            } else {
              await this.confirmImport(data);
            }
          } else {
            this.showAlert("error", `Unknown file format: “${file.type}”.`);
          }
        } catch (error) {
          console.error(error);
          this.showAlert("error", "Import failed.");
        } finally {
          this.working = false;
        }
      };
    },
    async importData(data) {
      this.working = true;
      await this.confirmImport(data);
      this.working = false;
    },
    async confirmImport(importData, text) {
      const confirmed = await this.$confirm(
        (text || "") +
          "<p>This will <strong>erase all your work</strong> (except what you have exported).<br/>Are you sure you want to continue?</p>",
        {
          buttonFalseText: "Keep existing project",
          buttonTrueText: "Import",
          icon: this.$vuetify.icons.warning,
          title: "Warning",
          width: 600,
        }
      );
      if (confirmed) {
        console.log(importData);
        this.$store.commit("topology/importData", importData);
        this.showAlert("success", "Successfully imported.");
      } else {
        this.showAlert("info", "Import canceled.");
      }
    },
  },
};
<script /> -->
