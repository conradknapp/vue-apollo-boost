<template>
  <v-container class="text-xs-center" fluid grid-list-md>

    <!-- Explore Posts Button -->
    <v-layout row wrap v-if="!loading">
      <v-flex xs12>
        <v-btn class="secondary" id="posts__button" to="/posts" large dark>
          Explore Posts
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- Loading Spinner -->
    <v-layout row justify-center>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- Posts Carousel  -->
    <v-layout row wrap v-if="!loading">
      <v-flex xs12>
        <v-carousel v-bind="{ 'cycle': cycleCarousel }" interval="3000">
          <v-carousel-item v-for="post in shuffledPosts" :src="post.imageUrl" :key="post._id" @click="goToPost(post._id)" @mouseover="toggleCarousel" @mouseout="toggleCarousel">
            <h1 id="carousel__title" @click="goToPost(post._id)">{{post.title}}</h1>
          </v-carousel-item>
        </v-carousel>

        <!-- Info Card -->
        <div id="info-card" v-if="!user">
          <v-layout row>
            <v-flex xs12>
              <h1>Get
                <span class="font-weight-black">Inspired</span>
              </h1>
              <h2>Browse creative posts from users around the world</h2>
            </v-flex>
          </v-layout>
        </div>

        <v-container v-if="!user">

          <!-- Signup Form Header -->
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
              <v-card class="mt-4 mb-5" color="accent" dark>
                <v-card-text>
                  <v-container>
                    <v-form @submit.prevent="handleSignup" ref="form" v-model="isFormValid" lazy-validation>
                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field label="Username" v-model="username" type="text" prepend-icon="face" :rules="usernameRules" required></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field label="Email" v-model="email" type="email" :rules="emailRules" prepend-icon="email" required></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field label="Password" v-model="password" :rules="comparePasswords" prepend-icon="extension" type="password" required></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field name="passwordConfirmation" label="Confirm Password" v-model="passwordConfirmation" type="password" prepend-icon="gavel" :rules="comparePasswords" required></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs12>
                          <v-btn color="info" dark type="submit" :disabled="!isFormValid || loading" :loading="loading">Let's Go!
                            <v-icon dark right>check_circle</v-icon>
                            <span class="custom-loader" slot="loader">
                              <v-icon light>cached</v-icon>
                            </span>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-form>
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
      cycleCarousel: true,
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        name => !!name || "Name is required",
        name => name.length < 10 || "Name must be less than 10 characters"
      ],
      emailRules: [
        email => !!email || "E-mail is required",
        email => /.+@.+/.test(email) || "E-mail must be valid"
      ],
      comparePasswords: [
        password => !!password || "Password is required",
        password => password === this.password || "Passwords must be equal"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "error", "shuffledPosts"]),
    user() {
      return this.$store.getters.user != null;
    }
  },
  created() {
    this.handleGetCarouselPosts();
  },
  methods: {
    handleGetCarouselPosts() {
      this.$store.dispatch("getPosts", {
        size: 3
      });
    },
    handleDismiss() {
      this.$store.commit("clearError");
    },
    handleSignup() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signupUser", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    },
    goToPost(id) {
      this.$router.push(`/posts/${id}`);
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
  h2 {
    font-size: 1.4rem;
  }
}
</style>

