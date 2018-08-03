<template>
  <div v-if="productsPage">
    <div v-for="product in productsPage.products" :key="product._id">
      {{ product._id }} - {{ product.imageUrl }}
    </div>
    <v-btn @click="showMore" v-if="showMoreEnabled">Fetch More</v-btn>
  </div>
</template>

<script>
import { PRODUCTS_PAGE } from "../../queries";

const size = 1;

export default {
  name: "app",
  data: () => ({
    page: 1,
    showMoreEnabled: true
  }),
  apollo: {
    // Pages
    productsPage: {
      // GraphQL Query
      query: PRODUCTS_PAGE,
      // Initial variables
      variables: {
        page: 1,
        size
      }
    }
  },
  methods: {
    showMore() {
      this.page += 1;
      // Fetch more data and transform the original result
      this.$apollo.queries.productsPage.fetchMore({
        // New variables
        variables: {
          page: this.page,
          size
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          console.log("previousResult", previousResult.productsPage.products);
          console.log("fetchMoreResult", fetchMoreResult);
          const newProducts = fetchMoreResult.productsPage.products;
          const hasMore = fetchMoreResult.productsPage.hasMore;

          this.showMoreEnabled = hasMore;

          return {
            productsPage: {
              __typename: previousResult.productsPage.__typename,
              // Merging the tag list
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
};
</script>