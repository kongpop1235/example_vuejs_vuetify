<template>
  <v-card id="card" elevation="3" outlined>
    <v-form id="form" ref="form" v-model="valid" lazy-validation>
      <h1>Sign In</h1>
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="Username"
        color="success"
        required
        @keyup.enter="validate"
      ></v-text-field>

      <v-text-field
        class="mb-4"
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules"
        :type="show1 ? 'text' : 'password'"
        label="Password"
        color="success"
        required
        @click:append="show1 = !show1"
        @keyup.enter="validate"
      ></v-text-field>

      <v-btn class="mr-4 signin" color="success" @click="validate">
        Sign In
      </v-btn>
      <p class="mt-5"><a href="/sign-up">Sing Up</a></p>
    </v-form>
  </v-card>
</template>
  
  <script>
import axios from "axios";

export default {
  data: () => ({
    valid: true,
    username: "",
    usernameRules: [(v) => !!v || "Name is required"],
    // email: "",
    // emailRules: [
    //   (v) => !!v || "E-mail is required",
    //   (v) =>
    //     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    //     "E-mail must be valid",
    // ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      // (v) => (v && v.length >= 8) || "Password must be at least 8 characters long.",
    ],
    show1: false,
  }),

  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        await axios
          .post("http://localhost:3000/signin", {
            username: this.username,
            password: this.password,
          })
          .then(
            (res) => {
              if (res.data.check) {
                this.$store.commit(
                  "setAccessToken",
                  res.data.message.token.accessToken
                );
                this.$router.push("/manage_users");
                this.$store.commit("setCheck", true);
              } else {
                if (res.data.message.split(" ").pop() === "confirmed.") {
                  this.$store.commit("setUsername", this.username);
                  this.$router.push("/verify");
                } else {
                  alert(res.data.message);
                }
              }
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
        console.log("bad");
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
  
  <style scoped>
#card {
  height: 360px;
  width: 500px;
  margin: auto;
  padding: 30px;
}

.my-text-style >>> .v-text-field__slot input {
  color: green;
}

.signin {
  width: 440px;
}

a:link {
  text-decoration: none;
}
</style>