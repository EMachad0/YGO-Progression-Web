<template>
  <Base :guild="guild" :user="user">
    <h1 class="text-center">Deck Builder</h1>
    <div class="container-fluid row p-2 d-flex justify-content-center">
      <div class="sticky col-3 text-center">
        <img :src="get_img(display)" alt="" class="img-fluid w-100" draggable="false" id="display">
      </div>
      <div class="col-6">
        <Deck ref="deck" @cardOver="display = $event"></Deck>
      </div>
      <div class="col-3">
        <div class="row p-2">
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
        <div class="sticky row overflow-auto m-1 box" id="card-list">
          <div v-for="(card, i) in cards" :key="i" style="margin-left: 0;" class="row p-0 box">
            <div class="col-3 m-0 p-0" @mouseover="display=card.cod_img">
              <img :src="get_img(card.cod_img)" alt="" class="img-fluid draggable" :id="'card-list_' + card.card_cod"
                   draggable="true" @dragstart="DragDrop.onDragStart($event, card);" @contextmenu="right_click($event, card);">
            </div>
            <div class="col-9 text-center align-middle">
              <a :href="`https://db.ygoprodeck.com/card/?search=${card.card_cod}`" target="_blank">
                <h6>{{ card.name }}</h6>
              </a>
              <div class="h-75 m-0">
                <div>
                  {{ card.type }}
                  <span v-if="card.level"> Lv {{ card.level }} </span>
                  <span v-if="card.scale"> Sc {{ card.scale }} </span>
                  <span v-if="card.link_val"> Lk {{ card.link_val }} </span>
                </div>
                <div>
                  {{ card.race }}
                  <span v-if="card.attribute"> / {{ card.attribute }} </span>
                </div>
                <div>
                  {{ card.quantity }} in collection
                </div>
                <div v-if="card.limit">
                  <span v-if="card.limit === 0"> Forbidden </span>
                  <span v-if="card.limit === 1"> Limited </span>
                  <span v-if="card.limit === 2"> Semi-Limited </span>
                  to {{ card.limit }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Base>
</template>

<script>
import Base from '@/components/Base.vue';
import Deck from '@/components/Deck.vue';
import axios from 'axios';
import DragDrop from '../js/drag_drop.js';


export default {
  name: "DeckBuilder",
  components: {
    Base,
    Deck
  },
  data() {
    return {
      cards: [],
      filters: {name: '', field: 'name', dir: 'asc'},
      loader_class: "",
      display: 7089711,
      DragDrop,
      Deck,
    }
  },
  methods: {
    update_deck_list() {
      let api_url = `https://ygo-prog-web.herokuapp.com/collection/?&guild=${this.guild}&user=${this.user}&name=%${this.filters.name}%&field=${this.filters.field}&dir=${this.filters.dir}`
      // console.log(api_url)
      this.loader_class = ""
      axios.get(api_url).then(response => {
        this.cards = response.data
        this.loader_class = "hide"
      });
    },
    get_img(id) {
      return `https://storage.googleapis.com/ygoprodeck.com/pics/${id}.jpg`
    },
    right_click(event, card) {
      event.preventDefault();
      this.$refs.deck.add_card(this.$refs.deck.get_deck_id(card.type), card);
    }
  },
  mounted() {
    // console.log(this.guild, this.user);
    this.update_deck_list();
  },
  props: {
    guild: String,
    user: String
  }
}
</script>

<style scoped>

.draggable {
  cursor: move;
}

.box {
  border: 3px solid white;
  max-height: 50%;
}

div.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  max-height: 100vh;
}

</style>