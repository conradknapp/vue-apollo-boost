import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

import { apolloClient } from "../main";

Vue.use(Vuex);

import {
  GET_CURRENT_USER,
  GET_PRODUCT,
  GET_PRODUCTS,
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
    error: null,
    authError: null
  },
  mutations: {
    setProduct: (state, payload) => {
      state.product = payload;
    },
    setProducts: (state, payload) => {
      state.products = payload;
    },
    setNewProduct: (state, payload) => {
      state.products = [payload, ...state.products];
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: state => {
      state.error = null;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({ query: GET_CURRENT_USER })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setUser", data.getCurrentUser);
          console.log("current user", data);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    getProduct: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_PRODUCT,
          variables: { _id: payload }
        })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setProduct", data.getProduct);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    getProducts: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .query({ query: GET_PRODUCTS, variables: { size: payload } })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setProducts", data.getProducts);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    searchProducts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_PRODUCTS,
          variables: { searchTerm: payload }
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchProducts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addProduct: ({ commit }, payload) => {
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
    signinUser: ({ commit, dispatch }, payload) => {
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
        .then(({ data }) => {
          // commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          dispatch("getCurrentUser");
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signupUser: ({ commit, dispatch }, payload) => {
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
        .then(({ data }) => {
          // commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          dispatch("getCurrentUser");
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      commit("setUser", null);
      localStorage.setItem("token", "");
      await apolloClient.resetStore();
      router.push("/");
    }
  },
  getters: {
    product: state => state.product,
    products: state => state.products,
    shuffledProducts: ({ products }) =>
      [...products].sort(() => Math.random() - 0.5),
    searchResults: state => state.searchResults,
    user: state => state.user,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
