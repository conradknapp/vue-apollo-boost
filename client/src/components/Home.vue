<template>
  <v-container class="text-xs-center" fluid grid-list-md>

  <!-- Explore Products Button -->
  <v-layout row wrap v-if="!loading">
    <v-flex xs12>
      <v-btn class="primary" id="products__button" to="/products" large dark>
        Explore Products
      </v-btn>
    </v-flex>
  </v-layout>

  <!-- Loading Spinner -->
  <v-layout row justify-center>
      <v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

  <!-- Products Carousel  -->
  <v-layout row wrap v-if="!loading">
    <v-flex xs12>
      <v-carousel v-bind="{ 'cycle': cycleCarousel }" interval="3000" delimiter-icon="home" id="carousel">
        <v-carousel-item v-for="product in shuffledProducts" :src="product.imageUrl" :key="product._id" @click="goToProduct(product._id)" @mouseover="toggleCarousel" @mouseout="toggleCarousel">
          <h1 id="carousel__title" @click="goToProduct(product._id)">{{product.title}}</h1>
        </v-carousel-item>
      </v-carousel>


      <div id="info-card" v-if="!user">
        <v-layout row>
          <v-flex xs12>
            <h1><span class="font-weight-black">Love</span> Your Home</h1>
            <h2>Find the best curated furniture and home accessories here</h2>
          </v-flex>
        </v-layout>
      </div>

      <v-container v-if="!user">

        <v-layout row wrap v-if="!error">
          <v-flex xs12 sm6 offset-sm3>
            <h1>Let's Get Started</h1>
            <h3>Sign up to save your favorites</h3>
          </v-flex>
        </v-layout>

        <!-- Form Error Message  -->

        <v-layout row wrap v-if="error && !loading">
          <v-flex xs12 sm6 offset-sm3>
            <form-alert @dismiss="handleDismiss" :icon="error.icon" :color="error.color" :text="error.message"></form-alert>
          </v-flex>
        </v-layout>

        <!-- Signup Form -->
        <v-layout row wrap>
          <v-flex xs12 sm6 offset-sm3>
            <v-card class="mt-4 mb-5" dark>
              <v-card-text>
                <v-container>
                  <form @submit.prevent="handleSignup">
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field name="username" label="Username" v-model.trim="username" type="text" prepend-icon="face" required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field name="email" label="Email" v-model.trim="email" type="email" prepend-icon="email" required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field name="password" label="Password" v-model.trim="password" prepend-icon="extension" type="password" required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field name="passwordConfirmation" label="Confirm Password" v-model.trim="passwordConfirmation" type="password" prepend-icon="gavel" :rules="[comparePasswords]" required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-btn color="accent" dark type="submit" :disabled="loading" :loading="loading">Let's Go!<span class="custom-loader" slot="loader">
                            <v-icon light>cached</v-icon></span></v-btn>
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
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      cycleCarousel: true
    };
  },
  computed: {
    ...mapGetters(["loading", "error", "shuffledProducts"]),
    user() {
      return this.$store.getters.user != null;
    },
    comparePasswords() {
      if (this.password !== this.passwordConfirmation) {
        return "Passwords do not match";
      } else {
        return false;
      }
    }
  },
  created() {
    this.handleGetCarouselProducts();
  },
  methods: {
    handleGetCarouselProducts() {
      this.$store.dispatch("getProducts", 3);
    },
    handleDismiss() {
      this.$store.commit("clearError");
    },
    handleSignup() {
      this.$store.dispatch("signupUser", {
        username: this.username,
        email: this.email,
        password: this.password
      });
    },
    goToProduct(id) {
      console.log(id);
      this.$router.push(`/products/${id}`);
    },
    toggleCarousel() {
      this.cycleCarousel = !this.cycleCarousel;
    }
  }
};
</script>

<style scoped>
.loading-dialog {
  background-color: #303030;
}

h1 {
  font-weight: 100;
  font-size: 2.5rem;
}

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

@media screen and (max-width: 500px) {
  #carousel {
    height: 60vh;
  }
  h1 {
    font-size: 1.7rem;
  }
}
</style>

