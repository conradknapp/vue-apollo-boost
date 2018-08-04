import Vue from "vue";
import App from "./App";
import router from "./router";
import { store } from "./store";
import { GET_CURRENT_USER } from "./queries";

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
    primary: "#4A148C",
    secondary: "#7B1FA2",
    accent: "#F06292",
    error: "#C62828",
    warning: "#FF8F00",
    info: "#2196f3",
    success: "#4caf50"
  }
});

// Setup Apollo Client
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log("Network Error:", networkError);
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
    this.$store.dispatch("onGetCurrentUser");
  }
});
