<template>
  <div class="uk-flex uk-flex-left uk-flex-column">
    <div>
      <div class="uk-width-1-2 uk-card uk-card-small uk-card-body uk-box-shadow-medium">
        <h4 class="uk-text-capitalize">{{ $t("create_new_account") }}</h4>
        <div>
          <label class="uk-text-capitalize">{{ $t("number") }}</label>
          <vue-tel-input v-model="number" v-bind="telProps" @onInput="onNumberInput" />
          <button class="uk-button uk-button-default" @click="makeUserAndCustomerAccount()">{{ $t("submit") }}</button>
        </div>
      </div>

      <div class="uk-margin-medium uk-width-1-2">
        <h4 class="uk-text-capitalize">{{ $t("customers") }}</h4>
        <label class="uk-text-capitalize">{{ $t("filter") }}</label>
        <input
          class="uk-input"
          type="search"
          v-model="query"
          id="query"
          @keyup="getResults(1, query)"
        />
      </div>
      <div>
        <table class="uk-table uk-table-striped uk-table-hover uk-table-overflow">
          <thead>
            <tr>
              <th>{{ $t("date") }}</th>
              <th>{{ $t("name") }}</th>
              <th>{{ $t("number") }}</th>
              <th>{{ $t("balance") }}</th>
              <th>{{ $t("credit_limit") }}</th>
              <th>{{ $t("credit_status") }}</th>
            </tr>
          </thead>
          <tbody>
            <router-link
              tag="tr"
              v-for="(customer, index) in getCustomers.data"
              :key="index"
              :to="{ name: 'edit-customer', params: { customerId: customer.Customer_ID }}"
            >
              <td>{{ customer.DateCreated }}</td>
              <td>{{ customer.CustomerName }}</td>

              <td>{{ customer.MainNumber }}</td>
              <td>{{ customer.accounts[0].Balance | round}}</td>
              <template v-if="customer.accounts[0].debit_source">
                <td>{{ customer.accounts[0].debit_source.CreditLimit }}</td>
                <template v-if="customer.accounts[0].debit_source.Frozen">
                  <td class="uk-text-danger">{{ $t("frozen") }}</td>
                </template>
                <template v-else-if="customer.accounts[0].debit_source.Frozen == 0">
                  <td class="uk-text-success">{{ $t("active") }}</td>
                </template>
                <template v-else>
                  <td class="uk-text">{{ $t("none") }}</td>
                </template>
              </template>
              <template v-else>
                <td>0</td>
                <td>{{ $t("none") }}</td>
              </template>
            </router-link>
          </tbody>
        </table>
        <pagination class="uk-pagination" :data="getCustomers" @pagination-change-page="getResults"></pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import router from "./../../router";
import { AUTH_LOGOUT } from "@/store/actions/auth.js";
import {
  ADMIN_GET_CUSTOMERS,
  ADMIN_MAKE_USER_AND_CUSTOMER_ACCOUNT,
  ADMIN_DELETE_USER_AND_CUSTOMER
} from "@/store/actions/admin.js";

export default {
  data() {
    return {
      number: "",
      query: "",
      full_number: "",
      telProps: {
        placeholder: "Fyll inn et telefonnummer",
        required: true,
        preferredCountries: ["SE", "DK"]
      }
    };
  },
  created: function() {},
  name: "admin",
  filters: {
    round: function(value = 0, decimals = 0) {
      return (
        Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
      );
    }
  },
  methods: {
    onNumberInput({ number, isValid, country }) {
      this.full_number = number.e164;
    },
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
    },
    getResults(page = 1, query = "") {
      this.$store.dispatch(ADMIN_GET_CUSTOMERS, { page: page, query: query });
    },
    deleteCustomer(id) {
      this.$store.dispatch(ADMIN_DELETE_USER_AND_CUSTOMER, id);
    },
    makeUserAndCustomerAccount() {
      this.$store
        .dispatch(ADMIN_MAKE_USER_AND_CUSTOMER_ACCOUNT, {
          number: this.full_number
        })
        .then(() => {
          this.$store.dispatch(ADMIN_GET_CUSTOMERS, {
            page: 1,
            query: this.query
          });
        });
    }
  },
  computed: {
    ...mapGetters(["getCustomers"])
  },
  beforeMount() {
    this.$store.dispatch(ADMIN_GET_CUSTOMERS, { page: 1, query: this.query });
  }
};
</script>
