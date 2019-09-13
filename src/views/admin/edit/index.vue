<template>
  <div class="uk-flex uk-flex-left uk-flex-column">
    <div>
      <h2 class="uk-text-capitalize">{{ $t("edit") + " " + $t("customer") }}</h2>

      <div class="uk-margin uk-width-1-2 uk-card uk-card-small uk-card-body uk-box-shadow-medium">
        <h4>{{getCustomerDetails.MainNumber ? getCustomerDetails.MainNumber : ""}}</h4>
        <hr />
        <h4 class="uk-text-capitalize">{{ $t("balance") }}: {{this.balance | round}},-</h4>
      </div>

      <div class="uk-width-1-2 uk-card uk-card-small uk-card-body uk-box-shadow-medium">
        <div>
          <label class="uk-text-capitalize">{{ $t("name") }}</label>
          <input class="uk-input" type="text" v-model="customer_name" id="customer_name" />
        </div>
        <div>
          <label class="uk-text-capitalize">{{ $t("email") }}</label>
          <input class="uk-input" type="text" v-model="email" id="email" />
        </div>
        <div>
          <label class="uk-text-capitalize">{{ $t("street_address") }}</label>
          <input class="uk-input" type="text" v-model="street_address" id="street_address" />
        </div>
        <div>
          <label class="uk-text-capitalize">{{ $t("post_code") }}</label>
          <input class="uk-input" type="text" v-model="postcode" id="postcode" />
        </div>
        <div>
          <label class="uk-text-capitalize">{{ $t("city") }}</label>
          <input class="uk-input" type="text" v-model="city" id="city" />
        </div>
        <div>
          <label class="uk-text-capitalize">{{ $t("country") }}</label>
          <input class="uk-input" type="text" v-model="country" id="country" />
        </div>
        <hr>
        <div>
          <label class="uk-text-capitalize">{{ $t("credit_limit") }}</label>
          <input class="uk-input" type="text" v-model="credit_limit" id="credit_limit" />
        </div>
        <div class="uk-margin">
          <label class="uk-text-capitalize">
            <input class="uk-checkbox" type="checkbox" v-model="frozen" id="frozen" />
            {{ $t("frozen") }}
          </label>
        </div>
        <div>
          <button
            class="uk-button uk-button-default"
            @click.stop="updateCustomer(getCustomerDetails.Customer_ID ? getCustomerDetails.Customer_ID : false)"
          >{{ $t("update") + " " + $t("customer") }}</button>

          <button
            class="uk-button uk-button-danger"
            @click.stop="deleteCustomer(getCustomerDetails.Customer_ID)"
          >{{ $t("delete") + " " + $t("customer") }}</button>
        </div>
      </div>

      <ul class="uk-tab" data-uk-tab="{connect:'#my-id'}">
        <li>
          <a href>{{ $t("transaction_credits") }}</a>
        </li>
        <li>
          <a href>{{ $t("transaction_debits") }}</a>
        </li>
      </ul>
      <ul id="my-id" class="uk-switcher uk-margin">
        <li>
          <a href="#" id="autoplayer" data-uk-switcher-item="next"></a>
          <div
            class="uk-margin uk-width-1-2 uk-card uk-card-small uk-card-body uk-box-shadow-medium"
          >
            <h4>{{ $t("gift_free_minutes") }}</h4>
            <div>
              <label class="uk-text-capitalize">{{ $t("amount") }}</label>
              <input class="uk-input" type="text" v-model="gift_amount" id="gift_amount" />
            </div>
            <div>
              <button class="uk-button uk-button-default" @click.stop="addGift()">{{ $t("apply") }}</button>
            </div>
          </div>
          <div class="uk-margin">
            <table class="uk-table uk-table-striped">
              <thead>
                <tr>
                  <th>{{ $t("date") }}</th>
                  <th>{{ $t("status") }}</th>
                  <th>{{ $t("source") }}</th>
                  <th>{{ $t("amount") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(credit, index) in getTransactionCreditsByCustomerId.data" :key="index">
                  <th>{{ credit.Date }}</th>
                  <td>{{ credit.TransactionStatus == 4 ? "success" : "error" }}</td>
                  <td>{{ credit.ChargeInitiator == 2 ? "web" : "tsip" }}</td>
                  <th>{{ credit.CreditAmount }},-</th>
                </tr>
              </tbody>
            </table>
            <pagination
              class="uk-pagination"
              :data="getTransactionCreditsByCustomerId"
              @pagination-change-page="getCreditResults"
            ></pagination>
          </div>
        </li>

        <li>
          <div class="uk-margin">
            <table class="uk-table uk-table-striped">
              <thead>
                <tr>
                  <th>{{ $t("date") }}</th>
                  <th>{{ $t("duration") }}</th>
                  <th>{{ $t("amount") }}</th>
                  <th>{{ $t("balance") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(debit, index) in this.getTransactionDebitsByCustomerId.data"
                  :key="index"
                >
                  <th>{{ debit.Date }}</th>
                  <th>{{ debit.Duration }}</th>
                  <th>{{ debit.Amount | round }},-</th>
                  <th>{{ debit.NewBalance | round }},-</th>
                </tr>
              </tbody>
            </table>
            <pagination
              class="uk-pagination"
              :data="getTransactionDebitsByCustomerId"
              @pagination-change-page="getDebitResults"
            ></pagination>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import router from "./../../../router";
import { AUTH_LOGOUT } from "@/store/actions/auth.js";
import {
  ADMIN_GET_CUSTOMER_DETAILS,
  ADMIN_DELETE_USER_AND_CUSTOMER,
  ADMIN_GET_TRANSACTION_CREDITS_BY_CUSTOMER_ID,
  ADMIN_GET_TRANSACTION_DEBITS_BY_CUSTOMER_ID,
  ADMIN_UPDATE_CUSTOMER_DETAILS,
  ADMIN_ADD_TRANSACTION_TO_CUSTOMER_ACCOUNT
} from "@/store/actions/admin.js";

export default {
  data() {
    return {
      number: "",
      selectedDebitSource: 1,
      credit_limit: "",
      frozen: "",
      customer_name: "",
      email: "",
      street_address: "",
      postcode: "",
      city: "",
      country: "",
      gift_amount: "",
      balance: ""
    };
  },
  created: function() {},
  name: "edit-customer",
  filters: {
    round: function(value = 0, decimals = 0) {
      return (
        Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
      );
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
    },
    updateCustomer(id) {
      this.$store
        .dispatch(ADMIN_UPDATE_CUSTOMER_DETAILS, {
          Customer_ID: this.$route.params.customerId,
          CustomerName: this.customer_name,
          CreditLimit: this.credit_limit,
          Frozen: this.frozen,
          EmailAddress: this.email,
          StreetAddress: this.street_address,
          PostCode: this.postcode,
          City: this.city,
          Country: this.country
        })
        .then(() => {
          router.push("/admin");
        });
    },
    addGift() {
      this.$store
        .dispatch(ADMIN_ADD_TRANSACTION_TO_CUSTOMER_ACCOUNT, {
          CustomerAccount_ID: this.getCustomerDetails.accounts[0]
            .CustomerAccount_ID,
          amount: this.gift_amount
        })
        .then(() => {
          this.$store.dispatch(ADMIN_GET_TRANSACTION_CREDITS_BY_CUSTOMER_ID, {
            id: this.$route.params.customerId,
            page: 1
          });
          this.balance = Number(this.balance) + Number(this.gift_amount);
        });
    },
    getCreditResults(page = 1) {
      this.$store
        .dispatch(ADMIN_GET_TRANSACTION_CREDITS_BY_CUSTOMER_ID, {
          id: this.$route.params.customerId,
          page: page
        })
        .then(() => {});
    },
    getDebitResults(page = 1) {
      this.$store
        .dispatch(ADMIN_GET_TRANSACTION_DEBITS_BY_CUSTOMER_ID, {
          id: this.$route.params.customerId,
          page: page
        })
        .then(() => {});
    },
    deleteCustomer(id) {
      this.$store.dispatch(ADMIN_DELETE_USER_AND_CUSTOMER, id).then(() => {
        router.push("/admin");
      });
    }
  },
  computed: {
    ...mapGetters([
      "getCustomerDetails",
      "getTransactionCreditsByCustomerId",
      "getTransactionDebitsByCustomerId"
    ])
  },
  beforeMount() {
    this.$store
      .dispatch(ADMIN_GET_CUSTOMER_DETAILS, this.$route.params.customerId)
      .then(() => {
        this.customer_name = this.getCustomerDetails.CustomerName;
        this.credit_limit = this.getCustomerDetails.accounts[0].debit_source
          ? this.getCustomerDetails.accounts[0].debit_source.CreditLimit
          : 0;
        this.frozen = this.getCustomerDetails.accounts[0].debit_source
          ? this.getCustomerDetails.accounts[0].debit_source.Frozen
          : 0;
        this.email = this.getCustomerDetails.EmailAddress;
        this.street_address = this.getCustomerDetails.StreetAddress;
        this.postcode = this.getCustomerDetails.PostCode;
        this.city = this.getCustomerDetails.City;
        this.country = this.getCustomerDetails.Country;
        this.balance = this.getCustomerDetails.accounts[0].Balance;
      });

    this.$store
      .dispatch(ADMIN_GET_TRANSACTION_CREDITS_BY_CUSTOMER_ID, {
        id: this.$route.params.customerId,
        page: 1
      })
      .then(() => {
        this.transaction_credits = this.getTransactionCreditsByCustomerId.data;
      });

    this.$store
      .dispatch(ADMIN_GET_TRANSACTION_DEBITS_BY_CUSTOMER_ID, {
        id: this.$route.params.customerId,
        page: 1
      })
      .then(() => {
        this.transaction_debits = this.getTransactionDebitsByCustomerId.data;
      });
  }
};
</script>
