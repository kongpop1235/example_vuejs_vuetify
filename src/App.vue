<template>
  <v-app>
    <v-navigation-drawer
      v-if="this.$store.getters.check"
      permanent
      expand-on-hover
      absolute
      bottom
    >
      <v-list>
        <v-list-item class="">
          <v-list-item-icon>
            <v-icon>mdi-hospital-building</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Animal hospital</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item link @click="users">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="pets">
          <v-list-item-icon>
            <v-icon>mdi-paw</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Pets</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="signOut">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Sign out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center" id="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { store } from "./store/index";

export default {
  name: "App",
  store,
  data: () => ({}),
  methods: {
    checkAccessToken() {
      if (this.$store.getters.accessToken === "") {
        if (this.$router.currentRoute.path === "/sign-up") {
          return;
        }
        if (this.$router.currentRoute.path === "/verify") {
          return;
        }
        if (this.$router.currentRoute.path === "/") {
          return;
        }
        this.$router.push("/");
      }

      // if (
      //   (this.$store.getters.accessToken !== "" &&
      //     this.$router.currentRoute.path === "/sign-up") ||
      //   (this.$store.getters.accessToken !== "" &&
      //     this.$router.currentRoute.path === "/verify") ||
      //   (this.$store.getters.accessToken !== "" &&
      //     this.$router.currentRoute.path === "/")
      // ) {
      //   this.$router.push("/");
      // }
    },
    users() {
      this.$router.push("/manage_users");
    },
    pets() {
      this.$router.push("/manage_pet");
    },
    signOut() {
      this.$store.commit("setAccessToken", "");
      this.$store.commit("setUsername", "");
      this.$store.commit("setCheck", false);
      this.$router.push("/");
    },
  },
  mounted() {
    this.checkAccessToken();
  },
};
</script>

<style scoped>
#main {
  margin-left: 56px;
}
</style>