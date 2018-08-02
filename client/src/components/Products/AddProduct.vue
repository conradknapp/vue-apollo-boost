<template>
  <v-container>
  <v-layout>
    <v-flex class="text-xs-center" xs12>
      <h1 class="primary--text">Add a new product</h1>
    </v-flex>
  </v-layout>
  <v-layout row>
    <v-flex xs12>
      <form @submit.prevent="onAddProduct">
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-textarea name="title" label="Title" id="title" v-model="title" required="required"></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout row="row">
          <v-flex xs12 sm6 offset-sm3>
            <v-select name="categories" label="Categories" id="categories" :items="['Mid-Century Modern', 'Rustic', 'Preppy', 'Traditional', 'Arts and Crafts']" v-model="categories" multiple required="required"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-textarea name="imageUrl" label="Image URL" id="image-url" v-model="imageUrl" required="required"></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3><img :src="imageUrl" height="300px"/></v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-textarea name="description" label="Description" id="description" v-model="description" multi-line required></v-textarea>
          </v-flex>
        </v-layout>

          <v-flex xs12 sm6 offset-sm3>
            <v-btn color="primary" :disabled="!formValid" type="submit">Create Product</v-btn>
          </v-flex>
      </form>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  name: "AddProduct",
  data() {
    return {
      title: "",
      imageUrl: "",
      description: "",
      categories: []
    };
  },
  computed: {
    formValid() {
      return this.title && this.categories && this.imageUrl && this.description;
    }
  },
  methods: {
    onAddProduct() {
      if (!this.formValid) return;

      const newProduct = {
        title: this.title,
        categories: this.categories,
        imageUrl: this.imageUrl,
        description: this.description
      };
      this.$store.dispatch("onAddProduct", newProduct);
      this.$router.push("/products");
    }
  }
};
</script>