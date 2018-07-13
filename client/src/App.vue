<template>
  <v-app>
    <v-toolbar class="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>
      <router-link to="/">Title</router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat>
        <router-link to="/signin">Signin</router-link>
      </v-btn>
      <v-btn flat>
        <router-link to="/signup">Signup</router-link>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
    <main>
      <transition name="fade">
      <router-view/>
      </transition>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
a,
a:link {
  color: black;
  text-decoration: none;
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
</style>
