import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/es5/util/colors";

Vue.use(VueApollo);
Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.lighten1,
    secondary: colors.teal.lighten4,
    accent: colors.red.darken2,
    error: colors.red.base,
    warning: colors.amber.darken2,
    info: colors.blue.base,
    success: colors.green.base
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
  components: { App },
  template: "<App/>"
});
