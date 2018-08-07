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
              <v-form @submit.prevent="handleSignin" ref="form" v-model="isFormValid" lazy-validation>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field prepend-icon="face" label="Username" v-model.trim="username" type="text" :rules="usernameRules" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Password" v-model.trim="password" prepend-icon="extension" type="password" :rules="passwordRules" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit" :disabled="!isFormValid || loading" :loading="loading" color="accent">Sign in
                      <span class="custom-loader" slot="loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                    <h3>Don't have an account?
                      <router-link to="/signup">Sign up</router-link>
                    </h3>
                  </v-flex>
                </v-layout>
              </v-form>
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
      isFormValid: true,
      username: "",
      password: "",
      usernameRules: [username => !!username || "Username is required"],
      passwordRules: [password => !!password || "Password is required"]
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
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password
        });
      }
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