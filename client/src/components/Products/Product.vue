<template>
  <v-container class="mt-5 mb-5" flexbox center>

  <v-layout row justify-center>
      <v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

  <v-layout row wrap v-if="!loading">
    <v-flex xs12>
      <v-card hover>
        <v-card-title>
          <h1>{{product.title}}</h1>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" @click="goBack">
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </v-card-title>
        <v-tooltip right><span>Click to enlarge image</span>
          <v-card-media slot="activator" @click="togglePictureDialog" :src="product.imageUrl" id="product__image">
            <v-btn icon x-large v-if="user" @mouseenter="mouseEnterHeart = true" @mouseleave="mouseEnterHeart = false" @click="onAgree">
              <v-icon color="red darken-4" x-large v-if="onProductLiked">favorite</v-icon>
              <v-icon color="grey" x-large v-else>favorite</v-icon>
            </v-btn>
            <v-btn icon x-large v-if="!user" @click="onUnAuthFave">
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

  <!-- Editor Component -->
  <v-layout row wrap v-if="user">
    <wysiwyg v-model="content" />
  </v-layout>

</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["_id"],
  data() {
    return {
      dialog: false,
      content: "",
      unAuthFave: false,
      mouseEnterHeart: false
    };
  },
  computed: {
    ...mapGetters(["user", "loading", "product"]),
    user() {
      return this.$store.getters.user != null;
    }
    // userIsCreator() {
    //   if (!this.user) {
    //     return false
    //   }
    //   return this.$store.getters.user.id === this.product.creatorId
    // },
    // onProductLiked() {
    //   return this.$store.getters.user.favoritedProducts.includes(
    //     this.product._id
    //   );
    // },
  },
  watch: {
    $route() {
      this.handleGetProduct();
    }
  },
  created() {
    this.handleGetProduct();
  },
  methods: {
    handleGetProduct() {
      this.$store.dispatch("getProduct", this._id);
    },
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
.loading-dialog {
  background-color: #303030;
}

#product__image {
  height: 200px;
  width: 100%;
  object-fit: contain;
}

@media screen and (min-width: 350px) {
  #product__image {
    height: 180px !important;
  }
}
@media screen and (min-width: 400px) {
  #product__image {
    height: 230px !important;
  }
}
@media screen and (min-width: 550px) {
  #product__image {
    font-size: 2rem;
    height: 300px !important;
  }
}
@media screen and (min-width: 630px) {
  #product__image {
    height: 400px !important;
  }
}
@media screen and (min-width: 800px) {
  #product__image {
    height: 500px !important;
  }
}
</style>