<template>
  <div id="app">
        <span class="has-text-danger has-text-weight-bold">'Zoom out' browser to 67%, if on mobile try with 'Desktop site' option on for better results!</span>
    <!-- <div id="nav">
      <router-link to="/">Calendar</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>
<script>
export default {
  created() {
    const eventsToRepopulate = localStorage.getItem('vuex')
    this.$store.commit('events', JSON.parse(eventsToRepopulate).events);
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
