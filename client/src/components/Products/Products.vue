<template>
<v-container class="pt-5 mt-5" grid-list-md>

  <!-- Layout Buttons -->
  <v-layout class="hidden-xs-only" row wrap>
    <v-flex xs12>
      <v-tooltip bottom><span>Row layout</span>
        <v-btn icon slot="activator" @click="layoutButtonActive = false">
          <v-icon :color="!layoutButtonActive ? 'purple darken-3' : ''">view_headline</v-icon>
        </v-btn>
      </v-tooltip>
      <v-tooltip bottom><span>Mozaic layout</span>
        <v-btn icon slot="activator" @click="layoutButtonActive = true">
          <v-icon :color="layoutButtonActive ? 'purple darken-3' : ''">view_quilt</v-icon>
        </v-btn>
      </v-tooltip>
    </v-flex>
  </v-layout>


  <v-layout row wrap>
    <v-flex xs12 v-bind="{ [`sm${layoutButtonActive ? product.flex : 6}`]: true }" v-for="product in products" :key="product._id" hover="hover" @mouseenter="showDescription(product)" @mouseleave="description = null">
      <v-card class="mt-3 ml-1 mr-2" hover>
        <v-card-media lazy :src="product.imageUrl" :key="product._id" @click="goToProduct(product._id)" tag="button" height="40vh">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="Product__Title headline" v-text="product.title"></span>
                <span class="Product__Description" v-if="product.description === description" v-text="showFirstSentence(description)"></span>
                <div>
                  <v-btn icon x-large v-if="userAuth" @mouseenter="mouseInHeart = true" @mouseleave="mouseInHeart = false" @click="toggleLike(product)">
                    <v-icon color="red darken-4" x-large v-if="userFavorites.includes(product._id)">favorite</v-icon>
                    <v-icon color="grey" x-large v-else>favorite</v-icon>
                  </v-btn>
                  <v-btn icon x-large v-if="!userAuth" @click="onUnAuthFave">
                    <v-icon color="grey" x-large>favorite</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
      </v-card>
    </v-flex>
  </v-layout>

  <!-- Page Up Button -->
  <v-layout v-if="pageUpButton">
    <v-flex>
      <v-btn color="grey darken-2" @click="backToTop" dark fixed bottom right fab>
        <v-icon>navigation</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>

  <!-- Product Skeleton Component -->
  <!-- <product-skeleton v-show="loading && !bottom"></product-skeleton> -->

  <v-layout v-if="!loading">
    <v-flex class="text-xs-center mt-5 mb-5" xs12>
      <h1>You have reached the end
        <v-icon class="ml-3" large right>sentiment_very_dissatisfied</v-icon>
      </h1>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  data() {
    return {
      layoutButtonActive: false,
      pageUpButton: false,
      description: null,
      userAuth: false,
      // mouseInHeart: false,
      unAuthFave: false,
      bottom: false
    };
  },
  computed: {
    products() {
      return this.$store.getters.products;
    },
    loading() {
      return this.$store.getters.loading;
    }
    // userIsAuthenticated() {
    //   return this.$store.getters.user !== null &&
    //   this.$store.getters.user !== undefined
    // },
    // userIsCreator() {
    //   if (!this.userIsAuthenticated) {
    //     return false
    //   }
    //   return this.$store.getters.user.id === this.product.creatorId
    // },
    // userFavorites() {
    //   return this.$store.getters.user.favoritedProducts
    // },
    // resultsLog() {
    //   return this.$store.getters.resultsLog
    // }
  },
  // watch: {
  //   bottom(bottomOfPage) {
  //     if (bottomOfPage && !this.resultsLog) {
  //       const throttled = throttle(this.infiniteScroll, 500);
  //       throttled();
  //     }
  //   }
  // },
  created() {
    window.addEventListener("scroll", () => {
      window.scrollY > 150
        ? (this.pageUpButton = true)
        : (this.pageUpButton = false);
    });
    window.addEventListener("scroll", () => {
      this.bottom = this.bottomVisible();
    });
    // this.$store.dispatch("setResultsLog", false);
  },
  mounted() {
    this.getAllProducts();
  },
  methods: {
    getAllProducts() {
      this.$store.dispatch("onGetAllProducts");
    },
    // infiniteScroll() {
    //   this.$store.dispatch('infiniteScroll')
    // },
    backToTop() {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    },
    goToProduct(id) {
      this.$router.push(`/products/${id}`);
      // if (!this.unAuthFave && !this.mouseInHeart) {
      //   this.$router.push(`/products/${id}`)
      // }
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY >= pageHeight;
      return bottomOfPage || pageHeight < visible;
    },
    showDescription(product) {
      if (this.products.find(el => el._id === product._id)) {
        this.description = product.description;
      }
    },
    onUnAuthFave() {
      this.unAuthFave = true;
      setTimeout(() => this.$router.push("/signup"), 1000);
      setTimeout(
        () =>
          this.$store.dispatch("unAuthUserClick", {
            message: `Sign up to save all your favorites 💖`,
            submessage: `(it only takes a second ⏱)`,
            icon: "info",
            color: "info"
          }),
        1500
      );
    },
    // toggleLike(product) {
    //   if (this.userFavorites.includes(product.id)) {
    //     this.$store.dispatch('unfavoriteProduct', product.id)
    //   } else {
    //     this.$store.dispatch('favoriteProduct', product.id)
    //   }
    // },
    showFirstSentence(description) {
      return description.match(/^[^.]+/)[0];
    }
  }
};
</script>

<style>
.Product__Title {
  color: white;
  background: rgba(0, 0, 0, 0.3);
  font-weight: 400;
  padding: 0.1em;
}
.Product__Title:hover {
  background: rgba(87, 6, 104, 0.3);
}
.Product__Description {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.1rem;
  padding: 1em;
  text-align: center;
  pointer-events: none;
  animation: showDescription 0.1s ease-in-out forwards;
}
.Product__Description:hover {
  background-color: rgba(74, 20, 140, 0.4);
}
@keyframes showDescription {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  50% {
    opacity: 0.75;
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>