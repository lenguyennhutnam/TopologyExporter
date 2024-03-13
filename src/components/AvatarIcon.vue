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
    // if (!this.$store.state.logined) {
    //   return {
    //     items: [{ title: "abcd.xyz@example.com" }, { title: "Logout" }],
    //   };
    // } else {
    //   return {
    //     items: [{ title: "Login" }],
    //   };
    // }
  },

  computed: {
    logined() {
      return this.$store.state.logined;
    },
  },

  watch: {
    logined(state) {
      // Neu da dang nhap
      console.log(state);
      if (state) {
        this.items = [{ title: "abcd.xyz@example.com" }, { title: "Logout" }];
      } else {
        this.items = [{ title: "Login" }];
      }
    },
  },

  methods: {
    checkUser() {
      console.log(23232323);
      if (store.state.logined) {
        this.items = [{ title: "abcd.xyz@example.com" }, { title: "Logout" }];
      } else {
        this.items = [{ title: "Login" }];
      }
    },
    selectSection(item) {
      switch (item.title) {
        case "Logout":
          console.log("Logout");
          this.items.push({ title: "abcdasdsdasdple.com" });
          break;
        case "Login":
          this.$router.push("/login");
          break;
        default:
          this.$router.push("/user");
          console.log("nothing");
      }
    },
  },
};
</script>
