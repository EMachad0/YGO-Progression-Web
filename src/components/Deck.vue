<template>
  <div>
    <div class="row mt-1">
      <div class="col">
        <h5> Main Deck</h5>
      </div>
      <div class="col text-end">
        <button type="button" class="btn btn-outline-light btn-sm"
                @click="TextDownload.download('YGO-Prog-deck.ydk', get_deck_text())">Export
        </button>
      </div>
    </div>
    <div class="row deck main-deck" id="main" @dragover="DragDrop.onDragOver($event);" @drop="onDrop($event);">
      <div v-for="(card, i) in deck['main']" :key="i" class="col-card m-0 p-1">
        <img :src="get_img(card.card_cod)" alt="" class="img-fluid draggable" draggable="true"
             @dragstart="DragDrop.onDragStart($event, card); removing=1" @dragend="remove_card('main', i)"
             @contextmenu="$event.preventDefault(); remove_card('main', i)" @mouseover="$emit('cardOver', card.cod_img)">
      </div>
    </div>
    <div class="row mt-1">
      <h5>Extra Deck</h5>
    </div>
    <div class="row deck extra-deck" id="extra" @dragover="DragDrop.onDragOver($event);" @drop="onDrop($event);">
      <div v-for="(card, i) in deck['extra']" :key="i" class="col-card m-0 p-1">
        <img :src="get_img(card.card_cod)" alt="" class="img-fluid draggable" draggable="true"
             @dragstart="DragDrop.onDragStart($event, card); removing=1" @dragend="remove_card('extra', i)"
             @contextmenu="$event.preventDefault(); remove_card('extra', i)" @mouseover="$emit('cardOver', card.cod_img)">
      </div>
    </div>
    <div class="row mt-1">
      <h5>Side Deck</h5>
    </div>
    <div class="row deck side-deck" id="side" @dragover="DragDrop.onDragOver($event);" @drop="onDrop($event);">
      <div v-for="(card, i) in deck['side']" :key="i" class="col-card m-0 p-1">
        <img :src="get_img(card.card_cod)" alt="" class="img-fluid draggable" draggable="true"
             @dragstart="DragDrop.onDragStart($event, card); removing=1" @dragend="remove_card('side', i)"
             @contextmenu="$event.preventDefault(); remove_card('side', i)" @mouseover="$emit('cardOver', card.cod_img)">
      </div>
    </div>
  </div>
</template>

<script>
import DragDrop from '../js/drag_drop.js';
import TextDownload from '../js/text_dowload.js';


export default {
  name: "Deck",
  data() {
    return {
      deck: {"main": [], "extra": [], "side": []},
      extra_deck_types: ["Fusion Monster"],
      removing: 0,
      DragDrop,
      TextDownload
    }
  },
  methods: {
    onDrop(event) {
      event.preventDefault();
      const item = event.dataTransfer.getData('item');
      const card = JSON.parse(item);

      let zone = event.target;
      while (!DragDrop.drop_zones.includes(zone.id)) zone = zone.parentNode;
      console.log(zone.id)

      let deck_id = zone.id;
      this.add_card(deck_id, card);
    },
    add_card(deck_id, card) {
      if (this.deck[deck_id].length >= (deck_id === "main" ? 60 : 15)) return;

      if (deck_id === "extra") {
        if (!this.extra_deck_types.includes(card.type)) return;
      } else if (deck_id === "main" || deck_id === "side") {
        if (this.extra_deck_types.includes(card.type)) return;
      }

      let inDeck = this.get_amount_in_deck(deck_id, card.card_cod);
      let limit = (card.limit) ? card.limit : 3;
      if (card.quantity === inDeck || inDeck === limit) return;

      this.deck[deck_id].push(card);
      this.sort_deck();
    },
    get_deck_id(type) {
      return this.extra_deck_types.includes(type)? 'extra':'main';
    },
    remove_card(source, pos) {
      this.removing = 0;
      this.deck[source].splice(pos, 1);
    },
    get_amount_in_deck(deck_id, card_id) {
      let inDeck = 0;
      if (deck_id === "extra") inDeck += this.deck['extra'].filter(x => x.card_cod === card_id).length;
      else if (deck_id === "side" || deck_id === "main") {
        inDeck += this.deck['side'].filter(x => x.card_cod === card_id).length;
        inDeck += this.deck['main'].filter(x => x.card_cod === card_id).length;
      }
      return inDeck - this.removing;
    },
    get_deck_text() {
      let text = "";
      Object.entries(this.deck).forEach(([key, cards]) => {
        text += (key === "side" ? '!' : '#') + key + '\n';
        cards.forEach(c => text += c.card_cod + '\n');
        text += '\n';
      });
      console.log(text);
      return text
    },
    sort_deck() {
      for (let k in this.deck) {
        this.deck[k].sort(function (a, b) {
          let va = a.level;
          let vb = b.level;
          if (va === vb) return (a.name <= b.name ? -1 : 1);
          if (va == null) return 1;
          if (vb == null) return -1;
          return (va > vb ? -1 : 1);
        });
      }
    },
    get_img(id) {
      return `https://storage.googleapis.com/ygoprodeck.com/pics/${id}.jpg`
    }
  }
}
</script>

<style scoped>

.deck {
  min-height: 50px;
  border: 3px solid;
}

.main-deck {
  border-color: #a16741;
  background-color: #b97b51;
}

.extra-deck {
  border-color: #6a6196;
  background-color: #8078a8;
}

.side-deck {
  border-color: #5e7547;
  background-color: #728e56;
}

.col-card {
  width: 10%;
  float: left;
}

.draggable {
  cursor: move;
}

</style>