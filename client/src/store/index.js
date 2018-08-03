import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "../main";

Vue.use(Vuex);

import {
  GET_PRODUCT,
  GET_ALL_PRODUCTS,
  ADD_PRODUCT,
  SIGNIN_USER,
  SIGNUP_USER,
  SEARCH_PRODUCTS
} from "../queries";

export const store = new Vuex.Store({
  state: {
    product: null,
    products: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setProduct(state, payload) {
      state.product = payload;
    },
    setProducts(state, payload) {
      state.products = payload;
    },
    setNewProduct(state, payload) {
      state.products = [payload, ...state.products];
    },
    setSearchResults(state, payload) {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    onGetProduct({ commit }, payload) {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_PRODUCT,
          variables: { _id: payload }
        })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setProduct", data.getProduct);
          console.log(data.getProduct);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    onGetAllProducts({ commit }) {
      commit("setLoading", true);
      apolloClient
        .query({ query: GET_ALL_PRODUCTS })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setProducts", data.getAllProducts);
          console.log(data.getAllProducts);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    onSearchProducts({ commit }, payload) {
      apolloClient
        .query({
          query: SEARCH_PRODUCTS,
          variables: { searchTerm: payload }
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchProducts);
          console.log(data.searchProducts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    onAddProduct({ commit }, payload) {
      commit("setLoading", true);
      commit("clearError");
      apolloClient
        .mutate({
          mutation: ADD_PRODUCT,
          variables: {
            title: payload.title,
            imageUrl: payload.imageUrl,
            categories: payload.categories,
            description: payload.description
          }
        })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setNewProduct", data.addProduct);
          console.log(data.addProduct);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    onSignin({ commit }, payload) {
      commit("setLoading", true);
      commit("clearError");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: {
            username: payload.username,
            password: payload.password
          }
        })
        .then(data => {
          commit("setLoading", false);
          console.log(data);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    onSignup({ commit }, payload) {
      commit("setLoading", true);
      commit("clearError");
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: {
            username: payload.username,
            email: payload.email,
            password: payload.password
          }
        })
        .then(data => {
          commit("setLoading", false);
          console.log(data);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    }
  },
  getters: {
    product: state => state.product,
    products: state => state.products,
    searchResults: state => state.searchResults,
    user: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  }
});
