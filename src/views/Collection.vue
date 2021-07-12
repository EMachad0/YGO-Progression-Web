<template>
  <Base :guild="guild" :user="user">
    <h1 class="text-center">Collection</h1>
    <div class="container">
      <div class="row m-2">
        <div class="col">
          <label class="form-label" for="sort-param">Sort by</label>
          <select v-model="filters.field" @change="update_deck_list" class="form-control" id="sort-param">
            <option selected>name</option>
            <option>atk</option>
            <option value="dff">def</option>
            <option>level</option>
            <option>scale</option>
            <option>link_val</option>
          </select>
        </div>
        <div class="col">
          <label class="form-label" for="sort-order">Order</label>
          <select v-model="filters.dir" @change="update_deck_list" class="form-control" id="sort-order">
            <option selected>asc</option>
            <option>desc</option>
          </select>
        </div>
        <div class="col">
          <label class="form-label" for="filter-name">Name</label>
          <input v-model="filters.name" @change="update_deck_list" class="form-control" type="text" id="filter-name"
                 placeholder="Blue-Eyes White Dragon">
        </div>
      </div>
      <div class="row m-2 d-flex flex-wrap align-items-center justify-content-center justify-content-md-between">
        <div class="col-2">
          <b-form-select v-model="filters.limit" @change="update_deck_list" class="form-control">
            <option selected>30</option>
            <option>60</option>
            <option>100</option>
          </b-form-select>
        </div>
        <div class="col-8 mb-md-0 m-0 text-center align-text-bottom">
          {{filters.limit * filters.offset}} - {{filters.limit * (1 + filters.offset)}}
        </div>
        <div class="col-2 text-end">
          <b-button-group>
            <b-button size="sm" variant="outline-warning" @click="filters.offset = (filters.offset !== 0? filters.offset-1:0); update_deck_list();"> L </b-button>
            <b-button size="sm" variant="outline-warning" @click="filters.offset++; update_deck_list();"> R </b-button>
          </b-button-group>
        </div>
      </div>
      <hr>
      <div class="row" id="card-list">
        <div id="loader" :class="loader_class"></div>
        <div v-for="(card, i) in cards" :key="i" class="col-md-2 m-0 p-0">
          <a :href="`https://db.ygoprodeck.com/card/?search=${card.card_cod}`" target="_blank">
            <img :src="get_img(card.cod_img)" alt="" class="img-fluid" loading="lazy" draggable="false">
          </a>
        </div>
      </div>
      <hr>
      <div class="row m-2">
        <div class="col text-end">
          <b-button-group>
            <b-button size="sm" variant="outline-warning" @click="filters.offset = (filters.offset !== 0? filters.offset-1:0); update_deck_list();"> L </b-button>
            <b-button size="sm" variant="outline-warning" @click="filters.offset++; update_deck_list();"> R </b-button>
          </b-button-group>
        </div>
      </div>
    </div>
  </Base>
</template>

<script>
import Base from '@/components/Base.vue';
import axios from 'axios';


export default {
  name: "Collection",
  components: {
    Base
  },
  data() {
    return {
      cards: [],
      filters: {limit: 30, offset: 0, name: '', field: 'name', dir: 'asc'},
      loader_class: ""
    }
  },
  methods: {
    update_deck_list() {
      let api_url = `https://ygo-prog-web.herokuapp.com/api/?&guild=${this.guild}&user=${this.user}&limit=${this.filters.limit}&offset=${this.filters.offset * this.filters.limit}&name=%${this.filters.name}%&field=${this.filters.field}&dir=${this.filters.dir}`
      console.log(api_url)
      this.loader_class = ""
      axios.get(api_url).then(response => {
        this.cards = response.data
        this.loader_class = "hide"
      });
    },
    get_img(id) {
      return `https://storage.googleapis.com/ygoprodeck.com/pics/${id}.jpg`
    }
  },
  mounted() {
    console.log(this.guild, this.user);
    this.update_deck_list();
  },
  props: {
    guild: String,
    user: String
  }
}
</script>

<style scoped>

#loader {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 64px;
  height: 64px;
  margin: 0 0 0 -32px;
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.hide {
  display: none;
}

</style>