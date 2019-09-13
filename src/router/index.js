import Vue from "vue";
import Router from "vue-router";
import store from "../store";
import Login from "@/views/auth/login";
import ForgotPassword from "@/views/auth/forgot-password";
import ResetPasswordForm from "@/views/auth/reset-password-form";
import App from "@/views/layouts/App";
import Home from "@/views/home";
import Admin from "@/views/admin";
import QuickPay from "@/views/quickpay";
import Profile from "@/views/profile";
import Terms from "@/views/terms";
import Edit from "@/views/admin/edit";
import Faq from "@/views/faq";
import About from "@/views/about";
import Agent from "@/views/agent";

import {
  USER_REQUEST
} from "@/store/actions/user";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

const ifAdmin = (to, from, next) => {
  if (!store.getters.isProfileLoaded()) {
    store.dispatch(USER_REQUEST).then(() => {
      if (store.getters.isAdmin) {
        next();
      } else {
        next("/");
      }
    })
  } else {
    if (store.getters.isAdmin) {
      next();
    } else {
      next("/");
    }
  }
};

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      component: App,
      children: [{
          path: "/profile",
          name: "profile",
          component: Profile,
          beforeEnter: ifAuthenticated
        },
        {
          path: "/",
          name: "home",
          component: Home
        },
        {
          path: "/quickpay",
          name: "quickpay",
          component: QuickPay
        },
        {
          path: "/terms",
          name: "terms",
          component: Terms
        },
        {
          path: "/about",
          name: "about",
          component: About
        },
        {
          path: "/faq",
          name: "faq",
          component: Faq
        },
        {
          path: "/agent",
          name: "agent",
          component: Agent
        },
        {
          path: "/reset-password",
          name: "reset-password",
          component: ForgotPassword,
          meta: {
            auth: false
          }
        },
        {
          path: "/reset-password/:token",
          name: "reset-password-form",
          component: ResetPasswordForm,
          meta: {
            auth: false
          }
        },
        {
          path: "/admin",
          name: "admin",
          component: Admin,
          beforeEnter: ifAdmin
        },
        {
          path: "/admin/edit/:customerId",
          name: "edit-customer",
          component: Edit,
          beforeEnter: ifAdmin
        },
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
  ]
});