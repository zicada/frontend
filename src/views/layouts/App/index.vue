<template>
  <div class="uk-container">
    <nav class="uk-navbar uk-margin-large-bottom">
      <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
          <li class="uk-active">
            <router-link to="/">
              Veileder
              <strong>Tjenester</strong>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="uk-navbar-right">
        <ul class="uk-navbar-nav uk-visible@s">
          <li>
            <router-link class="uk-text-uppercase" to="/faq">faq</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/about">om oss</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/terms">{{ $t("terms_and_conditions") }}</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/quickpay">{{ $t("quickpay") }}</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/profile">{{ $t("profile") }}</router-link>
          </li>
          <li v-if="$store.getters.getProfile.is_admin">
            <router-link class="uk-text-uppercase" to="/admin">admin</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/agent">bli veileder</router-link>
          </li>
          <li class="uk-nav-divider"></li>
          <li v-if="$store.getters.isAuthenticated">
            <a @click="logout()">
              <span class="uk-margin-small-right" uk-icon="icon: sign-out"></span>
              Logout
            </a>
          </li>
          <li v-if="!$store.getters.isAuthenticated">
            <a href="/login">
              <span class="uk-margin-small-right" uk-icon="icon: sign-out"></span>
              Login
            </a>
          </li>
        </ul>
        <a
          href="#"
          class="uk-navbar-toggle uk-hidden@s"
          uk-navbar-toggle-icon
          uk-toggle="target: #sidenav"
        >
          <span class="uk-margin-small-right">MENY</span>
        </a>
      </div>
    </nav>

    <div id="sidenav" uk-offcanvas="overlay: true; mode: push; flip: true" class="uk-offcanvas">
      <div class="uk-offcanvas-bar">
        <ul class="uk-nav">
          <li>
            <router-link class="uk-text-uppercase" to="/faq">faq</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/about">om oss</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/terms">{{ $t("terms_and_conditions") }}</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/quickpay">{{ $t("quickpay") }}</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/profile">{{ $t("profile") }}</router-link>
          </li>
          <li v-if="$store.getters.getProfile.is_admin">
            <router-link class="uk-text-uppercase" to="/admin">admin</router-link>
          </li>
          <li>
            <router-link class="uk-text-uppercase" to="/agent">bli veileder</router-link>
          </li>
          <li class="uk-nav-divider"></li>
          <li v-if="$store.getters.isAuthenticated">
            <a @click="logout()">
              <span class="uk-margin-small-right" uk-icon="icon: sign-out"></span>
              Logout
            </a>
          </li>
          <li v-if="!$store.getters.isAuthenticated">
            <a href="/login">
              <span class="uk-margin-small-right" uk-icon="icon: sign-out"></span>
              Login
            </a>
          </li>
        </ul>
      </div>
    </div>
    <router-view></router-view>
    <footer class="uk-flex">
      <div class="uk-margin">
      </div>
    </footer>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from "@/store/actions/auth";
export default {
  name: "app",
  methods: {
    logout() {
      //window.UIkit.offcanvas(this.$refs.offcanvasMenu).hide();
      this.$store.dispatch(AUTH_LOGOUT);
    }
  }
};
</script>
