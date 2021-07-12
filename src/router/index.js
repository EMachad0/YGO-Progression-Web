import Vue from 'vue'
import VueRouter from 'vue-router'
import Collection from "@/views/Collection.vue";
import DeckBuilder from "@/views/DeckBuilder.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/collection/:guild/:user',
    name: 'Collection',
    component: Collection,
    props: true
  },
  {
    path: '/deckbuilder/:guild/:user',
    name: 'DeckBuilder',
    component: DeckBuilder,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
