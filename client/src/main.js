import Vue from "vue";
import App from "./App";
import router from "./router";
import { store } from "./store";

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

const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

const apolloProvider = new VueApollo({ defaultClient });

new Vue({
  el: "#app",
  provide: apolloProvider.provide(),
  router,
  store,
  components: { App },
  template: "<App/>"
});
