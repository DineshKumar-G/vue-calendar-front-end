import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => {
    const obj = _.cloneDeep(state);
    return obj;
  },
});

export default new Vuex.Store({
  state: {
    events: [],
  },
  mutations: {
    events: (state,  events ) => {
      console.log('stroe', events)
      state.events = events;
    },
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin],
});
