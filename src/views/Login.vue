<template>
  <div class="parent-body vh-100 text-center">
    <form class="form-signin">
      <img class="mb-4" :src="Logo" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">Please select your discord guild and user</h1>
      <b-form-select v-model="guild" :disabled="!guild_options" class="form-select input-guild"
                     :options="guild_options" @change="update_user_options()"></b-form-select>
      <b-form-select v-model="user" :disabled="!user_options" class="form-select input-user"
                     :options="user_options"></b-form-select>
      <router-link :to="`/collection/${guild}/${user}`" :class="{ disabled: !user }">
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign In</button>
      </router-link>
      <p class="mt-5 mb-3 text-muted">© Eliton Machado da Silva</p>
    </form>
  </div>
</template>

<script>
import Logo from "@/assets/logo.png";
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      Logo,
      guild: null,
      user: null,
      guild_options: null,
      user_options: null,
    }
  },
  methods: {
    update_guild_options() {
      axios.get(`${process.env.VUE_APP_BACKEND_URL}/server/all_servers`).then(response => {
        this.guild_options = response.data.map(g => ({'value': g['server_cod'], 'text': g['name']}))
      });
    },
    update_user_options() {
      axios.get(`${process.env.VUE_APP_BACKEND_URL}/player/guild_players`, {
        params: {
          guild: this.guild,
        }
      }).then(response => {
        this.user_options = response.data.map(u => ({'value': u['user_cod'], 'text': u['name']}))
      });
    },
  }, mounted() {
    this.update_guild_options()
  },
}
</script>

<style scoped>

.parent-body {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}

.form-signin .form-select {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}

.form-signin .form-select:focus {
  z-index: 2;
}

.form-signin .input-guild {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin .input-user {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

</style>