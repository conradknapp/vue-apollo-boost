import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "../main";

Vue.use(Vuex);

import { SIGNUP_USER, GET_BOOKS } from "../queries";

export const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    onSignup({ commit }, payload) {
      // apolloClient.query({ query: GET_BOOKS }).then(res => console.log(res));
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: {
            username: payload.username,
            email: payload.email,
            password: payload.password
          }
        })
        .then(data => console.log(data))
        .catch(err => console.error(err));
    }
  },
  getters: {}
});
