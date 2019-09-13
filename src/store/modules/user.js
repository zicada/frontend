/* eslint-disable promise/param-names */
import {
  USER_REQUEST,
  USER_SEND_VERIFICATION_CODE,
  USER_VERIFY,
  USER_NAME_LOOKUP,
  USER_GET_TRANSACTIONS
} from "../actions/user";
import { settings } from "@/settings";
import { apiCall, api_routes } from "@/utils/api";
import { AUTH_LOGOUT } from "../actions/auth";
import axios from "axios";

const state = {
  status: "",
  verified: false,
  profile: {},
  sms: "",
  is_admin: false,
  name_lookup: "",
  transactions: {}
};

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded(state) {
    return function() {
      return state.profile.name ? true : false;
    };
  },
  isVerified: state => state.verified,
  isAdmin: state => state.is_admin,
  getNameLookup: state => state.name_lookup,
  getTransactions: state => state.transactions
};

const actions = {
  [USER_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.user.me })
        .then(resp => {
          commit("login_success", resp.data);
          resolve(resp);
        })
        .catch(err => {
          commit("login_fail", err);
          // if resp is unauthorized, logout, too
          dispatch(AUTH_LOGOUT);
          reject(err);
        });
    });
  },
  [USER_GET_TRANSACTIONS]: ({ commit }, page) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.user.transactions + "?page=" + page })
        .then(resp => {
          commit("transactions_loaded_success", resp.data);
          resolve(resp);
        })
        .catch(err => {
          commit("transactions_loaded_error", err);
          reject(err);
        });
    });
  },
  [USER_SEND_VERIFICATION_CODE]: ({ commit }, verification) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.user.sendverification,
        data: verification,
        method: "post"
      })
        .then(resp => {
          commit("send_verification_code_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("send_verification_code_fail", err);
          reject(err);
        });
    });
  },
  [USER_VERIFY]: ({ commit }, verification) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.user.verify,
        data: verification,
        method: "post"
      })
        .then(resp => {
          commit("verification_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("verification_fail", err);
          reject(err);
        });
    });
  },
  [USER_NAME_LOOKUP]: ({ commit }, number) => {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: api_routes.user.namelookup + "/" + number,
        headers: { Authorization: "Bearer " + settings.TFSERVICES_KEY }
      })
        .then(resp => {
          commit("name_lookup_success", resp.data);
          resolve(resp);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  login_success(state, resp) {
    state.status = "success";
    state.profile = resp;
    state.verified = resp.verified == 1 ? true : false;
    state.is_admin = resp.is_admin == 1 ? true : false;
  },
  login_fail(state, err) {
    state.status = err;
  },
  verification_success(state) {
    state.verified = true;
  },
  verification_fail(state) {
    state.verified = false;
  },
  send_verification_code_success(state) {
    state.sms = "Sent successfully";
  },
  send_verification_code_fail(state, err) {
    state.sms = err;
  },
  update_balance(state, resp) {
    state.profile.balance += resp;
  },
  name_lookup_success(state, resp) {
    state.name_lookup = resp.name;
  },
  transactions_loaded_success(state, resp) {
    state.transactions = resp;
  },
  transactions_loaded_error(state) {
    state.transactions = {};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
