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
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  // include auth token to request to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // If no key-value pair called 'token' in LocalStorage, add it
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    // Send token from localStorage to backend for verification
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[Network Error]:", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir("[GraphQL error]:", err.name, err.message);
        if (err.name === "AuthenticationError") {
          store.commit("setAuthError", err);
          store.dispatch("signoutUser");
          // Reset Auth Token if GraphQL Error (in case of malformed token)
          localStorage.setItem("token", "");
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

// Vue.prototype.$apollo = apolloClient;

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
