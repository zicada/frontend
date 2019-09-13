<template>
  <div class="uk-flex uk-flex-left uk-flex-column">
    <div class="uk-form" autocomplete="off" method="post">
        <span>E-mail</span>
        <input type="email" id="email" class="uk-input" placeholder="user@example.com" v-model="email" required/>
      <button type="submit" class="uk-button uk-button-default" @click="requestResetPassword()">{{ $t("submit") }}</button>
    </div>
  </div>
</template>
<script>
import { AUTH_FORGOT_PASSWORD } from "@/store/actions/auth.js";
export default {
  data() {
    return {
      email: null,
      has_error: false
    };
  },
  methods: {
    requestResetPassword() {
      const { email } = this;
      this.$store
        .dispatch(AUTH_FORGOT_PASSWORD, {
          email
        })
        .catch(error => {
          this.$snack.danger({
            text: error.response.data
          });
        });
    }
  }
};
</script>

