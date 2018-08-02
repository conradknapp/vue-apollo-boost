import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "../main";

Vue.use(Vuex);

import { SIGNIN_USER, SIGNUP_USER } from "../queries";

export const store = new Vuex.Store({
  state: {
    loading: null,
    error: null
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    }
  },
  actions: {
    onSignin({ commit }, payload) {
      commit("setLoading", true);
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
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    }
  }
});
