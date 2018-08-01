import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";

import Signin from "@/components/Auth/Signin";
import Signup from "@/components/Auth/Signup";
import Profile from "@/components/Auth/Profile";

import Products from "@/components/Products/Products";
import Product from "@/components/Products/Product";
import AddProduct from "@/components/Products/AddProduct";

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
      path: "/products",
      name: "Products",
      component: Products
    },
    {
      path: "/product/:id",
      name: "Product",
      component: Product
    },
    {
      path: "/products/add",
      name: "AddProduct",
      component: AddProduct
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile
    }
  ],
  mode: "history"
});
