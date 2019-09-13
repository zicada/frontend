/* eslint-disable promise/param-names */

import { apiCall, api_routes } from "@/utils/api";
import {
  ADMIN_GET_CUSTOMERS,
  ADMIN_GET_AVAILABLE_DEBIT_SOURCES,
  ADMIN_MAKE_USER_AND_CUSTOMER_ACCOUNT,
  ADMIN_DELETE_USER_AND_CUSTOMER,
  ADMIN_GET_CUSTOMERACCOUNT,
  ADMIN_GET_CUSTOMER_DETAILS,
  ADMIN_GET_TRANSACTION_CREDITS_BY_CUSTOMER_ID,
  ADMIN_GET_TRANSACTION_DEBITS_BY_CUSTOMER_ID,
  ADMIN_UPDATE_CUSTOMER_DETAILS,
  ADMIN_ADD_TRANSACTION_TO_CUSTOMER_ACCOUNT
} from "@/store/actions/admin";

const state = {
  status: "",
  customers: {},
  customerdetails: {},
  customeraccount: "",
  debit_sources: {},
  error: "",
  transaction_credits: {},
  transaction_debits: {}
};

const getters = {
  getCustomers: state => state.customers,
  getCustomerDetails: state => state.customerdetails,
  getAvailableDebitSources: state => state.debit_sources,
  getCustomerAccount: state => state.customeraccount,
  getTransactionCreditsByCustomerId: state => state.transaction_credits,
  getTransactionDebitsByCustomerId: state => state.transaction_debits,
};

const actions = {
  [ADMIN_GET_CUSTOMERS]: ({ commit }, request) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.getcustomers + "?page=" + request.page + "&query=" + request.query, method: "get" })
        .then(resp => {
          commit("get_customers_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_GET_TRANSACTION_CREDITS_BY_CUSTOMER_ID]: ({ commit }, request) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.transactioncreditsbycustomerid + "/" + request.id + "?page=" + request.page, method: "get" })
        .then(resp => {
          commit("get_transaction_credits_by_customer_id_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_GET_TRANSACTION_DEBITS_BY_CUSTOMER_ID]: ({ commit }, request) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.transactiondebitsbycustomerid + "/" + request.id + "?page=" + request.page, method: "get" })
        .then(resp => {
          commit("get_transaction_debits_by_customer_id_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_GET_CUSTOMERACCOUNT]: ({ commit }, id) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.getcustomeraccount + "/" + id, method: "get" })
        .then(resp => {
          commit("get_customeraccount_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_GET_CUSTOMER_DETAILS]: ({ commit }, id) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.getcustomerdetails + "/" + id, method: "get" })
        .then(resp => {
          commit("get_customer_details_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_GET_AVAILABLE_DEBIT_SOURCES]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.getavailabledebitsources, method: "get" })
        .then(resp => {
          commit("get_available_debit_sources_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_MAKE_USER_AND_CUSTOMER_ACCOUNT]: ({ commit }, number) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.makeuserandcustomeraccount, data: number, method: "post" })
        .then(resp => {
          commit("admin_make_user_and_customer_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_ADD_TRANSACTION_TO_CUSTOMER_ACCOUNT]: ({ commit }, request) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.addtransactioncredittocustomeraccount, data: request, method: "post" })
        .then(resp => {
          commit("admin_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_UPDATE_CUSTOMER_DETAILS]: ({ commit }, request) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.updatecustomerdetails + "/" + request.Customer_ID, data: request, method: "put" })
        .then(resp => {
          commit("admin_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  },
  [ADMIN_DELETE_USER_AND_CUSTOMER]: ({ commit }, id) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: api_routes.admin.deletecustomer + "/" + id, method: "delete" })
        .then(resp => {
          commit("admin_success", resp);
          resolve(resp);
        })
        .catch(err => {
          commit("admin_error", err);
          reject(err);
        });
    });
  }
};
const mutations = {
  get_customers_success(state, resp) {
    state.customers = resp;
  },
  get_transaction_credits_by_customer_id_success(state, resp) {
    state.transaction_credits = resp.data;
  },
  get_transaction_debits_by_customer_id_success(state, resp) {
    state.transaction_debits = resp.data;
  },
  get_customer_details_success(state, resp) {
    state.customerdetails = resp;
  },
  get_customeraccount_success(state, resp) {
    state.customeraccount = resp;
  },
  get_available_debit_sources_success(state, resp) {
    state.debit_sources = resp.data;
  },
  admin_success(state, resp) {
    state.status = resp;
  },
  admin_make_user_and_customer_success(state, resp) {
    state.customerdetails = resp.data;
  },
  admin_error(state, err) {
    state.error = err;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
