<template>
<v-container class="text-xs-center" flexbox center>
  <v-layout row wrap v-if="!error">
    <v-flex xs12 sm6 offset-sm3>
      <h1>Get started here</h1>
    </v-flex>
  </v-layout>
  <v-layout row v-if="error">
    <v-flex xs12 sm6 offset-sm3>

      <!-- <app-alert @dismissed="onDismissed" :text="error.message" :submessage="error.submessage" :color="error.color" :icon="error.icon"></app-alert> -->
    </v-flex>
  </v-layout>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-text>
          <v-container>
            <form @submit.prevent="onSignup">
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
                  <v-btn color="blue" dark type="submit" :disabled="loading" :loading="loading">Sign Up<span class="custom-loader" slot="loader">
                      <v-icon light="light">cached</v-icon></span></v-btn>
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
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  },
  computed: {
    comparePasswords() {
      if (this.password !== this.passwordConfirmation) {
        return 'Passwords do not match';
      } else {
        return false
      }
    },
    user() {
      return this.$store.getters.user
    },
    error() {
      return this.$store.getters.error
    },
    loading() {
      return this.$store.getters.loading
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/');
      }
    }
  },
  methods: {
    onSignup() {
      this.$store.dispatch('onSignup', {
        email: this.email,
        password: this.password
      });
    },
    onDismissed() {
      this.$store.dispatch('clearError');
    }
  }
}
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