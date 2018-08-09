<template>
  <v-container v-scroll="onScroll" grid-list-md>

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

    <!-- Product Cards -->
    <v-layout row wrap v-if="productsPage">
      <v-flex xs12 v-bind="{ [`sm${mozaicLayout && index % 3 === 0 ? 12 : 6}`]: true }" v-for="(product, index) in productsPage.products" :key="product._id" hover>
        <v-card class="mt-3 ml-1 mr-2" hover>
          <v-card-media lazy :src="product.imageUrl" :key="product._id" @click="goToProduct(product._id)" tag="button" height="30vh">
          </v-card-media>
          <v-card-actions>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{product.title}}</div>
                <span class="grey--text">{{product.likes}} likes • {{product.messages.length}} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showCreator = !showCreator">
              <v-icon>{{`keyboard_arrow_${showCreator ? 'down' : 'up'}`}}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-slide-y-transition>
            <v-card-text v-show="showCreator" class="grey lighten-4">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="product.createdBy.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{product.createdBy.username}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{product.createdDate}}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-card-text>
          </v-slide-y-transition>

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
    <v-layout v-if="!loading && !showMoreEnabled">
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
      mozaicLayout: false,
      showCreator: false,
      pageUpButton: false,
      isBottom: false,
      amountScrolled: 0
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
    ...mapGetters(["products", "loading", "userFavorites"]),
    user() {
      return this.$store.getters.user != null;
    },
    productComments() {
      return this.product && this.product.comments;
    },
    showMoreEnabled() {
      return this.productsPage && this.productsPage.hasMore;
    }
  },
  watch: {
    isBottom(value) {
      // if this.bottom evaluates to true
      if (value) {
        const throttled = throttle(this.showMore, 250);
        throttled();
      }
    }
  },
  methods: {
    handleGetProducts() {
      this.$store.dispatch("getProducts");
    },
    onScroll() {
      this.checkIfPageBottom();
      this.showPageUpButton();
    },
    showPageUpButton() {
      this.amountScrolled = window.scrollY;
      this.pageUpButton = this.amountScrolled > 250;
    },
    goToTop() {
      window.scroll({ top: 0, behavior: "smooth" });
    },
    goToProduct(id) {
      this.$router.push(`/products/${id}`);
    },
    checkIfPageBottom() {
      const browserHeight = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      // bottom of page if the browser height and amount scrolled are greater or equal to page height
      const scrolledToBottom =
        browserHeight + this.amountScrolled >= pageHeight;
      this.isBottom = scrolledToBottom;
    },
    showMore() {
      if (this.showMoreEnabled) {
        this.page += 1;
        this.$apollo.queries.productsPage.fetchMore({
          variables: {
            page: this.page,
            size
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newProducts = fetchMoreResult.productsPage.products;
            const hasMore = fetchMoreResult.productsPage.hasMore;

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