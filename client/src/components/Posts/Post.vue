<template>
  <v-container v-if="getPost" class="mt-5 mb-5" flexbox center>

    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn large icon v-if="user" @click="handleToggleLike(getPost._id)">
              <v-icon large :color="checkIfLiked(getPost._id) ? 'red' : 'grey'">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon color="info" large @click="goToPreviousPage">
              arrow_back
            </v-icon>
          </v-card-title>
          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-card-media slot="activator" @click="togglePictureDialog" :src="getPost.imageUrl" id="post__image">
            </v-card-media>
          </v-tooltip>
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-media :src="getPost.imageUrl" height="500px"></v-card-media>
            </v-card>
          </v-dialog>
          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Message Component -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form @submit.prevent="handleAddPostMessage" v-model="isFormValid" ref="form" lazy-validation>
            <v-layout row>
              <v-flex xs12>
                <v-text-field clearable :append-outer-icon="messageBody && 'send'" @click:append-outer="handleAddPostMessage" label="Add Message" v-model="messageBody" type="text" prepend-icon="email" :rules="messageRules" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Messages ({{getPost.messages.length}})
            </v-subheader>
            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-tile avatar inset :key="message.title">
                <v-list-tile-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{message.messageBody}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>{{message.messageUser.username}}
                    <span class="grey--text text--lighten-1 hidden-xs-only">{{getTimeFromNow(message.messageDate)}}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action class="hidden-xs-only">
                  <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

import {
  LIKE_POST,
  UNLIKE_POST,
  GET_POST,
  GET_CURRENT_USER,
  ADD_POST_MESSAGE
} from "../../queries";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      isFormValid: true,
      postLiked: false,
      dialog: false,
      messageBody: "",
      messageRules: [
        message => !!message || "Comment is required",
        message =>
          (message && message.length < 50) ||
          "Comment must be less than 50 characters"
      ]
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "loading", "userFavorites"])
  },
  // watch: {
  //   $route() {
  //     this.handleGetPost();
  //   }
  // },
  created() {
    // this.handleGetPost();
  },
  methods: {
    checkIfLiked(postId) {
      if (this.userFavorites.some(fave => fave._id === postId)) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    },
    handleGetPost() {
      this.$store.dispatch("getPost", {
        postId: this.postId
      });
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.postLiked = false;
        this.handleUnlikePost();
      } else {
        this.postLiked = true;
        this.handleLikePost();
      }
    },
    handleLikePost() {
      const variables = {
        username: this.user.username,
        postId: this.postId
      };

      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables,
          update: (store, { data: { likePost } }) => {
            const { getPost } = store.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });

            store.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data: {
                getPost: {
                  ...getPost,
                  likes: getPost.likes + 1
                }
              }
            });
          }
        })
        .then(({ data }) => {
          console.log(data.likePost);
          this.$store.commit("setUser", {
            ...this.user,
            favorites: data.likePost.favorites
          });
        })
        .catch(err => console.error(err));
    },
    handleUnlikePost() {
      const variables = {
        username: this.user.username,
        postId: this.postId
      };

      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables,
          update: (store, { data: { unlikePost } }) => {
            const { getPost } = store.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });

            store.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data: {
                getPost: {
                  ...getPost,
                  likes: getPost.likes - 1
                }
              }
            });
          }
        })
        .then(({ data }) => {
          console.log(data);
          this.$store.commit("setUser", {
            ...this.user,
            favorites: data.unlikePost.favorites
          });
        })
        .catch(err => console.error(err));
    },
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const { getPost } = cache.readQuery({
                query: GET_POST,
                variables: {
                  postId: this.postId
                }
              });

              cache.writeQuery({
                query: GET_POST,
                variables: {
                  postId: this.postId
                },
                data: {
                  getPost: {
                    ...getPost,
                    messages: [...addPostMessage, ...getPost.messages]
                  }
                }
              });
            }
          })
          .then(({ data }) => {
            console.log(data);
            this.$refs.form.reset();
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    togglePictureDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    goToPreviousPage() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
#post__image {
  height: 200px;
  width: 100%;
  object-fit: contain;
}

@media screen and (min-width: 250px) {
  #post__image {
    height: 180px !important;
  }
}
@media screen and (min-width: 400px) {
  #post__image {
    height: 230px !important;
  }
}
@media screen and (min-width: 550px) {
  #post__image {
    font-size: 2rem;
    height: 350px !important;
  }
}
@media screen and (min-width: 800px) {
  #post__image {
    height: 350px !important;
  }
}
</style>