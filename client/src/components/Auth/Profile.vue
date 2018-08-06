<template>
  <v-container class="text-xs-center">
  <v-layout row wrap v-if="!user.favorites">
    <v-flex xs12>
      <h2>You have no favorites currently. Go and add some!</h2>
    </v-flex>
  </v-layout>
  <v-layout class="mt-5" row v-else>
    <v-flex xs12>
      <h2>Favorited: {{user.favorites.length}}</h2>
    </v-flex>
  </v-layout>
  <v-layout class="favorites__container">
    <v-flex v-for="favorite in user.favorites" :key="favorite.title">
      <v-card hover>
        <v-card-media style="cursor: pointer" @click="goToProduct(favorite._id)" :src="favorite.imageUrl" height="200px" min-width="100px"></v-card-media>
        <v-card-text>{{favorite.title}}</v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user', 'error', 'loading', 'products'])
    // userFavorites() {
    //   return this.$store.getters.user.favorites
    // }
  },
  // watch: {
  //   user(value) {
  //     if (value !== null && value !== undefined) {
  //       this.$router.push('/')
  //     }
  //   }
  // },
  created() {
    this.handleGetProducts();
  },
  methods: {
    handleGetProducts() {
      this.$store.dispatch('getProducts');
    },
    goToProduct(id) {
      this.$store.dispatch('loadProduct', id)
      this.$router.push(`/products/${id}`)
    }
  }
}
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