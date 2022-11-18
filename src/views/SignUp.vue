<template>
  <v-card id="card" elevation="3" outlined>
    <v-form id="form" ref="form" v-model="valid" lazy-validation>
      <h1>Sign Up</h1>
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="Username"
        color="success"
        required
        @keyup.enter="validate"
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        color="success"
        required
        @keyup.enter="validate"
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules"
        :type="show1 ? 'text' : 'password'"
        label="Password"
        hint="At least 8 characters"
        counter
        color="success"
        required
        class="mb-4"
        @click:append="show1 = !show1"
        @keyup.enter="validate"
      ></v-text-field>

      <v-btn color="success" class="mr-4 signin" @click="validate">
        Sign Up
      </v-btn>
      <p class="mt-5"><a href="/">Sing In</a></p>
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
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be valid",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length >= 8) || "Password must be at least 8 characters long.",
    ],
    show1: false,
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        axios
          .post("http://localhost:3000/signup", {
            username: this.username,
            email: this.email,
            password: this.password,
          })
          .then(
            (res) => {
              console.log(res.data);
              if (res.data.check) {
                this.$store.commit("setUsername", this.username);
                this.$router.push("/verify");
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
  height: 430px;
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