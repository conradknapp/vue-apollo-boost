<template>
  <v-container class="text-xs-center">

    <!-- User Details Card -->
    <v-flex sm6 offset-sm3>
      <v-card color="secondary" class="white--text">
        <v-layout>
          <v-flex xs5>
            <v-card-media :src="user.avatar" height="125px" contain></v-card-media>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined {{formatJoinDate(user.joinDate)}}</div>
                <div class='hidden-xs-only font-weight-thin'>{{user.favorites.length}} Favorites</div>
                <div class='hidden-xs-only font-weight-thin'>{{userProducts.length}} Products Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-card-actions>
          <v-flex class="pl-3" xs12>
            <v-btn flat color="primary" @click="handleChangeAvatar">Change Avatar</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>

    <!-- Products Favorited by User -->
    <v-layout row wrap v-if="!userFavorites.length">
      <v-flex xs12>
        <h2>You have no favorites currently. Go and add some!</h2>
      </v-flex>
    </v-layout>
    <v-container class="mt-3" row v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Favorited
          <span class="font-weight-regular">({{userFavorites.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-card-media lazy style="cursor: pointer" @click="goToProduct(favorite._id)" tag="button" height="30vh" :src="favorite.imageUrl"></v-card-media>
            <v-card-text>{{favorite.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Products Created By User -->
    <v-layout row wrap v-if="!userProducts.length">
      <v-flex xs12>
        <h2>You have no products currently. Go and add some!</h2>
      </v-flex>
    </v-layout>
    <v-container class="mt-3" row v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Your Products
          <span class="font-weight-regular">({{userProducts.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="product in userProducts" :key="product._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn @click="loadProduct(product)" color="info" floating fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="handleDeleteUserProduct(product._id)" color="error" floating fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>
            <v-card-media lazy style="cursor: pointer" @click="goToProduct(product._id)" tag="button" height="30vh" :src="product.imageUrl"></v-card-media>
            <v-card-text>{{product.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit Product Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Update
        </v-card-title>
        <v-form @submit.prevent="handleUpdateUserProduct" v-model="isFormValid" ref="form" lazy-validation>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field label="Title" v-model.trim="title" required :rules="titleRules"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-select label="Categories" :items="['Mid-Century Modern', 'Rustic', 'Preppy', 'Traditional', 'Arts and Crafts']" v-model="categories" multiple :rules="categoriesRules" required></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field label="Image URL" v-model.trim="imageUrl" :rules="imageRules" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-textarea :rules="descRules" label="Description" v-model.trim="description" multi-line required></v-textarea>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isFormValid || loading" type="submit" class="success--text" flat>Update</v-btn>
            <v-btn class="error--text" flat @click="editDialog = false">Close</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

  </v-container>
</template>


<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "Profile",
  data() {
    return {
      editDialog: false,
      isFormValid: true,
      productId: "",
      title: "",
      imageUrl: "",
      description: "",
      categories: [],
      titleRules: [
        title => !!title || "Product title is required",
        title => title.length < 10 || "Title must be less than 10 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "At least one category is required"
      ],
      descRules: [
        desc => !!desc || "Description is required",
        desc =>
          desc.length < 100 || "Description must be less than 100 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "error", "user", "userProducts", "userFavorites"])
  },
  created() {
    this.handleGetUserProducts();
  },
  methods: {
    loadProduct({ _id, title, imageUrl, categories, description }) {
      this.editDialog = true;
      this.productId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    },
    handleUpdateUserProduct() {
      this.$store.dispatch("updateUserProduct", {
        productId: this.productId,
        userId: this.user._id,
        title: this.title,
        imageUrl: this.imageUrl,
        categories: this.categories,
        description: this.description
      });
      this.editDialog = false;
    },
    handleGetUserProducts() {
      this.$store.dispatch("getUserProducts", {
        userId: this.user._id
      });
    },
    handleDeleteUserProduct(productId) {
      console.log(productId);
      const deleteProduct = window.confirm(
        "Are you sure you want to delete this product?"
      );

      if (deleteProduct) {
        this.$store.dispatch("deleteUserProduct", {
          productId
        });
      }
    },
    goToProduct(productId) {
      this.$router.push(`/products/${productId}`);
    },
    formatJoinDate(date) {
      return moment(new Date(date)).format("ll");
    },
    handleChangeAvatar() {
      console.log("changing avatar");
    }
  }
};
</script>