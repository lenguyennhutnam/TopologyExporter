<template>
  <v-container grid-list-md>
    <LoadingSpinner v-if="loading !== false" />
    <template v-else>
      <v-layout wrap>
        <v-flex xs12 py-5>
          <h3 class="headline">Import</h3>

          <ImportSection @log="(l) => (log = l)" />
        </v-flex>

        <v-flex xs12 pb-5>
          <h3 class="headline">Export</h3>

          <ExportSection @log="(l) => (log = l)" />
        </v-flex>

        <LoadSection></LoadSection>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
import ExportSection from "../export/ExportSection.vue";
import ImportSection from "../export/ImportSection.vue";
import LoadSection from "../export/LoadSection.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import LogListing from "../export/LogListing.vue";

export default {
  name: "ExportPage",
  components: {
    ExportSection,
    ImportSection,
    LoadingSpinner,
    LogListing,
    LoadSection,
  },
  data: () => ({
    log: [],
  }),
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>
