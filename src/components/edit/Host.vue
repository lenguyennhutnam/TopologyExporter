<template>
  <v-form v-model="valid">
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="item.hostname"
            :rules="[
              validators.required()(item.hostname),
              validators.hostname()(item.hostname),
            ]"
            label="Hostname"
            autofocus
            data-cy="edit-hostname"
          />
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="item.defaultRoute"
            :rules="[validators.ip()(item.defaultRoute)]"
            label="Default Route"
            clearable
            data-cy="edit-default-route"
          />
        </v-flex>
        <v-flex xs12 md6 data-cy="edit-cpu-scheduler">
          <v-select
            v-model="item.cpuScheduler"
            :items="schedulers"
            label="Scheduler"
            clearable
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            ref="itemCPULimit"
            v-model.number="item.cpuLimit"
            :rules="[
              validators.decimal()(item.cpuLimit),
              validators.between(0, 1)(item.cpuLimit),
            ]"
            label="CPU Utilization Limit"
            type="number"
            min="0"
            max="1"
            step=".01"
            clearable
            data-cy="edit-cpu-limit"
          />
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="cpuCoresStr"
            :rules="[validators.naturalNumberList()(item.cpuCores)]"
            label="CPU cores"
            clearable
            data-cy="edit-cpu-cores-str"
          />
        </v-flex>
        <v-flex xs12>
          <v-textarea
            v-model="item.startScript"
            label="Startup Script"
            auto-grow
            clearable
            data-cy="edit-start-script"
          />
        </v-flex>
        <v-flex xs12>
          <v-textarea
            v-model="item.stopScript"
            label="Shutdown Script"
            auto-grow
            clearable
            data-cy="edit-stop-script"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import common from "./common";
import {
  required,
  hostname,
  ip,
  between,
  decimal,
  naturalNumberList,
} from "@/validation/rules";
import { schedulers } from "@/components/selects";

export default {
  name: "HostEdit",
  mixins: [common],
  data: () => ({
    valid: false,
    item: {},
    schedulers,
    cpuCoresStrInit: "",
    validators: {
      between,
      decimal,
      hostname,
      ip,
      naturalNumberList,
      required,
    },
  }),
  computed: {
    cpuCoresStr: {
      get() {
        return this.cpuCoresStrInit;
      },
      set(val) {
        if (val == null) {
          this.$delete(this.item, "cpuCores");
        } else {
          const re = /^\d+$/;
          this.$set(
            this.item,
            "cpuCores",
            val
              .split(/\s*[\s,]\s*/g)
              .map((str) => (re.test(str) ? +str : NaN))
              .sort((a, b) => a - b)
              .filter((value, index, array) => array[index - 1] !== value),
          );
        }
      },
    },
  },
  created() {
    this.$on("new-item", () => {
      this.cpuCoresStrInit = (this.item.cpuCores || []).join(", ");
    });
  },
};
</script>
