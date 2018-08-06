<template>
  <v-container grid-list-md>

    <!-- Layout Buttons -->
    <v-layout class="hidden-xs-only" row wrap>
      <v-flex xs12>
        <v-tooltip bottom>
          <span>Row layout</span>
          <v-btn icon slot="activator" @click="mozaicLayout = false">
            <v-icon :color="mozaicLayout ? 'grey' : 'primary'">view_headline</v-icon>
          </v-btn>
        </v-tooltip>
        <v-tooltip bottom>
          <span>Mozaic layout</span>
          <v-btn icon slot="activator" @click="mozaicLayout = true">
            <v-icon :color="mozaicLayout ? 'primary' : 'grey'">view_quilt</v-icon>
          </v-btn>
        </v-tooltip>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-if="productsPage">
      <v-flex xs12 v-bind="{ [`sm${mozaicLayout && index % 3 === 0 ? 12 : 6}`]: true }" v-for="(product, index) in productsPage.products" :key="product._id" hover>
        <v-card class="mt-3 ml-1 mr-2" hover>
          <v-card-media lazy :src="product.imageUrl" :key="product._id" @click="goToProduct(product._id)" tag="button" height="40vh">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 flexbox>
                  <span class="product__title headline" v-text="product.title"></span>

                  <v-btn icon x-large v-if="user" @click="handleToggleLike(product)">
                    <v-icon color="red darken-4" x-large v-if="userFavorites.includes(product._id)">favorite</v-icon>
                    <v-icon color="grey" x-large v-else>favorite</v-icon>
                  </v-btn>
                  <v-btn icon x-large v-if="!user">
                    <v-icon color="grey" x-large>favorite</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Show More Button (Optional) -->
    <!-- <v-btn @click="showMore" v-if="showMoreEnabled">Fetch More</v-btn> -->

    <!-- Page Up Button -->
    <v-layout v-if="pageUpButton">
      <v-flex>
        <v-btn color="info" @click="goToTop" dark fixed bottom right fab>
          <v-icon>navigation</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- Product Skeleton Component -->
    <skeleton v-show="loading"></skeleton>

    <!-- Text if No Remaining Products -->
    <v-layout v-if="!loading && (productsPage && !productsPage.hasMore)">
      <v-flex class="text-xs-center mt-5 mb-5" xs12>
        <h1 class="warning--text">You have reached the end
          <v-icon color="warning" class="ml-3" large right>sentiment_very_dissatisfied</v-icon>
        </h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";

import { PRODUCTS_PAGE } from "../../queries";
import skeleton from "../Shared/Skeleton";

const size = 2;

export default {
  components: { skeleton },
  data() {
    return {
      page: 1,
      showMoreEnabled: true,
      mozaicLayout: false,
      pageUpButton: true,
      bottom: false
    };
  },
  apollo: {
    productsPage: {
      query: PRODUCTS_PAGE,
      variables: {
        page: 1,
        size
      }
    }
  },
  computed: {
    ...mapGetters(["products", "loading"]),
    user() {
      this.$store.getters.user != null;
    },
    userFavorites() {
      return this.$store.getters.user.favorites || [];
    }
  },
  watch: {
    bottom(isPageBottom) {
      // if this.bottom evaluates to true
      if (isPageBottom) {
        const throttled = throttle(this.showMore, 500);
        throttled();
      }
    }
  },
  created() {
    // this.handleGetProducts();
    window.addEventListener("scroll", this.showPageUpButton);
    window.addEventListener("scroll", this.checkIfBottom);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.showPageUpButton);
    window.removeEventListener("scroll", this.checkIfBottom);
  },
  methods: {
    handleGetProducts() {
      this.$store.dispatch("getProducts");
    },
    goToTop() {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    },
    goToProduct(id) {
      this.$router.push(`/products/${id}`);
    },
    checkIfBottom() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      // bottom of page if the browser height and amount scrolled are greater or equal to page height
      const bottomOfPage = visible + scrollY >= pageHeight;
      const isBottom = bottomOfPage || pageHeight < visible;
      this.bottom = isBottom;
    },
    showPageUpButton() {
      window.scrollY > 150
        ? (this.pageUpButton = true)
        : (this.pageUpButton = false);
    },
    handleToggleLike(product) {
      if (this.userFavorites.includes(product._id)) {
        this.$store.dispatch("unfavoriteProduct", product._id);
      } else {
        this.$store.dispatch("favoriteProduct", product._id);
      }
    },
    showMore() {
      if (this.productsPage && this.productsPage.hasMore) {
        this.page += 1;
        this.$apollo.queries.productsPage.fetchMore({
          variables: {
            page: this.page,
            size
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            console.log("previousResult", previousResult.productsPage.products);
            console.log("fetchMoreResult", fetchMoreResult);
            const newProducts = fetchMoreResult.productsPage.products;
            const hasMore = fetchMoreResult.productsPage.hasMore;

            this.showMoreEnabled = hasMore;

            return {
              productsPage: {
                __typename: previousResult.productsPage.__typename,
                products: [
                  ...previousResult.productsPage.products,
                  ...newProducts
                ],
                hasMore
              }
            };
          }
        });
      }
    }
  }
};
</script>