<template>
  <v-container mt-5 pt-5 class="text-xs-center" flexbox center>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3>
      <h1>Welcome Back!</h1>
    </v-flex>
  </v-layout>

  <!-- Error Alert -->
  <v-layout row v-if="error">
    <v-flex xs12 sm6 offset-sm3>
      <form-alert @dismiss="onDismiss" :text="error.message" :color="error.color"></form-alert>
    </v-flex>
  </v-layout>

  <!-- Signin Form -->
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3>
      <v-card color="secondary" dark>
        <v-card-text>
          <v-container>
            <form @submit.prevent="handleSignin">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field name="username" prepend-icon="face" label="Username" v-model.trim="username" type="text" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field name="password" label="Password" v-model.trim="password" prepend-icon="extension" type="password" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit" :disabled="loading" :loading="loading" color="orange">Sign in<span class="custom-loader" slot="loader">
                      <v-icon light>cached</v-icon></span></v-btn>
                  <h3>Don't have an account?
                    <router-link to="/signup">Sign up</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters(["user", "loading", "error"])
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSignin() {
      this.$store.dispatch("signinUser", {
        username: this.username,
        password: this.password
      });
    },
    onDismiss() {
      this.$store.commit("clearError");
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>