<template>
  <div
    class="uk-flex uk-flex-left uk-flex-column"
  >
    <div>
      <h2>{{ getProfile.name }}</h2>
      <h4 class="uk-text-capitalize">
        {{ getProfile.main_number ? getProfile.main_number : "" }}
      </h4>
      <h4 class="uk-text-capitalize">{{$t("balance") }}: {{ getProfile.balance }},-</h4>
      
      <h4>Transaksjoner</h4>
      <table class="uk-table uk-table-striped uk-table-overflow">
        <thead>
          <tr>
            <th>{{ $t("date") }}</th>
            <th>{{ $t("status") }}</th>
            <th>{{ $t("source") }}</th>
            <th>{{ $t("amount") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in getTransactions.data" :key="index">
            <th>{{ transaction.Date }}</th>

            <td>{{ transaction.TransactionStatus == 4 ? $t("success") : $t("error") }}</td>

            <td>{{ transaction.ChargeInitiator == 2 ? "web" : "tsip" }}</td>

            <th>{{ transaction.CreditAmount }},-</th>
          </tr>
        </tbody>
      </table>
      <pagination
        class="uk-pagination"
        :data="getTransactions"
        @pagination-change-page="getResults"
      ></pagination>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { AUTH_LOGOUT } from "@/store/actions/auth.js";
import { USER_REQUEST, USER_GET_TRANSACTIONS } from "@/store/actions/user";
import { settings } from "@/settings";

export default {
  data() {
    return {
      contact_number: "",
      code: "",
      balance: "",
      amount: "",
      should_store_token: true
    };
  },
  created: function() {},
  name: "profile",
  methods: {
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
    },
    getResults(page = 1) {
      this.$store.dispatch(USER_GET_TRANSACTIONS, page);
    },
  },
  computed: {
    ...mapGetters([
      "getProfile",
      "getToken",
      "isVerified",
      "isAdmin",
      "getTransactions"
    ])
  },
  beforeMount() {
    this.$store.dispatch(USER_REQUEST);
    this.$store.dispatch(USER_GET_TRANSACTIONS, 1);
  }
};
</script>
