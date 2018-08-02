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
        <v-list-tile v-for="item in sideNavItems" :key="item.title" :to="item.link">
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
    <v-toolbar dark color="primary">
    <v-toolbar-side-icon @click.native.stop="toggleNav"></v-toolbar-side-icon>
    <v-toolbar-title>
      <router-link to="/" tag="span" style="cursor: pointer">Vue Pinterest</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-text-field flex prepend-icon="search" placeholder="Search styles" color="pink lighten-1" single-line hide-details></v-text-field>

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
      userAuth: true
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
    }
  },
  methods: {
    toggleNav() {
      this.sideNav = !this.sideNav;
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
</style>
