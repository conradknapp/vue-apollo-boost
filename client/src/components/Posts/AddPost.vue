<template>
  <v-container>
    <v-layout>
      <v-flex class="text-xs-center" xs12>
        <h1 class="primary--text">Add a New Post</h1>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-form @submit.prevent="handleAddPost" v-model="isFormValid" ref="form" lazy-validation>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field label="Title" v-model.trim="title" required :rules="titleRules"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-select label="Categories" :items="['Art', 'Furniture', 'Education', 'Clothing', 'Technology']" v-model="categories" multiple :rules="categoriesRules" required></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field label="Image URL" v-model.trim="imageUrl" :rules="imageRules" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3><img :src="imageUrl" height="300px" /></v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-textarea :rules="descRules" label="Description" v-model.trim="description" multi-line required></v-textarea>
            </v-flex>
          </v-layout>

          <v-flex xs12 sm6 offset-sm3>
            <v-btn color="primary" :disabled="!isFormValid || loading" type="submit">Create Post</v-btn>
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: true,
      title: "",
      imageUrl: "",
      description: "",
      categories: [],
      titleRules: [
        title => !!title || "Post title is required",
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
    ...mapGetters(["user", "loading"])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          creatorId: this.user._id,
          title: this.title,
          categories: this.categories,
          imageUrl: this.imageUrl,
          description: this.description
        });
        this.$router.push("/posts");
      }
    }
  }
};
</script>