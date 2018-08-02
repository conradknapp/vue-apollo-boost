<template>
  <v-container class="mt-5 mb-5" flexbox center>
  <v-layout row wrap v-if="loading">
    <v-flex class="text-xs-center" xs12>
      <v-progress-circular indeterminate color="purple" :width="7" :size="70" v-if="loading"></v-progress-circular>
    </v-flex>
  </v-layout>

  <v-layout row wrap v-if="!loading">
    <v-flex xs12>
      <v-card hover>
        <v-card-title>
          <h1 class="Product__Title">{{product.title}}</h1>
          <v-spacer></v-spacer>
          <v-btn dark color="purple darken-4" @click="goBack">
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </v-card-title>
        <v-tooltip right><span>Click to enlarge image</span>
          <v-card-media slot="activator" @click="togglePictureDialog" :src="product.imageUrl" style="height: 200px; width: 100%; object-fit: contain;" id="media">
            <!-- <heart-flutter v-if="unAuthFave && !isAnimating" id="heart-flutter"></heart-flutter>
            <heart-flutter v-if="heartLoading && !isAnimating" id="heart-flutter"></heart-flutter> -->
            <v-btn icon x-large v-if="userAuth" @mouseenter="mouseEnterHeart = true" @mouseleave="mouseEnterHeart = false" @click="onAgree">
              <v-icon color="red darken-4" x-large v-if="onProductLiked">favorite</v-icon>
              <v-icon color="grey" x-large="x-large" v-else>favorite</v-icon>
            </v-btn>
            <v-btn icon x-large v-if="!userAuth" @click="onUnAuthFave">
              <v-icon x-large color="grey">favorite</v-icon>
            </v-btn>
          </v-card-media>
        </v-tooltip>
        <v-dialog v-model="dialog">
          <v-card>
            <v-card-media :src="product.imageUrl" height="500px"></v-card-media>
          </v-card>
        </v-dialog>
        <v-card-text>
          <p>{{product.description}}</p>
        </v-card-text>
        <!-- <v-card-actions>
          <v-btn class="deep-purple darken-2" flat dark round :href="link.linkUrl" v-for="link in product.links" :key="link.linkTitle">{{link.linkTitle}}</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  props: ["_id"],
  data() {
    return {
      dialog: false,
      unAuthFave: false,
      mouseEnterHeart: false,
      isAnimating: false
    };
  },
  computed: {
    // product() {
    //   return this.$store.getters.product(this._id);
    // },
    loading() {
      return this.$store.getters.loading;
    },
    // heartLoading() {
    //   return this.$store.getters.heartLoading
    // },
    userAuth() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    // userIsCreator() {
    //   if (!this.userAuth) {
    //     return false
    //   }
    //   return this.$store.getters.user.id === this.product.creatorId
    // },
    // onProductLiked() {
    //   return this.$store.getters.user.favoritedProducts.includes(
    //     this.product._id
    //   );
    // },
    product() {
      return this.$store.getters.product;
    }
  },
  created() {
    this.$store.dispatch("onGetProduct", this._id);
  },
  methods: {
    // onAgree() {
    //   if (this.onProductLiked) {
    //     if (window.scrollY > 25) {
    //      this.isAnimating = true
    //     }
    //     this.$store.dispatch('unfavoriteProduct', this.product.id)
    //   } else {
    //     if (window.scrollY > 25) {
    //       this.isAnimating = true
    //     }
    //     this.$store.dispatch('favoriteProduct', this.product.id)
    //   }
    // },
    onUnAuthFave() {
      console.log("fave");
      // if (scrollY > 25) {
      //  this.isAnimating = true
      //  this.unAuthFave = true
      // }
      // this.unAuthFave = true
      // setTimeout(() => this.$router.push('/signup'), 1000)
      // setTimeout(() => this.$store.dispatch('unAuthUserClick', {message: `Sign up to save all your favorites 💖`, submessage: `(it only takes a second ⏱)`, icon: 'info', color: "info"}), 1500)
    },
    togglePictureDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
      // if (window.innerWidth > 500 && !this.unAuthFave && !this.mouseEnterHeart) {
      //   this.dialog = !this.dialog
      // }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
  /* #heart-flutter {
    transform: translateY(-100px);
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 99;
  } */
  @media screen and (min-width: 350px) {
    #media {
      height: 180px !important;
    }
  }
  @media screen and (min-width: 400px) {
    #media {
      height: 230px !important;
    }
  }
  @media screen and (min-width: 550px) {
    #media {
      font-size: 2rem;
      height: 300px !important;
    }
  }
  @media screen and (min-width: 630px) {
    #media {
      height: 400px !important;
    }
  }
  @media screen and (min-width: 800px) {
    #media {
      height: 500px !important;
    }
  }
</style>