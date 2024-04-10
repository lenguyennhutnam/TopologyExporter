<template>
  <div id="app">
    <v-app>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
        min-width="360px"
        dark
      >
        <div>
          <v-tabs
            v-model="tab"
            show-arrows
            background-color="primary"
            icons-and-text
            dark
            grow
          >
            <v-tabs-slider color="#ccc"></v-tabs-slider>
            <v-tab v-for="i in tabs" :key="i.name">
              <v-icon large>{{ i.icon }}</v-icon>
              <div class="caption py-1">{{ i.name }}</div>
            </v-tab>
            <v-tab-item>
              <v-card class="px-4">
                <v-card-text>
                  <v-form ref="loginForm" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="loginEmail"
                          :rules="loginEmailRules"
                          label="E-mail"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="loginPassword"
                          :append-icon="show1 ? 'eye' : 'eye-off'"
                          :rules="[rules.required, rules.min]"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          label="Password"
                          hint="At least 8 characters"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                        <v-btn
                          x-large
                          block
                          :disabled="!valid"
                          color="disable"
                          @click="tryIt"
                        >
                          Try
                        </v-btn>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                        <v-btn
                          x-large
                          block
                          :disabled="!valid"
                          color="primary"
                          @click="login"
                        >
                          Login
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card class="px-4">
                <v-card-text>
                  <v-form ref="registerForm" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="registerUsername"
                          :rules="[rules.required]"
                          label="Username"
                          maxlength="20"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="registerEmail"
                          :rules="emailRules"
                          label="E-mail"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, rules.min]"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          label="Password"
                          hint="At least 8 characters"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          block
                          v-model="verify"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, passwordMatch]"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          label="Confirm Password"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                        <v-btn
                          x-large
                          block
                          :disabled="!valid"
                          color="primary"
                          @click="register"
                          >Register</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { checkLogin, getData, addData } from "../../firebase";
import router from "../../router";
export default {
  computed: {
    ...mapGetters("topology", ["data", "jsonData"]),
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
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
  },
  methods: {
    showAlert(type, text) {
      this.$store.commit("setAlert", { type, text });
      setTimeout(() => this.$store.commit("clearAlert"), 2000);
    },
    tryIt() {
      this.$store.commit("loginWithoutAccount");
      router.push("/home");
    },
    async login() {
      this.working = true;
      this.valid = false;
      if (await this.$refs.loginForm.validate()) {
        this.working = true;
        // return userinfo
        const userinfo = await checkLogin(this.loginEmail, this.loginPassword);
        if (userinfo) {
          console.log(userinfo);
          this.showAlert("success", "Login successfully");
          this.$store.commit("login", userinfo);
        } else {
          this.showAlert("error", "Email or password is incorrect");
        }
        this.working = false;
        return;
      }
    },
    async register() {
      if (await this.$refs.registerForm.validate()) {
        if (
          await addData(
            this.registerEmail,
            this.password,
            this.registerUsername
          )
        ) {
          this.showAlert("success", "Registered");
          this.tab = 0;
          this.loginEmail = this.registerEmail;
          this.loginPassword = this.password;
          this.$refs.registerForm.reset();
          return;
        } else {
          const acpt = await this.$confirm("<p>Email already in use</p>", {
            buttonFalseText: "Try another email",
            buttonTrueText: "Login",
            icon: this.$vuetify.icons.warning,
            title: "Warning",
            width: 600,
          });
          if (acpt) {
            this.tab = 0;
            return;
          } else {
            this.registerEmail = "";
            return;
          }
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  data() {
    return {
      dialog: true,
      tab: 0,
      tabs: [
        { name: "Login", icon: "mdi-account" },
        { name: "Register", icon: "mdi-account-outline" },
      ],
      valid: true,

      registerUsername: "",
      registerEmail: "",
      password: "",
      verify: "",
      loginPassword: "",
      loginEmail: "",
      loginEmailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 8) || "Min 8 characters",
      },
    };
  },
};
</script>
