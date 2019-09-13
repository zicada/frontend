<template>
  <div
    class="uk-flex uk-flex-left uk-flex-column"
  >
    <div class="uk-form" method="post">
      <div class="uk-form-group">
        <span>{{ $t("email") }}</span>
        <input
          type="email"
          id="email"
          class="uk-input"
          placeholder="user@example.com"
          v-model="email"
          required
        />
      </div>

      <div class="uk-form-group">
        <span>{{ $t("password") }}</span>
        <input type="password" id="password" class="uk-input" v-model="password" required />
      </div>

      <div class="uk-form-group">
        <span>{{ $t("confirm_password") }}</span>
        <input
          type="password"
          id="password_confirmation"
          class="uk-input"
          v-model="password_confirmation"
          required
        />
      </div>
      <button type="submit" class="uk-button uk-button-default" @click="resetPassword()">{{ $t("submit") }}</button>
    </div>
  </div>
</template>
<script>
import { AUTH_PASSWORD_RESET } from "@/store/actions/auth.js";
export default {
  data() {
    return {
      token: null,
      email: null,
      password: null,
      password_confirmation: null,
      has_error: false
    };
  },
  methods: {
    resetPassword() {
      this.$store
        .dispatch(AUTH_PASSWORD_RESET, {
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
          token: this.$route.params.token
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
