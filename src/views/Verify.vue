<template>
  <v-card id="card" elevation="3" outlined>
    <v-form id="form" ref="form" v-model="valid" lazy-validation>
      <h1>Veritfy</h1>
      <v-text-field
        class="mb-4"
        v-model="verify"
        label="verify"
        color="success"
        required
        @keyup.enter="validate"
      ></v-text-field>
      <v-btn class="mr-4 signin" color="success" @click="validate">
        Confirm
      </v-btn>
      <p class="mt-5"><a href="/sign-in">Sign In</a></p>
    </v-form>
  </v-card>
</template>
  
  <script>
import axios from "axios";

export default {
  data: () => ({
    valid: true,
    verify: "",
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        axios
          .post("http://localhost:3000/veritfy", {
            username: this.$store.getters.username,
            code: this.verify,
          })
          .then(
            (res) => {
              console.log(res.data);
              if (res.data.check) {
                this.$router.push("/");
              }
              console.log(res.data);
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