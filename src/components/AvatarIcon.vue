<template>
  <span>
    <v-menu offset-y open-on-click>
      <template v-slot:activator="{ on }">
        <v-avatar v-on="on">
          <v-btn icon="" @click="checkUser"
            ><v-icon size="34">mdi-account</v-icon></v-btn
          >
        </v-avatar>
      </template>
      <v-list>
        <v-list-item
          style="min-width: 100px"
          v-for="(item, index) in items"
          :key="index"
          @click="selectSection(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script>
import { checkLogin } from "../firebase";
import store from "../store";

export default {
  data() {
    return { items: [{ title: "Login" }] };
  },

  methods: {
    checkUser() {
      if (this.$store.state.userId) {
        this.items = [{ title: store.state.email }, { title: "Logout" }];
      } else {
        this.items = [{ title: "Login" }];
      }
    },
    selectSection(item) {
      switch (item.title) {
        case "Logout":
          this.$store.commit("logout");
          break;
        case "Login":
          this.$router.push("/login");
          break;
        default:
          this.$router.push("/user");
      }
    },
  },
};
</script>
