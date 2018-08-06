<template>
  <v-container mt-5 pt-5 class="text-xs-center" flexbox center>
    <v-layout row wrap v-if="!error">
      <v-flex xs12 sm6 offset-sm3>
        <h1>Get started here</h1>
      </v-flex>
    </v-layout>

    <!-- Error Alert -->
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <form-alert @dismiss="handleDismiss" :color="error.color" :text="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="accent" dark>
          <v-card-text>
            <v-container>
              <form @submit.prevent="handleSignup">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="username" label="Username" v-model="username" type="text" prepend-icon="face" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email" label="Email" v-model="email" type="email" prepend-icon="email" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="password" label="Password" v-model="password" prepend-icon="extension" type="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="passwordConfirmation" label="Confirm Password" v-model="passwordConfirmation" type="password" prepend-icon="gavel" :rules="[comparePasswords]" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn color="info" dark type="submit" :disabled="loading" :loading="loading">Sign Up
                      <span class="custom-loader" slot="loader">
                        <v-icon light="light">cached</v-icon>
                      </span>
                    </v-btn>
                    <h3>Already have an account?
                      <router-link to="/signin">Sign in</router-link>
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
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    };
  },
  computed: {
    ...mapGetters(["user", "error", "loading"]),
    comparePasswords() {
      if (this.password !== this.passwordConfirmation) {
        return "Passwords do not match";
      } else {
        return false;
      }
    }
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSignup() {
      this.$store.dispatch("signupUser", {
        username: this.username,
        email: this.email,
        password: this.password
      });
    },
    handleDismiss() {
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