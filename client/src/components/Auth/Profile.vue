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
                <div>Joined {{formatJoinDate(user.joinDate)}}</div>
                <div class='hidden-xs-only font-weight-thin'>{{user.favorites.length}} Favorites</div>
                <div class='hidden-xs-only font-weight-thin'>{{userProducts.length}} Products Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-card-actions>
          <v-flex class="pl-3" xs12>
            <v-btn flat color="primary" @click="handleChangeAvatar">Change Avatar</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-layout row wrap v-if="!userFavorites.length">
      <v-flex xs12>
        <h2>You have no favorites currently. Go and add some!</h2>
      </v-flex>
    </v-layout>
    <v-container class="mt-3" row v-else>
      <v-flex xs12>
        <h2>Favorited: {{userFavorites.length}}</h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-card-media lazy style="cursor: pointer" @click="goToProduct(favorite._id)" tag="button" height="30vh" :src="favorite.imageUrl"></v-card-media>
            <v-card-text>{{favorite.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Products Created By User -->
    <v-layout row wrap v-if="!userProducts.length">
      <v-flex xs12>
        <h2>You have no products currently. Go and add some!</h2>
      </v-flex>
    </v-layout>
    <v-container class="mt-3" row v-else>
      <v-flex xs12>
        <h2>Your Products: {{userProducts.length}}</h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="product in userProducts" :key="product._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-card-media lazy style="cursor: pointer" @click="goToProduct(product._id)" tag="button" height="30vh" :src="product.imageUrl"></v-card-media>
            <v-card-text>{{product.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </v-container>
</template>


<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "Profile",
  computed: {
    ...mapGetters(["loading", "error", "user", "userProducts", "userFavorites"])
  },
  created() {
    this.handleGetUserProducts();
  },
  methods: {
    handleGetUserProducts() {
      this.$store.dispatch("getUserProducts", {
        userId: this.user._id
      });
    },
    goToProduct(id) {
      this.$router.push(`/products/${id}`);
    },
    formatJoinDate(date) {
      return moment(new Date(date)).format("ll");
    },
    handleChangeAvatar() {
      console.log("changing avatar");
    }
  }
};
</script>