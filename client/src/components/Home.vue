<template>
  <v-container class="text-xs-center" fluid grid-list-md>

  <!-- <v-layout row="row" wrap="wrap" v-if="error && !loading">
    <v-flex xs12>
      <app-alert class="Alert" v-if="!isSignUpAlert" @dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message"></app-alert>
    </v-flex>
  </v-layout> -->

  <!-- Explore Products Button -->
  <v-layout row="row" wrap="wrap" v-if="!loading">
    <v-flex xs12>
      <v-btn class="darken-4 purple" to="/products" large dark>
        Explore Products
      </v-btn>
    </v-flex>
  </v-layout>

  <!-- Spinner -->
  <v-layout>
    <v-flex xs12>
      <v-progress-circular indeterminate="indeterminate" color="purple" :width="7" :size="70" v-if="loading"></v-progress-circular>
    </v-flex>
  </v-layout>

  <!-- Products Carousel  -->
  <v-layout row wrap v-if="!loading">
    <v-flex xs12>
      <v-carousel v-bind="{ 'cycle': cycleCarousel }" interval="3000" delimiter-icon="home" id="carousel" lazy>
        <v-carousel-item @mouseover="toggleCarousel" @mouseout="toggleCarousel">
          <h1 id="carousel__title">Hello</h1>
        </v-carousel-item>
      </v-carousel>


      <div id="info-card" v-if="!userAuth">
        <v-layout row>
          <v-flex xs12>
            <h1><span class="font-weight-black">Love</span> Your Home</h1>
            <h2>Find the best curated furniture and home accessories here</h2>
          </v-flex>
        </v-layout>
      </div>

      <v-container v-if="!userAuth">

        <v-layout row wrap v-if="!error">
          <v-flex xs12 sm6 offset-sm3>
            <h1>Let's Get Started</h1>
            <h3>Sign up to save your favorites</h3>
          </v-flex>
        </v-layout>

        <!-- Form Error Message  -->

        <!-- <v-layout row="row" wrap="wrap" v-if="error && !loading">
          <v-flex xs12="xs12" sm6="sm6" offset-sm3="offset-sm3">
            <app-alert @dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message"></app-alert>
          </v-flex>
        </v-layout> -->

        <!-- Signup Form -->
        <v-layout row wrap>
          <v-flex xs12 sm6 offset-sm3>
            <v-card class="mt-4 mb-5" dark>
              <v-card-text>
                <v-container>
                  <form @submit.prevent="onSignup">
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field name="username" label="Username" v-model="username" type="text" prepend-icon="face" required="required"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field name="email" label="Email" v-model="email" type="email" prepend-icon="email" required="required"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field name="password" label="Password" v-model="password" prepend-icon="extension" type="password" required="required"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12="xs12">
                        <v-text-field name="passwordConfirmation" label="Confirm Password" v-model="passwordConfirmation" type="password" prepend-icon="gavel" :rules="[comparePasswords]" required="required"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-btn color="pink darken-2" dark type="submit" :disabled="loading" :loading="loading">Let's Go!<span class="custom-loader" slot="loader">
                            <v-icon light="light">cached</v-icon></span></v-btn>
                      </v-flex>
                    </v-layout>
                  </form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>


      </v-container>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { GET_BOOKS } from "../queries";

export default {
  name: "Home",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      loading: false,
      userAuth: false,
      error: false,
      cycleCarousel: false
    };
  },
  computed: {
    comparePasswords() {
      if (this.password !== this.passwordConfirmation) {
        return "Passwords do not match";
      } else {
        return false;
      }
    }
  },
  methods: {
    onSignup() {
      // this.$store.dispatch('onSignup', {
      //   username: this.username,
      //   email: this.email,
      //   password: this.password
      // });
      this.$apollo.query({ query: GET_BOOKS }).then(res => console.log(res));
    },
    toggleCarousel() {
      this.cycleCarousel = !this.cycleCarousel;
    }
  }
};
</script>

<style scoped>
#carousel {
  cursor: pointer;
  animation-play-state: paused;
}

#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  bottom: 50px;
  padding: 0.5em;
  margin: 0 auto;
  left: 0;
  right: 0;
}

#info-card {
  color: white;
  margin: 5em 0 3em 0;
  padding: 3em;
  background-color: purple;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 35px,
    rgba(255, 255, 255, 0.25) 35px,
    rgba(255, 255, 255, 0.25) 70px
  );
  background-size: 100%;
  /* transition: 5000ms; */
}

@media screen and (max-width: 500px) {
  #carousel {
    height: 60vh;
  }
  h1 {
    font-size: 1.7rem;
  }
}
</style>

