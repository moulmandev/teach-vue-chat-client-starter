<template>
  <div id="app">
    <Server v-if="$route.path === '/server'" />
    <Auth v-else-if="!authenticated" />
    <template v-else>
      <div>
        <Sidebar />
        <Main />
      </div>
    </template>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
<script>
import Sidebar from "@/components/Sidebar/Sidebar";
import Main from "@/components/Main/Main";
import Auth from "@/components/Auth/Auth";
import { mapGetters } from "vuex";
import Server from "./components/Server/Server";

export default {
  components: { Server, Auth, Sidebar, Main },
  mounted() {},
  computed: {
    ...mapGetters(["authenticated"])
  }
};
</script>

<style>
.fluid.search .input {
  width: 100%;
}

.ui.input > input::placeholder {
  color: black;
}
</style>
