<template>
  <v-card class="mx-auto" max-width="350">
    <v-col style="display: flex; justify-content: center">
      <v-avatar size="100" color="#eee">
        <v-icon size="90">mdi-account</v-icon>
      </v-avatar>
    </v-col>
    <v-divider></v-divider>
    <!-- <v-list-item color="rgba(0, 0, 0, .4)">
      <v-list-item-content>
        <v-list-item-title class="title">User name</v-list-item-title>
        <v-list-item-subtitle>Network Engineer</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title class="title">Marcus Obrien</v-list-item-title>
        <v-list-item-subtitle>Network Engineer</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item> -->
    <v-list-item v-for="(value, field) in userInfor" :key="field">
      <v-list-item-content>
        <v-list-item-title class="title">{{ field }}</v-list-item-title>
        <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
      </v-list-item-content></v-list-item
    >
    <v-divider></v-divider>
    <v-card-actions style="padding: 15px 10px">
      <v-btn color="primary" @click="logout()">{{
        this.$store.state.userId ? "Logout" : "Login"
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { getData, checkLogin } from "../../../firebase";
import store from "../../../store";
export default {
  data() {
    return {
      userInfor: {
        Username: "",
        Email: "",
      },
    };
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
  mounted() {
    this.userInfor.Username =
      this.$store.state.username || "You are not logged in";
    this.userInfor.Email = this.$store.state.email || "You are not logged in";
  },
  methods: {
    async logout() {
      // if not logged in => go to login
      if (!this.$store.state.userId) {
        this.$router.push("/login");
        return;
      }
      const confirmed = await this.$confirm("<p>Wanna logout?</p>", {
        buttonFalseText: "No",
        buttonTrueText: "Yes",
        icon: this.$vuetify.icons.warning,
        title: "Warning",
        width: 300,
      });
      if (confirmed) {
        this.$store.commit("logout");
      }
    },
  },
};
</script>
