<template>
  <div
    class="uk-flex uk-flex-left uk-flex-column"
  >
    <div class="uk-form">
      <div class="uk-margin">
        <label class="uk-label" for="text">{{ $t("number") }}</label>
        <vue-tel-input v-model="main_number" v-bind="telProps" @onInput="onNumberInput" />
      </div>

      <div class="uk-margin">
        <label class="uk-label" for="amount">{{ $t("amount") }}</label>
        <input class="uk-input" type="text" v-model="amount" id="amount" />
        <button class="uk-button uk-button-default" @click="pay()">{{ $t("pay") }}</button>
      </div>

      <label v-if="!this.has_completed_purchase">
        <input class="uk-checkbox" type="checkbox" v-model="should_store_token" />
        {{ $t("store_token") }}
      </label>

      <div v-if="this.has_completed_purchase && should_store_token">
        <div class="uk-margin">
          <label>
            <input
              class="uk-checkbox uk-text-capitalize"
              type="checkbox"
              v-model="wants_to_register"
            />
            {{ $t("do_you_want_to_register") }} ?
          </label>
        </div>
        <div v-if="this.wants_to_register">
          <div v-if="!this.verified">
            <button
              class="uk-button uk-button-default"
              @click="sendVerificationCode()"
            >{{ $t("send_verification_code") }}</button>

            <div class="uk-margin">
              <label class="uk-label" for="code">{{ $t("code") }}</label>
              <input class="uk-input" type="text" v-model="code" id="code" />
              <button class="uk-button uk-button-default" @click="verify()">{{ $t("submit") }}</button>
            </div>
          </div>
          <div class="uk-margin" v-if="this.verified">
            <div class="uk-margin">
              <label class="uk-label" for="text">{{ $t("full_name") }}</label>
              <input class="uk-input" type="text" v-model="name" id="name" />
              <button
                class="uk-button uk-button-default"
                @click="nameLookup()"
              >{{ $t("look_up_name") }}</button>
            </div>
            <div class="uk-margin">
              <label class="uk-label" for="email">{{ $t("email_address") }}</label>
              <input class="uk-input" type="email" v-model="email" id="email" />
            </div>

            <div class="uk-margin">
              <label class="uk-label" for="password">{{ $t("password") }}</label>
              <input class="uk-input" type="password" v-model="password" id="password" />
            </div>

            <div class="uk-margin">
              <label class="uk-label" for="password">{{ $t("confirm_password") }}</label>
              <input class="uk-input" type="password" v-model="c_password" id="c_password" />
            </div>

            <div class="uk-margin">
              <button
                class="uk-button uk-button-default"
                @click="completeRegistration()"
              >{{ $t("complete_registration") }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import {
  AUTH_LOGOUT,
  AUTH_SIGNUP,
  AUTH_COMPLETE_QUICKPAY_REGISTRATION
} from "@/store/actions/auth.js";
import {
  USER_REQUEST,
  USER_SEND_VERIFICATION_CODE,
  USER_GET_NAME_BY_NUMBER,
  USER_VERIFY,
  USER_NAME_LOOKUP
} from "@/store/actions/user";
import {
  BAMBORA_QUICK_PAYMENT_REQUEST,
  BAMBORA_COMPLETE_PURCHASE,
  BAMBORA_UPDATE_BALANCE
} from "@/store/actions/bambora";
import * as Bambora from "@bambora/checkout-sdk-web";
import { settings } from "@/settings";

export default {
  data() {
    return {
      name: "",
      main_number: "",
      full_number: "",
      code: "",
      email: "",
      password: "",
      c_password: "",
      amount: "",
      should_store_token: true,
      has_completed_purchase: false,
      verified: false,
      wants_to_register: false,
      telProps: {
        placeholder: "Fyll inn et telefonnummer",
        required: true,
        preferredCountries: ["SE", "DK", ],
      }
    };
  },
  created: function() {},
  name: "quickpay",
  methods: {
    onNumberInput({ number, isValid, country }) {
      this.full_number = number.e164;
    },
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
    },
    sendVerificationCode() {
      this.$store
        .dispatch(USER_SEND_VERIFICATION_CODE, {
          contact_number: this.full_number
        })
        .catch(error => {
          this.$snack.danger({
            text: error.response.data.message
          });
        });
    },
    verify() {
      this.$store
        .dispatch(USER_VERIFY, {
          main_number: this.full_number,
          code: this.code
        })
        .then(() => {
          this.verified = this.isVerified;
        })
        .catch(error => {
          this.verified = false;
          this.$snack.danger({
            text: error.response.message
          });
        });
    },
    completeRegistration() {
      const { name, main_number, email, password, c_password } = this;
      this.$store
        .dispatch(AUTH_COMPLETE_QUICKPAY_REGISTRATION, {
          name,
          number: this.full_number,
          email,
          password,
          c_password
        })
        .then(() => {
          this.wants_to_register = false;
          this.has_completed_purchase = false;
          this.$router.push("/profile");
        })
        .catch(error => {
          this.$snack.danger({
            text: error.response.data.message
          });
        });
    },
    pay() {
      var checkout = new Bambora.ModalCheckout(null);
      const { amount, should_store_token } = this;
      this.$store
        .dispatch(BAMBORA_QUICK_PAYMENT_REQUEST, {
          amount,
          number: this.full_number,
          should_store_token
        })
        .then(() => {
          checkout
            .initialize(this.getToken)
            .then(() => {
              checkout.show();
            })
            .then(() => {
              checkout.on(Bambora.Event.Close, this.completePurchase);
            });
        })
        .catch(error => {
          this.$snack.danger({
            text: error.response.data.message
          });
        });
    },
    completePurchase() {
      this.$store
        .dispatch(BAMBORA_UPDATE_BALANCE, Number(this.amount))
        .then(() => {
          this.amount = "";
          this.has_completed_purchase = true;
        })
        .catch(error => {
          this.$snack.danger({
            text: error.response.data.message
          });
        });
    },
    nameLookup() {
      this.$store
        .dispatch(USER_NAME_LOOKUP, Number(this.full_number))
        .then(() => {
          this.name = this.getNameLookup;
        })
        .catch(error => {
          this.$snack.danger({
            text: error.response.data.message
          });
        });
    }
  },
  computed: {
    ...mapGetters(["getNameLookup", "isVerified", "getToken", "isAdmin"])
  }
};
</script>

