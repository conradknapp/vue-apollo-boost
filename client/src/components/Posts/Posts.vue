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

    <!-- Post Cards -->
    <v-layout row wrap v-if="postsPage">
      <v-flex xs12 v-for="(post, index) in postsPage.posts" v-bind="{ [`sm${mozaicLayout && index % 3 === 0 ? 12 : 6}`]: true }" :key="post._id">
        <v-card class="mt-3 ml-1 mr-2" hover>
          <v-card-media lazy :src="post.imageUrl" :key="post._id" @click="goToPost(post._id)" tag="button" height="30vh">
          </v-card-media>
          <v-card-actions>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{post.title}}</div>
                <span class="grey--text">{{post.likes}} likes • {{post.messages.length}} comments</span>
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
                  <img :src="post.createdBy.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{post.createdBy.username}}</v-list-tile-title>
                  <v-list-tile-sub-title class="font-weight-thin">Added {{formatCreatedDate(post.createdDate)}}</v-list-tile-sub-title>
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
    <!-- <v-btn @click="showMorePosts" v-if="showMoreEnabled">Fetch More</v-btn> -->

    <!-- Page Up Button -->
    <v-layout>
      <v-flex>
        <v-fab-transition>
          <v-btn color="info" v-show="pageUpButton" @click="goToTop" dark fixed bottom right fab>
            <v-icon>navigation</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-flex>
    </v-layout>

    <!-- Post Skeleton Component -->
    <skeleton v-show="$apollo.loading"></skeleton>

    <!-- Text if No Remaining Posts -->
    <v-layout v-if="!$apollo.loading && !showMoreEnabled">
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
import moment from "moment";

import { POSTS_PAGE } from "../../queries";
import skeleton from "../Shared/Skeleton";

const size = 2;

export default {
  name: "Posts",
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
    postsPage: {
      query: POSTS_PAGE,
      variables: {
        page: 1,
        size
      }
    }
  },
  computed: {
    ...mapGetters(["posts", "userFavorites"]),
    user() {
      return this.$store.getters.user != null;
    },
    showMoreEnabled() {
      return this.postsPage && this.postsPage.hasMore;
    }
  },
  watch: {
    isBottom(value) {
      // if this.bottom evaluates to true
      if (value === true) {
        const throttled = throttle(this.showMorePosts, 250);
        throttled();
      }
    }
  },
  methods: {
    // handleGetPosts() {
    //   this.$store.dispatch("getPosts");
    // },
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
    goToPost(id) {
      this.$router.push(`/posts/${id}`);
    },
    formatCreatedDate(date) {
      return moment(new Date(date)).format("ll");
    },
    checkIfPageBottom() {
      const browserHeight = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const scrolledToBottom =
        browserHeight + this.amountScrolled >= pageHeight;
      this.isBottom = scrolledToBottom;
    },
    showMorePosts() {
      if (this.showMoreEnabled) {
        this.page += 1;
        this.$apollo.queries.postsPage.fetchMore({
          variables: {
            page: this.page,
            size
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newPosts = fetchMoreResult.postsPage.posts;
            const hasMore = fetchMoreResult.postsPage.hasMore;

            return {
              postsPage: {
                __typename: previousResult.postsPage.__typename,
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
  }
};
</script>