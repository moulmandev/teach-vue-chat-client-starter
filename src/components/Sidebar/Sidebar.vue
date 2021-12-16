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

      <div
        v-for="conversation in orderedMessages()"
        :key="conversation.id"
        class="conversation"
        :title="conversation.title"
        v-bind:class="{
          available: isSomeoneOnline(conversation),
          selected: isSelected(conversation),
          new: isThereSomethingNew(conversation)
        }"
        @click="openConversation(conversation.id)"
      >
      
        <a class="avatar">
          <img :src="getConversationPicture(conversation)"/>
        </a>
        <div class="content">
          <div class="metadata">
            <div class="title">
              <i class="ui small icon circle"> </i><span v-if="conversation.type === 'one_to_one'">{{ getConversationOneToOne(conversation) }}</span>
              <span v-else-if="conversation.type === 'many_to_many'">{{ getConversationManyToMany(conversation)}}</span>
            </div>
            <span class="time">{{ dateFormat(conversation.updated_at).toString()}}</span>

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
      search: "",
      conversationClicked : null
    };
  },
  methods: {
    ...mapActions(["deauthenticate"]),
      orderedMessages(){
        return (this.conversations).sort((a, b) => (Date.parse(b.updated_at) - (Date.parse(a.updated_at) )));
      },
    openCommunity() {
      router.push({ name: "Community" });
    },
    openMessageSearch() {
      router.push({ name: "Search" });
    },
    openConversation(id) {
      this.conversationClicked = id;  
      router.push({ name: "Conversation", params: { id } });
    },
    getUserByName(name) {
      return this.users.find(user => user.username === name);
    },
    getConversationPicture(conversation) {
      if (conversation.participants.length === 2 && conversation.participants[0] !== conversation.participants[1]) {
        let other = conversation.participants.find(participant => participant !== this.user.username);
        return this.getUserByName(other).picture_url;
      } else {
        return "https://source.unsplash.com/7omHUGhhmZ0/100x100";
      }
    },
    getConversationManyToMany(conversation){
      if(conversation.participants.length > 2){
          let participant = '';
          for(let participantUser of conversation.participants){
              participant += participantUser + ', ';
          }
          return participant;
      }
    },
    getConversationOneToOne(conversation){
        if (conversation.participants.length === 2 && conversation.participants[0] !== conversation.participants[1]) {
          let other = conversation.participants.find(participant => participant !== this.user.username);
          return this.getUserByName(other).username;
        }
    }, 
    getMessageContent(messages) {
      if (messages && messages.length > 0) {
        return messages[messages.length - 1].content;
      }
      return "Nouvelle conversation";
    },
    isSelected(conversation){
      if(this.conversationClicked === conversation.id){
        return true;
      }
      else
        return false;
    },
    dateFormat(date){
      return new Date(date).toLocaleString('fr-FR', { timeZone: 'UTC' });
    },
    isSomeoneOnline(conversation) {
      return this.usersAvailable.some(x => (conversation.participants.includes(x) && x != this.user.username))
    },
    isThereSomethingNew(conversation) {
    }
  },
  computed: {
    ...mapGetters(["user", "conversations", "users", "usersAvailable"]),
  },
};
</script>

<style scoped src="./Sidebar.css" />
