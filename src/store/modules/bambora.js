/* eslint-disable promise/param-names */
import {
  BAMBORA_PAYMENT_REQUEST,
  BAMBORA_QUICK_PAYMENT_REQUEST,
  BAMBORA_UPDATE_BALANCE,
} from "../actions/bambora";
import { apiCall, api_routes } from "@/utils/api";

const state = {
  status: "",
  token: "",
  };

const getters = {
  getToken: state => state.token,
};

const actions = {
  [BAMBORA_PAYMENT_REQUEST]: ({ commit }, request) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.bambora.pay,
        data: request,
        method: "post"
      })
        .then(resp => {
          commit("payment_success", resp.data);
          resolve(resp);
        })
        .catch(err => {
          commit("payment_fail", err);
          reject(err);
        });
    });
  },
  [BAMBORA_QUICK_PAYMENT_REQUEST]: ({ commit }, request) => {
    return new Promise((resolve, reject) => {
      apiCall({
        url: api_routes.bambora.quickpay,
        data: request,
        method: "post"
      })
        .then(resp => {
          commit("payment_success", resp.data);
          resolve(resp);
        })
        .catch(err => {
          commit("payment_fail", err);
          reject(err);
        });
    });
  },
  [BAMBORA_UPDATE_BALANCE]: ({ commit }, amount) => {
    commit("update_balance", amount, { root: true });
    
  }
};

const mutations = {
  payment_success(state, resp) {
    state.status = "success";
    state.token = resp.token;
  },
  payment_fail(state, err) {
    state.status = err;
  }

};

export default {
  state,
  getters,
  actions,
  mutations
};
