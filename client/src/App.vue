<template>
  <v-app style="background: #E3E3EE">

    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">

      <!-- Side Navbar Header -->
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link tag="span" to="/">
          <h1 class="title font-weight-light pl-3" style="cursor: pointer">Vue Pinterest</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-tile ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{item.title}}</v-list-tile-content>
        </v-list-tile>

        <!-- Signout Button (if user is signed in) -->
        <v-list-tile v-if="user" @click="handleSignout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Signout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-toolbar dark fixed color="primary">

      <!-- App Title -->
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only font-weight-light">
        <router-link to="/" tag="span" style="cursor: pointer">Vue Pinterest</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field v-model="searchTerm" @input="handleSearchProducts" flex prepend-icon="search" placeholder="Search styles" color="accent" single-line hide-details></v-text-field>

      <!-- Search Results Card -->
      <v-card dark v-if="searchResults.length" id="card__search">
        <v-list>
          <v-list-tile @click="goToSearchResult(result._id)" v-for="result in searchResults" :key="result._id">
            <v-list-tile-title>
              {{result.title}} •
              <span class='font-weight-thin'>{{formatDescription(result.description)}}</span>
            </v-list-tile-title>
            <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items dark class="hidden-xs-only">
        <v-btn flat v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>{{item.title}}
        </v-btn>

        <!-- Profile Button -->
        <v-btn flat to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2" :class="{ 'bounce': badgeAnimated }">
            <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
            Profile
          </v-badge>
        </v-btn>

        <!-- Signout Button -->
        <v-btn flat v-if="user" @click="handleSignout">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>Signout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- App Content -->
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view/>
        </transition>

        <!-- Auth / Error Snackbars -->
        <v-snackbar v-model="authSnackbar" color="success" bottom left :timeout='5000'>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>
        <v-snackbar v-model="errorSnackbar" color="info" bottom left :timeout='5000'>
          <v-icon class="mr-3">cancel</v-icon>
          <h3 v-if="authError">{{authError.message}}</h3>
          <v-btn dark flat to="/signin">Signin</v-btn>
        </v-snackbar>

      </v-container>
    </main>

  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_CURRENT_USER } from "./queries";

export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      searchTerm: "",
      authSnackbar: false,
      errorSnackbar: false,
      badgeAnimated: false
    };
  },
  computed: {
    ...mapGetters(["searchResults", "user", "authError", "userFavorites"]),
    sideNavItems() {
      let items = [
        { icon: "weekend", title: "Products", link: "/products" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "weekend", title: "Products", link: "/products" },
          { icon: "stars", title: "Create Product", link: "/product/add" },
          { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    },
    horizontalNavItems() {
      let items = [
        { icon: "weekend", title: "Products", link: "/products" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user)
        items = [{ icon: "weekend", title: "Products", link: "/products" }];
      return items;
    }
  },
  watch: {
    user(newValue, oldValue) {
      // if we previously had no value for user,show snackbar
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      // if we have an error, show the error snackbar
      if (value !== null) {
        this.errorSnackbar = true;
      }
    },
    userFavorites(value) {
      // true if user favorites value changed at all
      this.badgeAnimated = true;
      setTimeout(() => (this.badgeAnimated = false), 1000);
    }
  },
  methods: {
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    goToSearchResult(resultId) {
      this.searchTerm = "";
      this.$router.push(`/products/${resultId}`);
      this.$store.dispatch("getProduct", {
        _id: resultId
      });
      this.$store.commit("clearSearchResults");
    },
    handleSearchProducts() {
      this.$store.dispatch("searchProducts", {
        searchTerm: this.searchTerm
      });
    },
    handleSignout() {
      this.$store.dispatch("signoutUser");
    },
    checkIfUserFavorite(resultId) {
      if (this.user) {
        return this.userFavorites.some(favorite => favorite._id === resultId);
      }
    }
  }
};
</script>

<style>
h1 {
  font-weight: 100;
  font-size: 2.5rem;
}

h2 {
  font-weight: 100;
  font-size: 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

#card__search {
  position: absolute;
  transition: all 0.5s;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

/* Profile Tab Animation */

.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  100%,
  20%,
  53%,
  80% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
