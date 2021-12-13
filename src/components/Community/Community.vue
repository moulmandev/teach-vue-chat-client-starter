<template>
  <div class="community">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input
            v-model="searchContent"
            class="prompt"
            type="text"
            placeholder="Rechercher un utilisateur"
          />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>
    <div class="users">
      <div
        v-bind:class="{ selected: selectedUsers.includes(user), available: usersAvailable.includes(user.username)}"
        v-for="user in getUserSearched()"
        :key="user.username"
        class="user"
        @click="clickUser(user)"
      >
        <img :src="user.picture_url" alt="" />
        <span class="">{{ user.username }}</span>
      </div>
    </div>

    <div v-if="selectedUsers.length" class="actions">
      <button class="ui primary big button" @click="openConversation">
        <i class="conversation icon"></i>
        <span>
          Ouvrir la conversation ({{ selectedUsers.length }})
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Vue from "vue";

export default {
  name: "Community",
  data() {
    return {
      selectedUsers: [],
      searchContent: ""
    };
  },
  methods: {
    ...mapActions([
      "createOneToOneConversation",
      "createManyToManyConversation"
    ]),

    openConversation() {
      if (this.selectedUsers.length === 0) return;
      if (this.selectedUsers.length > 1) {
        let promise = this.createManyToManyConversation(this.selectedUsers.map(user => user.username));
        promise.finally(() => {
          console.log("Conversation ouverte !");
        });
      } else {
        let promise = this.createOneToOneConversation(this.selectedUsers[0].username);
        promise.finally(() => {
          console.log("Conversation ouverte !");
        });
      }
    },

    clickUser(user) {
      if (this.selectedUsers.includes(user)) {
        const index = this.selectedUsers.indexOf(user);
        Vue.delete(this.selectedUsers, index);
      } else {
        this.selectedUsers.push(user);
      }
    },

    getUserSearched() { 
      return this.users.filter(searched => searched.username.toLowerCase().includes(this.searchContent.toLowerCase()))
    }
  },
  computed: {
    ...mapGetters(["users", "usersAvailable"]),
  }
};
</script>

<style src="./Community.css" scoped />
