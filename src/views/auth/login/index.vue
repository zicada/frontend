<template>
  <div>
    <main>
      <div class="uk-section uk-section-muted uk-flex uk-flex-middle uk-animation-fade" uk-height-viewport>
        <div class="uk-width-1-1">
          <div class="uk-container">
            <div class="uk-grid-margin uk-grid uk-grid-stack" uk-grid>
              <div class="uk-width-1-1@m">
                <div
                  class="uk-margin uk-width-large uk-margin-auto uk-card uk-card-default uk-card-body uk-box-shadow-large"
                >
                  <h3 class="uk-card-title uk-text-center">{{ $store.getters.appName }}</h3>
                  <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                      <span class="uk-form-icon" uk-icon="icon: mail"></span>
                      <input class="uk-input uk-form-large" type="text" v-model="email" />
                    </div>
                  </div>
                  <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                      <span class="uk-form-icon" uk-icon="icon: lock"></span>
                      <input class="uk-input uk-form-large" type="password" v-model="password" />
                    </div>
                  </div>
                  <div class="uk-margin">
                    <button
                      class="uk-button uk-button-primary uk-button-large uk-width-1-1"
                      @click="login()"
                    >Login</button>
                  </div>
                  <div class="uk-text-small uk-text-center">
                    Forgot Password?
                    <router-link to="/reset-password">Click here</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { AUTH_REQUEST } from "@/store/actions/auth";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      const { email, password } = this;
      this.$store
        .dispatch(AUTH_REQUEST, { email, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch(error => {
          this.$snack.danger({
            text: error.response.data.message
          });
        });
    }
  }
};
</script>