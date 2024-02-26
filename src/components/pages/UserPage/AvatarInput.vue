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
  </v-card>
</template>

<script>
import { getUserData } from "../../../firebase";
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
    await getUserData("tXBy8I43cyNeX0ymeuve11").then((res) => {
      console.log(res);
      this.userInfor.username = res["username"];
      this.userInfor.password = res["password"];
      this.userInfor.email = res["email"];
    });
    console.log(this.userInfor);
  },
};
</script>
