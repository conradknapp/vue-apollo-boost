import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "../main";

Vue.use(Vuex);

import {
  GET_ALL_PRODUCTS,
  ADD_PRODUCT,
  SIGNIN_USER,
  SIGNUP_USER
} from "../queries";

export const store = new Vuex.Store({
  state: {
    products: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setProducts(state, payload) {
      state.products = payload;
    },
    setNewProduct(state, payload) {
      state.products = [payload, ...state.products];
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
    products(state) {
      return state.products;
    },
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    }
  }
});
