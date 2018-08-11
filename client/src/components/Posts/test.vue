<template>
  <div v-if="postsPage">
    <div v-for="post in postsPage.posts" :key="post._id">
      {{post._id}} - {{post.imageUrl}}
    </div>
    <v-btn @click="showMore" v-if="showMoreEnabled">Fetch More</v-btn>
  </div>
</template>

<script>
import { POSTS_PAGE } from "../../queries";

const size = 1;

export default {
  name: "app",
  data() {
    return {
      page: 1,
      showMoreEnabled: true
    }
  },
  apollo: {
    // Pages
    postsPage: {
      // GraphQL Query
      query: POSTS_PAGE,
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
      this.$apollo.queries.postsPage.fetchMore({
        // New variables
        variables: {
          page: this.page,
          size
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          console.log("previousResult", previousResult.postsPage.posts);
          console.log("fetchMoreResult", fetchMoreResult);
          const newPosts = fetchMoreResult.postsPage.posts;
          const hasMore = fetchMoreResult.postsPage.hasMore;

          this.showMoreEnabled = hasMore;

          return {
            postsPage: {
              __typename: previousResult.postsPage.__typename,
              // Merging the tag list
              posts: [
                ...previousResult.postsPage.posts,
                ...newPosts
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