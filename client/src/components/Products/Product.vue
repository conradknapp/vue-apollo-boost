<template>
  <v-container v-if="getProduct" class="mt-5 mb-5" flexbox center>

    <div v-if="$apollo.loading">Loading</div>

    <!-- Product Card -->
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getProduct.title}}</h1>
            <v-btn large icon @click="handleToggleLike(getProduct._id)">
              <v-icon large v-if="userFavorites" :color="checkIfLiked(getProduct._id) || liked ? 'red' : 'grey'">favorite</v-icon>
              {{getProduct.likes}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn dark color="primary" @click="goBack">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </v-card-title>
          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-card-media slot="activator" @click="togglePictureDialog" :src="getProduct.imageUrl" id="product__image">
            </v-card-media>
          </v-tooltip>
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-media :src="getProduct.imageUrl" height="500px"></v-card-media>
            </v-card>
          </v-dialog>
          <v-card-text>
            <span v-for="(category, index) in getProduct.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getProduct.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Message Component -->
    <v-container flexbox center>

      <!-- Message Input -->
      <v-layout class="mt-3 pb-5" v-if="user">
        <v-flex xs12>
          <v-form v-model="isFormValid" ref="form" lazy-validation>
            <v-layout row>
              <v-flex xs12>
                <v-text-field label="Add Message" v-model="message" type="text" prepend-icon="email" :rules="messageRules" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-btn @click="handleAddProductMessage" :disabled="!isFormValid || loading" color="info">Submit</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row>
        <v-flex xs12>
          <v-list subheader three-line>
            <v-subheader>Messages</v-subheader>
            <template v-for="message in getProduct.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-tile :key="message.title">
                <v-list-tile-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{message.messageBody}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>{{message.messageUser.username}}
                    <span class="grey--text text--lighten-1">{{message.messageDate}}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon :color="user && message.messageUser._id === user._id ? 'accent' : 'grey'">chat_bubble</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  LIKE_PRODUCT,
  UNLIKE_PRODUCT,
  GET_PRODUCT,
  GET_CURRENT_USER,
  ADD_PRODUCT_MESSAGE
} from "../../queries";

export default {
  name: "Product",
  props: ["_id"],
  data() {
    return {
      isFormValid: true,
      firstLoad: false,
      liked: false,
      dialog: false,
      message: "",
      mouseEnterHeart: false,
      messageRules: [
        message => !!message || "Comment is required",
        message =>
          (message && message.length < 20) ||
          "Comment must be less than 20 characters"
      ]
    };
  },
  apollo: {
    getProduct: {
      query: GET_PRODUCT,
      variables() {
        return {
          _id: this._id
        };
      }
    }
  },
  computed: {
    // prettier-ignore
    ...mapGetters(["user", "loading", 'userFavorites'])
  },
  watch: {
    $route() {
      this.handleGetProduct();
    }
  },
  created() {
    // this.handleGetProduct();
  },
  methods: {
    handleGetProduct() {
      this.$store.dispatch("getProduct", this._id);
    },
    handleToggleLike() {
      if (this.liked === true) {
        this.liked = false;
        this.handleUnlikeProduct();
      } else {
        this.liked = true;
        this.handleLikeProduct();
      }
    },
    handleLikeProduct() {
      const variables = {
        username: this.user.username,
        _id: this._id
      };

      this.$apollo
        .mutate({
          mutation: LIKE_PRODUCT,
          variables,
          update: (store, { data: { likeProduct } }) => {
            const { getProduct } = store.readQuery({
              query: GET_PRODUCT,
              variables: { _id: this._id }
            });

            store.writeQuery({
              query: GET_PRODUCT,
              variables: { _id: this._id },
              data: {
                getProduct: {
                  ...getProduct,
                  likes: getProduct.likes + 1
                }
              }
            });
          }
        })
        .then(({ data }) => {
          console.log(data.likeProduct);
          this.$store.commit("setUser", {
            ...this.user,
            favorites: data.likeProduct.favorites
          });
        })
        .catch(err => console.error(err));
    },
    handleUnlikeProduct() {
      const variables = {
        username: this.user.username,
        _id: this._id
      };

      this.$apollo
        .mutate({
          mutation: UNLIKE_PRODUCT,
          variables,
          update: (store, { data: { unlikeProduct } }) => {
            const { getProduct } = store.readQuery({
              query: GET_PRODUCT,
              variables: { _id: this._id }
            });

            store.writeQuery({
              query: GET_PRODUCT,
              variables: { _id: this._id },
              data: {
                getProduct: {
                  ...getProduct,
                  likes: getProduct.likes - 1
                }
              }
            });
          }
        })
        .then(({ data }) => {
          console.log(data);
          this.$store.commit("setUser", {
            ...this.user,
            favorites: data.unlikeProduct.favorites
          });
        })
        .catch(err => console.error(err));
    },
    handleAddProductMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.message,
          userId: this.user._id,
          productId: this._id
        };
        this.$apollo
          .mutate({
            mutation: ADD_PRODUCT_MESSAGE,
            variables,
            update: (cache, { data: { addProductMessage } }) => {
              const { getProduct } = cache.readQuery({
                query: GET_PRODUCT,
                variables: {
                  _id: this._id
                }
              });

              cache.writeQuery({
                query: GET_PRODUCT,
                variables: {
                  _id: this._id
                },
                data: {
                  getProduct: {
                    ...getProduct,
                    messages: [...addProductMessage, ...getProduct.messages]
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
    checkIfLiked(getProductId) {
      if (!this.firstLoad) {
        if (this.userFavorites.some(el => el._id === getProductId)) {
          this.liked = true;
          this.firstLoad = true;
          return true;
        } else {
          this.firstLoad = true;
          return false;
        }
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
#product__image {
  height: 200px;
  width: 100%;
  object-fit: contain;
}

@media screen and (min-width: 250px) {
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