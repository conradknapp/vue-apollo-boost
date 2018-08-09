<template>
  <v-container class="text-xs-center">
    <v-flex sm6 offset-sm3>
      <v-card color="secondary" class="white--text">
        <v-layout>
          <v-flex xs5>
            <v-card-media :src="user.avatar" height="125px" contain></v-card-media>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Join Date: {{user.joinDate}}</div>
                <div>Favorites: {{user.favorites.length}}</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-card-actions>
          <v-flex class="pl-3" xs12>
            <v-switch dark label="Toggle Profile Card" v-model="switch1"></v-switch>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-layout row wrap v-if="!userFavorites.length">
      <v-flex xs12>
        <h2>You have no favorites currently. Go and add some!</h2>
      </v-flex>
    </v-layout>
    <v-layout class="mt-5" row v-else>
      <v-flex xs12>
        <h2>Favorited: {{userFavorites.length}}</h2>
      </v-flex>
    </v-layout>
    <v-layout class="favorites__container">
      <v-flex v-for="favorite in userFavorites" :key="favorite.title">
        <v-card hover>
          <v-card-media style="cursor: pointer" @click="goToProduct(favorite._id)" :src="favorite.imageUrl" height="200px" min-width="100px"></v-card-media>
          <v-card-text>{{favorite.title}}</v-card-text>
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
      switch1: false
    };
  },
  computed: {
    ...mapGetters(["user", "error", "loading", "products", "userFavorites"])
  },
  // watch: {
  //   user(value) {
  //     if (value !== null && value !== undefined) {
  //       this.$router.push('/')
  //     }
  //   }
  // },
  methods: {
    goToProduct(id) {
      this.$store.dispatch("getProduct", id);
      this.$router.push(`/products/${id}`);
    }
  }
};
</script>

<style>
.favorites__container {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em;
}

@media screen and (min-width: 500px) {
  .favorites__container {
    grid-template-columns: 1fr 1fr;
  }
}
</style>