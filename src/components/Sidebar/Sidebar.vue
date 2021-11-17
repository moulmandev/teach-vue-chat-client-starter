<template>
  <div class="sidebar">
    <div class="user">
      <div class="user-picture">
        <img :src="user.picture_url" class="ui circular image" />
      </div>

      <div class="user-info">
        <div class="user-info-pseudo">{{ user.username }}</div>

        <div class="user-info-status ui simple dropdown">
          <div class="available text">
            En ligne
          </div>
          <i class="dropdown icon"> </i>
          <div class="menu">
            <div class="item" @click="deauthenticate">
              <i class="logout icon"> </i>
              Déconnexion
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="menu">
      <div class="blue button" @click="openCommunity">
        <i class="users icon"> </i>
        <br />
        <span>Communauté</span>
      </div>
      <div v-if="true" class="blue button" @click="openMessageSearch">
        <i class="search icon"> </i>
        <br />
        <span>Messages</span>
      </div>
    </div>
    <div class="conversations">
      <div class="conversation-search">
        <div class="ui fluid search">
          <div class="ui icon input">
            <input
              class="prompt"
              placeholder="Rechercher une conversation"
              type="text"
            />
            <i class="search icon"> </i>
          </div>
        </div>
      </div>

      <!--      // available-->
      <!--      // new-->
      <!--      // selected-->

      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="conversation"
        :title="conversation.title"
        @click="openConversation(conversation.id)"
      >
        <a class="avatar">
          <img :src="getConversationPicture(conversation)"/>
        </a>
        <div class="content">
          <div class="metadata">
            <div class="title">
              <i class="ui small icon circle"> </i>{{ conversation.title }}
            </div>
            <span class="time">{{ conversation.updated_at.toLocaleString() }}</span>
          </div>
          <div class="text">{{ getMessageContent(conversation.messages) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {
      search: ""
    };
  },
  methods: {
    ...mapActions(["deauthenticate"]),
    openCommunity() {
      router.push({ name: "Community" });
    },
    openMessageSearch() {
      router.push({ name: "Search" });
    },
    openConversation(id) {
      router.push({ name: "Conversation", params: { id } });
    },
    getUserByName(name) {
      return this.users.find(user => user.username === name);
    },
    getConversationPicture(conversation) {
      if (conversation.participants.length === 2) {
        let other = conversation.participants.find(participant => participant !== this.user.username);
        return this.getUserByName(other).picture_url;
      } else {
        return "https://source.unsplash.com/7omHUGhhmZ0/100x100";
      }
    },
    getMessageContent(messages) {
      if (messages && messages.length > 0) {
        return messages[messages.length - 1].content;
      }
      return "Nouvelle conversation";
    }
  },
  computed: {
    ...mapGetters(["user", "conversations", "users"])
  }
};
</script>

<style scoped src="./Sidebar.css" />
