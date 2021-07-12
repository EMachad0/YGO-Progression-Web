<template>
  <div id="app">
    <div class="container-fluid bg-dark" id="nav">
      <header
          class="container d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4">
        <a class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-white text-decoration-none">
          <img class="bi me-2" :src="Logo" alt="" width="32" height="32">
        </a>

        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <router-link :to="`/collection/${guild}/${user}`" class="nav-link px-2 link-light">Collection</router-link>
          </li>
          <li>
            <router-link :to="`/deckbuilder/${guild}/${user}`" class="nav-link px-2 link-light">Deck Builder</router-link>
          </li>
        </ul>

        <div class="col-md-3 text-end">
          <!--<a href="/login"><button type="button" class="btn btn-primary">Log Out</button></a>-->
        </div>
      </header>
    </div>

    <main class="container-fluid min-vh-100">
      <slot>

      </slot>
    </main>

    <footer class="container-fluid bg-dark mt-5" id="footer">
      <div class="container py-3 text-white">
        <a href="https://github.com/EMachad0" class="mb-1"> &copy; Eliton Machado</a>
      </div>
    </footer>
  </div>
</template>

<script>
import Logo from '../assets/logo.png'

export default {
  name: 'Base',
  data() {
    return {
      Logo
    }
  },
  props: {
    guild: String,
    user: String
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat');

#nav a, #footer a {
  font-weight: bold;
}

#nav a.router-link-exact-active {
  color: #707070;
}

#app {
  background-color: rgb(36, 52, 71);
  font-family: Montserrat, sans-serif;
  color: white;
}

#app h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
}
</style>