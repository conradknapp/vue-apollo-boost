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

    <v-layout row wrap v-if="!loading && product">
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{product.title}}</h1>
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

    <!-- Editor Component -->
    <v-container flexbox center v-if="!loading && user">
      <v-layout class="mt-3 pb-5">
        <v-flex xs12>
          <v-form @submit.prevent="handleAddProductMessage" v-model="isFormValid" ref="form" lazy-validation>
            <v-text-field label="Add Message" v-model="message" type="text" prepend-icon="email" :rules="messageRules" required></v-text-field>
            <v-btn @click="handleAddProductMessage">Submit</v-btn>
          </v-form>
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
    ...mapGetters(["user", "loading", "product"])
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
    handleAddProductMessage() {
      if (this.$refs.form.validate()) {
        // console.log(this.message, this._id, this.user._id);
        this.$store.dispatch("addProductMessage", {
          messageBody: this.message,
          userId: this.user._id,
          productId: this._id
        });
      }
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