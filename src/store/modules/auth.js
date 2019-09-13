/* eslint-disable promise/param-names */
import {
  AUTH_REQUEST,
  AUTH_SIGNUP,
  AUTH_LOGOUT,
  AUTH_FORGOT_PASSWORD,
  AUTH_PASSWORD_RESET,
  AUTH_COMPLETE_QUICKPAY_REGISTRATION
} from "@/store/actions/auth";
import { USER_REQUEST } from "../actions/user";
import { apiCall, api_routes } from "@/utils/api";
import router from "./../../router";
import axios from "axios";

const state = {
  token: localStorage.getItem("user-token") || "",
  status: "",
  password_reset_status: ""
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
};

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.user.login, data: user, method: "post" })
        .then(resp => {
          localStorage.setItem("user-token", resp.data.token);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + resp.data.token;
          commit("auth_success", resp.data);
          dispatch(USER_REQUEST);
          resolve(resp);
        })
        .catch(err => {
          commit("auth_error", err);
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },
  [AUTH_SIGNUP]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.user.signup, data: user, method: "post" })
        .then(resp => {
          commit("registration_success", resp.data);
          localStorage.setItem("user-token", resp.data.token);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + resp.data.token;
          commit("auth_success", resp.data);
        })
        .then(resp => {
          dispatch(USER_REQUEST);
          resolve(resp);
        })
        .catch(err => {
          commit("auth_error", err);
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },
  [AUTH_COMPLETE_QUICKPAY_REGISTRATION]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.user.completequickpay, data: user, method: "post" })
        .then(resp => {
          commit("registration_success", resp.data);
          localStorage.setItem("user-token", resp.data.token);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + resp.data.token;
          commit("auth_success", resp.data);
        })
        .then(resp => {
          dispatch(USER_REQUEST);
          resolve(resp);
        })
        .catch(err => {
          commit("auth_error", err);
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise(resolve => {
      commit("auth_logout");
      localStorage.removeItem("user-token");
      router.push("/login");
      resolve();
    });
  },
  [AUTH_FORGOT_PASSWORD]: ({ commit }, email) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.user.forgotpassword,
        data: email,
        method: "post"
      })
        .then(resp => {
          commit("send_forgot_password_mail_success", resp.data);
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [AUTH_PASSWORD_RESET]: ({ commit }, request) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.user.passwordreset,
        data: request,
        method: "post"
      })
        .then(resp => {
          commit("password_reset_success", resp);
          router.push("/login");
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
const mutations = {
  auth_success(state, resp) {
    state.status = "success";
    state.token = resp.token;
    Event.$emit("user-authenticated");
  },
  auth_error(state) {
    state.status = "error";
  },
  auth_logout(state) {
    state.token = "";
  },
  registration_success(state) {
    state.status = "registered";
  },
  send_forgot_password_mail_success(state) {
    state.reset_password_status = "email sent";
  },
  password_reset_success(state) {
    state.password_reset_status = "reset complete";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
