import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";

import Signin from "@/components/Auth/Signin";
import Signup from "@/components/Auth/Signup";
import Profile from "@/components/Auth/Profile";

import Posts from "@/components/Posts/Posts";
import Post from "@/components/Posts/Post";
import AddPost from "@/components/Posts/AddPost";
import test from "@/components/Posts/test";

import AuthGuard from "./AuthGuard";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
    {
      path: "/posts",
      name: "Posts",
      component: Posts
    },
    {
      path: "/posts/:postId",
      name: "Post",
      props: true,
      component: Post
    },
    {
      path: "/post/add",
      name: "AddPost",
      beforeEnter: AuthGuard,
      component: AddPost
    },
    {
      path: "/profile",
      name: "Profile",
      beforeEnter: AuthGuard,
      component: Profile
    },
    {
      path: "/test",
      name: "test",
      component: test
    }
  ],
  mode: "history"
});
