<template>
  <v-container class="mt-5 mb-5" flexbox center>

    <!-- Loading Component -->
    <v-layout row justify-center>
      <v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- Product Card -->
    <v-layout row wrap v-if="!loading && product">
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{product.title}}</h1>
            <v-btn large icon v-if="userFavorites" @click="handleToggleLike(product._id)">
              <v-icon large :color="userFavorites.some(el => el._id === product._id) ? 'red' : 'grey'">favorite</v-icon>
              {{product.likes}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn dark color="primary" @click="goBack">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </v-card-title>
          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-card-media slot="activator" @click="togglePictureDialog" :src="product.imageUrl" id="product__image">
            </v-card-media>
          </v-tooltip>
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-media :src="product.imageUrl" height="500px"></v-card-media>
            </v-card>
          </v-dialog>
          <v-card-text>
            <span v-for="(category, index) in product.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{product.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Message Component -->
    <v-container flexbox center>

      <!-- Message Input -->
      <v-layout class="mt-3 pb-5" v-if="!loading && user">
        <v-flex xs12>
          <v-form @submit.prevent="handleAddProductMessage" v-model="isFormValid" ref="form" lazy-validation>
            <v-layout row>
              <v-flex xs12>
                <v-text-field label="Add Message" v-model="message" type="text" prepend-icon="email" :rules="messageRules" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-btn type="submit" :disabled="!isFormValid || loading" color="info">Submit</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row v-if="!loading && productMessages">
        <v-flex xs12>
          <v-list subheader three-line>
            <v-subheader>Messages</v-subheader>
            <template v-for="message in productMessages">
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

export default {
  name: "Product",
  props: ["_id"],
  data() {
    return {
      isFormValid: true,
      dialog: false,
      message: "",
      mouseEnterHeart: false,
      messageRules: [
        message => !!message || "Comment is required",
        message =>
          message.length < 20 || "Comment must be less than 20 characters"
      ]
    };
  },
  computed: {
    // prettier-ignore
    ...mapGetters(["user", "loading", "product", "productMessages", 'userFavorites'])
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
    handleToggleLike(productId) {
      if (this.userFavorites.some(el => el._id === productId)) {
        this.$store.dispatch("unlikeProduct", productId);
      } else {
        this.$store.dispatch("likeProduct", productId);
      }
    },
    handleAddProductMessage() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addProductMessage", {
          messageBody: this.message,
          userId: this.user._id,
          productId: this._id
        });
      }
    },
    togglePictureDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
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