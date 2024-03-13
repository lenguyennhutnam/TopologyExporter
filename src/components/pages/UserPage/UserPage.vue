<template>
  <v-card class="mx-auto" max-width="350">
    <!-- <v-img
      height="100%"
      src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
    ></v-img> -->
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
    <v-card-actions>
      <!-- <router-link to="/Login"> -->
      <v-btn color="primary" @click="logout">Logout</v-btn>
      <!-- </router-link> -->
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
        username: "",
        password: "",
        email: "",
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
  beforeRouteEnter(to, from, next) {
    getData(store.state.userId, "users").then((res) => {
      if (res) {
        next((vm) => {
          vm.userInfor.username = res["username"];
          vm.userInfor.password = res["password"];
          vm.userInfor.email = res["email"];
        });
      } else {
        next("/Login");
      }
    });
  },
  methods: {
    setInfo() {},
    async logout() {
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
      // checkLogin("nam@gmail.com", "123nammm").then((result) => {
      //   console.log(result);
      // });
      // for (var info in this.userInfor) {
      //   this.userInfor[info] = "";
      // }
      // this.$store.commit("logout");
    },
  },
};
</script>
