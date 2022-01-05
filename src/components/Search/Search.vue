<template>
  <div class="search-message">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input
            class="prompt"
            type="text"
            placeholder="Rechercher un message"
            v-model="search"
          />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>
    <div class="conversations">
      <div class="conversation" v-for="conversation in searchConversations" :key="conversation.id">
        <div class="author" v-if="conversation.searchResults">
            <div class="avatar">
              <i class="users icon img"></i>
            </div>
            <span>{{ conversation.title }}</span>
        </div>
        <div class="messages" v-for="message in conversation.searchResults" :key="message.id">
          <div class="message">
            <div class="time"> {{ message.posted_at }}</div>
            <div class="bubble">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapGetters(["user", "conversations"]),

    searchConversations() {
      let _conversations = [];
      if (this.search == "") {
        return this.conversations;
      }
      _conversations = this.conversations.map(conv => ({...conv, searchResults: conv.messages.filter(el => el.content && el.content.toLowerCase().includes(this.search.toLowerCase()))}));

      return _conversations;
    }
  }
};
</script>

<style src="./Search.css" scoped />
