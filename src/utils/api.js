import axios from "axios";
import { settings } from "@/settings";

const API_SERVER = settings.API_SERVER;
const TFSERVICES_SERVER = settings.TFSERVICES_SERVER;

export const api_routes = {
  user: {
    login: API_SERVER + "login",
    signup: API_SERVER + "register",
    me: API_SERVER + "me",
    sendverification: API_SERVER + "send-verification",
    verify: API_SERVER + "verify-user",
    namelookup: TFSERVICES_SERVER + "lookup",
    getnamebynumber: API_SERVER + "get-name",
    forgotpassword: API_SERVER + "auth/forgot",
    passwordreset: API_SERVER + "auth/reset",
    completequickpay: API_SERVER + "complete-quickpay",
    transactions: API_SERVER + "transactions"
  },
  bambora: {
    pay: API_SERVER + "bambora",
    quickpay: API_SERVER + "bambora-quick"
  },
  admin: {
    getcustomers: API_SERVER + "getcustomers",
    getcustomerdetails: API_SERVER + "getcustomerdetails",
    getavailabledebitsources: API_SERVER + "getavailabledebitsources",
    makeuserandcustomeraccount: API_SERVER + "makeuserandcustomeraccount",
    updatecustomeraccountdebitsource: API_SERVER + "updatecustomeraccountdebitsource",
    deletecustomer: API_SERVER + "deletecustomer",
    getcustomeraccount: API_SERVER + "getcustomeraccount",
    transactioncreditsbycustomerid: API_SERVER + "transactioncreditsbycustomerid",
    transactiondebitsbycustomerid: API_SERVER + "transactiondebitsbycustomerid",
    updatecustomerdetails: API_SERVER + "updatecustomerdetails",
    addtransactioncredittocustomeraccount: API_SERVER + "addtransactioncredittocustomeraccount"
  }
};

export const apiCall = ({ url, method, ...args }) =>
  new Promise((resolve, reject) => {
    let token = localStorage.getItem("user-token") || "";

    if (token)
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

    try {
      axios({
        method: method || "get",
        url: url,
        ...args
      })
        .then(resp => {
          resolve(resp.data);
        })
        .catch(error => {
          reject(error);
        });
    } catch (err) {
      reject(new Error(err));
    }
  });
