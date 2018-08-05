import Vue from "vue";
import wysiwyg from "vue-wysiwyg";
import "vue-wysiwyg/dist/vueWysiwyg.css";
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
Vue.use(wysiwyg, {});
Vue.use(Vuetify, {
  theme: {
    primary: "#4A148C",
    secondary: "#7B1FA2",
    accent: "#F06292",
    error: "#C62828",
    warning: "#FF8F00",
    info: "#2196f3",
    success: "#4caf50"
  }
});

// Global Components
Vue.component("form-alert", FormAlert);

// Setup Apollo Client
export const defaultClient = new ApolloClient({
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
      store.commit("setAuthError", graphQLErrors[0]);
      localStorage.setItem("token", "");
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

// Vue.prototype.apollo = defaultClient;

new Vue({
  el: "#app",
  provide: apolloProvider.provide(),
  router,
  store,
  components: { App },
  template: "<App/>",
  beforeCreate() {
    this.$store.dispatch("getCurrentUser");
  }
});
