<template>
  <v-app class="grey lighten-3">
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
          <v-toolbar-side-icon @click="toggleNav"></v-toolbar-side-icon>
          <v-list-tile-title class="title">Vue Pinterest</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

        <v-divider></v-divider>

        <v-list>
        <v-list-tile ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{item.title}}</v-list-tile-content>
        </v-list-tile>

      <!-- if User is Authenticated -->
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
    <v-toolbar-side-icon @click.native.stop="toggleNav"></v-toolbar-side-icon>
    <v-toolbar-title>
      <router-link to="/" tag="span" style="cursor: pointer">Vue Pinterest</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Search Input -->
    <v-text-field v-model="searchTerm" @input="handleSearchProducts" flex prepend-icon="search" placeholder="Search styles" color="accent" single-line hide-details></v-text-field>

    <!-- Search Results Card -->
    <v-card dark v-if="searchResults.length" id="card__search">
      <v-list>
        <v-list-tile @click="goToResult(result._id)" v-for="result in searchResults" :key="result.title">
          <v-list-tile-title>
            {{ result.title }} - {{ formatDescription(result.description) }}
          </v-list-tile-title>
          <!-- <v-list-tile-action v-if="user && userFavorites.includes(result._id)">
            <v-icon>favorite</v-icon>
          </v-list-tile-action> -->
        </v-list-tile>
      </v-list>
    </v-card>

    <v-spacer></v-spacer>

    <v-toolbar-items dark class="hidden-sm-and-down">
      <v-btn flat to="/products">
      <v-icon class="hidden-sm-only" left>weekend</v-icon>Products
      </v-btn>
      <v-btn flat v-if="!user" to="/signin">
      <v-icon class="hidden-sm-only" left>lock_open</v-icon>Signin
      </v-btn>
      <v-btn flat v-if="!user" to="/signup">
      <v-icon class="hidden-sm-only" left>create</v-icon>Signup
      </v-btn>
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
        <v-snackbar
          v-model="snackbar"
          color="success"
          bottom
          left
          :timeout='5000'>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
            <v-btn dark flat @click="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-snackbar
          v-model="snackbar2"
          color="warning"
          bottom
          left
          :timeout='5000'>
          <v-icon class="mr-3">cancel</v-icon>
          <h3 v-if="authError">{{ authError.message }}</h3>
            <v-btn dark flat to="/signin">Signin</v-btn>
        </v-snackbar>
      </v-container>
    </main>

  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      searchTerm: "",
      snackbar: false,
      snackbar2: false
    };
  },
  computed: {
    ...mapGetters(["searchResults", "user", "authError"]),
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
    }
  },
  watch: {
    user(value) {
      if (value) {
        this.snackbar = true;
      }
    },
    authError(value) {
      if (value) {
        this.snackbar2 = true;
      }
    }
  },
  methods: {
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    toggleNav() {
      this.sideNav = !this.sideNav;
    },
    goToResult(id) {
      this.searchTerm = "";
      this.$router.push(`/products/${id}`);
      this.$store.dispatch("getProduct", id);
      this.$store.commit("setSearchResults", []);
    },
    handleSearchProducts() {
      this.$store.dispatch("searchProducts", this.searchTerm);
    },
    handleSignout() {
      this.$store.dispatch("signoutUser");
    }
  }
};
</script>

<style scoped>
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

#card__favorites {
  position: absolute;
  transition: all 0.5s;
  width: 200px;
  z-index: 8;
  top: 100%;
  transform: translateX(-160px);
}
#card__search {
  position: absolute;
  transition: all 0.5s;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

/* .card__favorites--image__container {
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

.card__favorites--image {
  max-width: 100%;
  max-height: 100%;
}
.animate {
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
} */
</style>
