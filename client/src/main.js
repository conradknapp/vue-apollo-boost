import Vue from "vue";
import App from "./App";
import router from "./router";
import { store } from "./store";
import FormAlert from "./components/Shared/FormAlert";

// Import Vuetify
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
// import colors from "vuetify/es5/util/colors";

// Import ApolloClient and VueApollo
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);
Vue.use(Vuetify, {
  theme: {
    primary: "#3B125F",
    secondary: "#8B5FBF",
    accent: "#BF653F",
    error: "#722530",
    warning: "#A37513",
    info: "#396893",
    success: "#4caf50"
  }
});

// Global Components
Vue.component("form-alert", FormAlert);

// Setup Apollo Client
export const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("Network Error:", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.log(err);
      }
      store.commit("setAuthError", graphQLErrors[0]);
      localStorage.setItem("token", "");
    }
  }
});

const apolloProvider = new VueApollo({ apolloClient });

// Vue.prototype.apollo = apolloClient;

new Vue({
  el: "#app",
  provide: apolloProvider.provide(),
  router,
  store,
  components: { App },
  template: "<App/>",
  created() {
    this.$store.dispatch("getCurrentUser");
  }
});
