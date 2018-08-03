<template>
  <v-app class="grey lighten-3">
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
          <v-toolbar-side-icon @click.native.stop="toggleNav"></v-toolbar-side-icon>
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
        <v-list-tile v-if="userAuth">
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
    <v-text-field v-model="searchTerm" @input="onSearchProducts"  flex prepend-icon="search" placeholder="Search styles" color="accent" single-line hide-details></v-text-field>

    <!-- Search Results Card -->
    <v-card dark v-if="searchResults.length" id="Card__Search">
      <v-list>
        <v-list-tile @click="goToResult(result._id)" v-for="result in searchResults" :key="result.title">
          <v-list-tile-title v-html="`${result.title}`"></v-list-tile-title>
          <!-- <v-list-tile-action v-if="userAuth && userFavorites.includes(result._id)">
            <v-icon>favorite</v-icon>
          </v-list-tile-action> -->
        </v-list-tile>
      </v-list>
    </v-card>

    <v-spacer></v-spacer>

    <v-toolbar-items dark class="hidden-sm-and-down">
      <v-btn flat to="/signin">Signin
      </v-btn>
      <v-btn flat to="/signup">Signup
      </v-btn>
      <v-btn flat="flat" v-if="userAuth">
        <v-icon class="hidden-sm-only" left="left">exit_to_app</v-icon>Signout
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>

  <!-- App Content -->
    <main>
      <transition name="fade">
        <router-view/>
      </transition>
    </main>

  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      userAuth: true,
      searchTerm: ""
    };
  },
  computed: {
    sideNavItems() {
      let items = [
        { icon: "weekend", title: "Products", link: "/products" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.userAuth) {
        items = [
          { icon: "weekend", title: "Products", link: "/products" },
          { icon: "account_box", title: "Profile", link: "/profile" },
          { icon: "stars", title: "Create Product", link: "/product/add" }
        ];
      }
      return items;
    },
    searchResults() {
      return this.$store.getters.searchResults;
    }
  },
  methods: {
    toggleNav() {
      this.sideNav = !this.sideNav;
    },
    onSearchProducts() {
      this.$store.dispatch("onSearchProducts", this.searchTerm);
    },
    goToResult(id) {
      this.searchTerm = "";
      this.$router.push(`/products/${id}`);
      this.$store.dispatch("onGetProduct", id);
      this.$store.commit("setSearchResults", []);
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

#Card__Favorites {
  position: absolute;
  transition: all 0.5s;
  width: 200px;
  z-index: 8;
  top: 100%;
  transform: translateX(-160px);
}
#Card__Search {
  position: absolute;
  transition: all 0.5s;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}
.SearchTerm__Highlight {
  color: #ffc600;
}

.Card__Favorites--Image__Container {
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

.Card__Favorites--Image {
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
}
</style>
