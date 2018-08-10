import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

import { defaultClient as apolloClient } from "../main";

Vue.use(Vuex);

import {
  GET_CURRENT_USER,
  GET_USER_PRODUCTS,
  GET_PRODUCT,
  GET_PRODUCTS,
  ADD_PRODUCT,
  SIGNIN_USER,
  SIGNUP_USER,
  SEARCH_PRODUCTS,
  UPDATE_USER_PRODUCT
} from "../queries";

export const store = new Vuex.Store({
  state: {
    product: null,
    products: [],
    searchResults: [],
    user: null,
    userProducts: [],
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
    setUserProducts: (state, payload) => {
      state.userProducts = payload;
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
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
    clearSearchResults: state => (state.searchResults = [])
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({ query: GET_CURRENT_USER })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setUser", data.getCurrentUser);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    getProduct: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_PRODUCT,
          variables: payload
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
        .query({
          query: GET_PRODUCTS,
          variables: payload
        })
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
    getUserProducts: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_USER_PRODUCTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setUserProducts", data.getUserProducts);
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
          variables: payload
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
          variables: payload,
          refetchQueries: [
            {
              query: GET_PRODUCTS,
              variables: { size: null }
            }
          ]
        })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setNewProduct", data.addProduct);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    updateUserProduct: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_PRODUCT,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userProducts.findIndex(
            product => product._id === data.updateUserProduct._id
          );
          const userProducts = [
            ...state.userProducts.slice(0, index),
            data.updateUserProduct,
            ...state.userProducts.slice(index + 1)
          ];
          commit("setUserProducts", userProducts);
          // console.log(data.updateUserProduct);
        })
        .catch(err => {
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("setLoading", true);
      commit("clearError");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signinUser.token);
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signupUser: ({ commit }, payload) => {
      commit("setLoading", true);
      commit("clearError");
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signupUser.token);
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      commit("clearUser");
      localStorage.setItem("token", "");
      await apolloClient.resetStore();
      router.push("/");
    }
  },
  getters: {
    product: state => state.product,
    products: state => state.products,
    shuffledProducts: state =>
      [...state.products].sort(() => Math.random() - 0.5),
    searchResults: state => state.searchResults,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    userProducts: state => state.userProducts,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
