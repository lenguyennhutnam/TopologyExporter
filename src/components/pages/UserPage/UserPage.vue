<template>
  <v-card class="mx-auto" max-width="434">
    <v-img
      height="100%"
      src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
    ></v-img>
    <v-col>
      <v-avatar size="100" style="position: absolute; top: 130px">
        <v-img
          src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
        ></v-img>
      </v-avatar>
    </v-col>
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
import { getData } from "../../../firebase";
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
  async created() {
    const uid = "tXBy8I43cyNeX0ymeuve";
    console.log(this.$store.state.userid);
    await getData(this.$store.state.userid, "users").then((res) => {
      if (res) {
        console.log(res);
        this.userInfor.username = res["username"];
        this.userInfor.password = res["password"];
        this.userInfor.email = res["email"];
      }
    });
    console.log(this.userInfor);
  },
  methods: {
    async logout() {
      for (var info in this.userInfor) {
        this.userInfor[info] = "";
      }
      this.$store.commit("logout");
      // this.$router.push("/login");
    },
  },
};
</script>
