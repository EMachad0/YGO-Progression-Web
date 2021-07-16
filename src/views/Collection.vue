<template>
  <Base :guild="guild" :user="user">
    <h1 class="text-center mb-4">Collection</h1>
    <div class="container">
      <div class="my-form">
        <div class="row d-flex align-items-center align-items-stretch">
          <label class="form-label col-1 d-none d-xl-block" for="sort-param">Sort by</label>
          <div class="col">
            <select v-model="filters.field" @change="update_deck_list" class="form-control col" id="sort-param">
              <option selected>name</option>
              <option>atk</option>
              <option value="dff">def</option>
              <option>level</option>
              <option>scale</option>
              <option>link_val</option>
            </select>
          </div>
          <label class="form-label col-1 d-none d-xl-block" for="sort-order">Order</label>
          <div class="col">
            <select v-model="filters.dir" @change="update_deck_list" class="form-control col" id="sort-order">
              <option selected>asc</option>
              <option>desc</option>
            </select>
          </div>
          <label class="form-label col-1 d-none d-xl-block" for="set-filter">Set</label>
          <div class="col">
            <select v-model="filters.set" @change="update_deck_list" class="form-control col" id="set-filter">
              <option :value="null" selected>any</option>
              <option v-for="(set, i) in select_options['sets']" :key="i">{{ set }}</option>
            </select>
          </div>
          <label class="form-label col-1 d-none d-xl-block" for="rarity-filter">Rarity</label>
          <div class="col">
            <select v-model="filters.rarity" @change="update_deck_list" class="form-control col" id="rarity-filter">
              <option :value="null" selected>any</option>
              <option v-for="(rarity, i) in select_options['rarities']" :key="i">{{ rarity }}</option>
            </select>
          </div>
        </div>

        <div class="row align-items-center">
          <label class="form-label col-1 d-none d-xl-block" for="filter-type">Card Type</label>
          <div class="col">
            <select v-model="filters.type" @change="update_deck_list" class="form-control" id="filter-type">
              <option :value="null" selected>any</option>
              <option v-for="(v, i) in select_options['types']" :key="i">{{ v }}</option>
            </select>
          </div>
          <label class="form-label col-1 d-none d-xl-block" for="filter-attribute">Attribute</label>
          <div class="col">
            <select v-model="filters.attribute" @change="update_deck_list" class="form-control" id="filter-attribute">
              <option :value="null" selected>any</option>
              <option v-for="(v, i) in select_options['attributes']" :key="i">{{ v }}</option>
            </select>
          </div>
          <label class="form-label col-1 d-none d-xl-block" for="filter-race">Race</label>
          <div class="col">
            <select v-model="filters.race" @change="update_deck_list" class="form-control" id="filter-race">
              <option :value="null" selected>any</option>
              <option v-for="(v, i) in select_options['races']" :key="i">{{ v }}</option>
            </select>
          </div>
          <label class="form-label col-1 d-none d-xl-block" for="filter-archetype">Archetype</label>
          <div class="col">
            <select v-model="filters.archetype" @change="update_deck_list;" class="form-control" id="filter-archetype">
              <option :value="null" selected>any</option>
              <option v-for="(v, i) in select_options['archetypes']" :key="i">{{ v }}</option>
            </select>
          </div>
        </div>

        <div class="row align-items-center">
          <label class="form-label col-2 d-none d-xl-block" for="filter-name">Name Matching</label>
          <div class="col">
            <input v-model="filters.name" @change="update_deck_list" class="form-control" type="text" id="filter-name"
                   placeholder="Blue-Eyes White Dragon">
          </div>
          <label class="form-label col-2 d-none d-xl-block" for="filter-text">Text Matching</label>
          <div class="col">
            <input v-model="filters.text" @change="update_deck_list" class="form-control" type="text" id="filter-text"
                   placeholder="Draw two cards">
          </div>
        </div>

        <div class="row align-items-center">
          <div class="col">
            <b-form-select v-model="filters.limit" @change="update_deck_list" class="form-control fit-content">
              <option :value="30" selected>30</option>
              <option :value="60">60</option>
              <option :value="100">100</option>
            </b-form-select>
          </div>
          <div class="col mb-md-0 m-0 text-center align-text-bottom">
            {{ filters.offset }} -
            {{ (filters.limit + filters.offset > card_quantity ? card_quantity : filters.limit + filters.offset) }} of
            {{ card_quantity }}
          </div>
          <div class="col text-end">
            <b-button-group>
              <b-button size="sm" variant="outline-warning" @click="offset_sub(); update_deck_list(false);">
                <b-icon icon="chevron-left"></b-icon>
              </b-button>
              <b-button size="sm" variant="outline-warning" @click="offset_add(); update_deck_list(false);">
                <b-icon icon="chevron-right"></b-icon>
              </b-button>
            </b-button-group>
          </div>
        </div>
      </div>

      <hr>

      <div class="row" id="card-list">
        <div id="loader" :class="loader_class"></div>
        <div v-for="(card, i) in cards" :key="i" class="col-lg-2 m-0 p-0 my-card">
          <a :href="`https://db.ygoprodeck.com/card/?search=${card.card_cod}`" target="_blank">
            <img :src="get_img(card.cod_img)" alt="" class="img-fluid" draggable="false">
          </a>
        </div>
      </div>
      <hr>
      <div class="row m-2">
        <div class="col text-end">
          <b-button-group>
            <b-button size="sm" variant="outline-warning" @click="offset_sub(); update_deck_list(false);">
              <b-icon icon="chevron-left"></b-icon>
            </b-button>
            <b-button size="sm" variant="outline-warning" @click="offset_add(); update_deck_list(false);">
              <b-icon icon="chevron-right"></b-icon>
            </b-button>
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
      card_quantity: 0,
      cards: [],
      select_options: {},
      filters: {
        limit: 30,
        offset: 0,
        name: '',
        text: '',
        field: 'name',
        dir: 'asc',
        set: null,
        rarity: null,
        type: null,
        attribute: null,
        race: null,
        archetype: null
      },
      loader_class: ""
    }
  },
  methods: {
    update_deck_list(reset = true) {
      if (reset) this.offset_reset();
      this.loader_class = ""
      axios.get('https://ygo-prog-web.herokuapp.com/collection/?', {
        params: {
          guild: this.guild,
          user: this.user,
          limit: this.filters.limit,
          offset: this.filters.offset,
          name: (this.filters.name === '' ? null : '%' + this.filters.name + '%'),
          text: (this.filters.text === '' ? null : '%' + this.filters.text + '%'),
          set: this.filters.set,
          rarity: this.filters.rarity,
          field: this.filters.field,
          dir: this.filters.dir,
          type: this.filters.type,
          attribute: this.filters.attribute,
          race: this.filters.race,
          archetype: this.filters.archetype
        }
      }).then(response => {
        this.card_quantity = response.data.card_quantity
        this.cards = response.data.cards
        this.loader_class = "hide"
      });
    },
    update_options() {
      axios.get('https://ygo-prog-web.herokuapp.com/collection/player_option', {
        params: {
          guild: this.guild,
          user: this.user
        }
      }).then(response => {
        this.select_options = response.data;
      });
    },
    get_img(id) {
      return `https://storage.googleapis.com/ygoprodeck.com/pics/${id}.jpg`
    },
    offset_reset() {
      this.filters.offset = 0;
    },
    offset_limit() {
      if (this.filters.offset < 0) this.filters.offset = 0;
      if (this.filters.offset > this.card_quantity) this.filters.offset -= this.filters.limit;
    },
    offset_add() {
      this.filters.offset += this.filters.limit;
      this.offset_limit();
    },
    offset_sub() {
      this.filters.offset -= this.filters.limit;
      this.offset_limit();
    }
  },
  mounted() {
    this.update_deck_list();
    this.update_options();
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
  top: 75%;
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

.fit-content {
  width: fit-content;
}

.my-form label {
  margin: 0;
  font-weight: bold;
}

.my-form .row {
  margin-bottom: 1%;
}

@media (max-width: 1200px) {
  .my-form div.col {
    padding: 0;
  }
}

.my-card {
  max-width: 25%;
}

</style>