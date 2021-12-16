<template>
  <div class="conversation" v-if="conversation">
    <div class="conversation-header">
      <img
        v-if="conversation.type === 'one_to_one'"
        class="avatar"
        :src="getConversationPicture(conversation)"
      />
      <div v-else-if="conversation.type === 'many_to_many'" class="avatar">
        <i class="ui users icon"></i>
      </div>

      <div class="title">
        <div class="ui compact">
          <i v-if="isSomeoneOnline" class="icon circle"></i>
          <span v-if="conversation.type === 'one_to_one'">{{getConversationOneToOne(conversation) }}</span>
          <span v-else-if="conversation.type === 'many_to_many'">{{getConversationManyToMany(conversation) }}</span>
          <div class="ui simple dropdown item">
            <i class="vertical ellipsis icon"></i>

            <div class="menu">
              <div v-if="true" class="item">
                <i class="ui icon paint brush"></i>
                Modifier le thème
              </div>
              <div v-if="true" class="item">
                <i class="ui icon edit"></i>
                Modifier le titre
              </div>
              <div v-if="true" class="item">
                <i class="ui icon volume bell slash"></i>
                Mettre en sourdine
              </div>
              <div v-if="true" class="item">
                <i class="ui icon volume bell"></i>
                Rétablir les notifications
              </div>
              <div class="item" @click="groupPanel = !groupPanel">
                <i class="ui icon users"></i>
                Gérer les participants
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    <div class="time">01:32:08</div>-->
    <!--    <div class="message mine">-->
    <!--        <img-->
    <!--            title="Bob"-->
    <!--            src="https://source.unsplash.com/7omHUGhhmZ0/100x100"-->
    <!--        />-->
    <!--      <div class="bubble top bottom">Hello les amis !</div>-->
    <!--      <div class="reacts"></div>-->
    <!--    <div class="controls">-->
    <!--      <i title="Répondre" class="circular reply icon"></i-->
    <!--      ><span class="react"-->
    <!--    ><i title="Aimer" class="circular heart outline icon"></i-->
    <!--    ><i-->
    <!--        title="Pouce en l'air"-->
    <!--        class="circular thumbs up outline icon"-->
    <!--    ></i-->
    <!--    ><i title="Content" class="circular smile outline icon"></i-->
    <!--    ><i-->
    <!--        title="Pas content"-->
    <!--        class="circular frown outline icon"-->
    <!--    ></i-->
    <!--    ></span>-->
    <!--    </div>-->
    <!--      <div class="controls">-->
    <!--        <i title="Supprimer" class="circular trash icon"></i-->
    <!--        ><i title="Editer" class="circular edit icon"></i-->
    <!--      ><i title="Répondre" class="circular reply icon"></i>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="view">-->
    <!--      <img-->
    <!--          title="Vu par Alice à 01:36:39"-->
    <!--          src="https://source.unsplash.com/mK_sjD0FrXw/100x100"-->
    <!--      /><img-->
    <!--        title="Vu par Gael à 01:36:39"-->
    <!--        src="https://source.unsplash.com/OYH7rc2a3LA/100x100"-->
    <!--    />-->
    <!--    </div>-->

    <div class="conversation-container">
      <div class="conversation-main">
        <div class="conversation-body" id="scroll">
          <div class="wrapper">
            <label v-for="message in conversation.messages" :key="message.id">
              <div class="time">{{ message.posted_at }}</div>
                <div v-bind:class="{mine: message.from === user.username }" class="message">
                    <img v-if="message.from !== user.username" :title="message.from" :src="getUserByName(message.from).picture_url"/>
                  <div v-if="message.deleted" class="delete">{{ message.content = "Vous avez suprimé un message" }}</div>
                  <div v-else class="bubble top bottom">{{ message.content }}</div>

                  <div class="reacts"></div>
                    <div v-if="message.from !== user.username" class="controls">
                      <i title="Répondre" class="circular reply icon"></i>
                      <span class="react">
                        <i title="Aimer" class="circular heart outline icon"></i>
                        <i title="Pouce en l'air" class="circular thumbs up outline icon"></i>
                        <i title="Content" class="circular smile outline icon"></i>
                        <i title="Pas content" class="circular frown outline icon"></i>
                      </span>
                    </div>

                    <div v-else-if="message.from === user.username"  class="controls">
                     
                      <i title="Supprimer" class="circular trash icon" @click="deleteMess(message)">
                          <!-- conversation_id, message_id -->
                          <!-- 
                            this.removeParticipant({
                            conversation_id: this.conversation.id,
                            username: username
                          }); -->
                        <!-- TODO DELETE -->
                        <!-- $client.on('messageDeleted') -->
                      </i>
                      <i title="Editer" class="circular edit icon"></i>
                      <i title="Répondre" class="circular reply icon"></i>
                    </div>
                  </div>

              
            </label>
          </div>
        </div>

        <!--        <div class="typing">-->
        <!--          <div class="wrapper">-->
        <!--            Alice est en train d'écrire...-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="conversation-footer">
          <div class="wrapper">
            <p>
              <i title="Abandonner" class="circular times small icon link"></i>
              Répondre à Alice
              <span>
                On peut même éditer ou supprimer des messages !
              </span>
            </p>

            <div class="ui fluid search">
              <div class="ui icon input">
                <input
                  v-model="messageContent"
                  class="prompt"
                  type="text"
                  placeholder="Rédiger un message"
                  @keyup.enter="sendMessage()"
                />
                <i class="send icon" @click="sendMessage()"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="conversation-sidebar" v-if="groupPanel">
        <Group />
      </div>
    </div>
  </div>
</template>

<script>
import Group from "@/components/Group/Group";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Conversation",
  components: { Group },
  data() {
    return {
      messageContent: "",
      groupPanel: false
    };
  },
  mounted() {
    this.scrollBottom();
  },
  updated() {
    this.scrollBottom();
  },
  computed: {
    ...mapGetters(["conversation", "user", "users", "usersAvailable"]),

    isSomeoneOnline() {
      return this.usersAvailable.some(x => (this.conversation.participants.includes(x) && x != this.user.username))
    },
  },
  methods: {
    ...mapActions(["postMessage","deleteMessage"]),

    sendMessage() {
      this.postMessage({
        conversation_id: this.conversation.id,
        content: this.messageContent
      });
      this.messageContent = "";
    },
    deleteMess(message){
      this.deleteMessage({
        conversation_id: this.conversation.id,
        message_id: message.id
      });
    },

    getUserByName(name) {
      return this.users.filter(user => user.username === name).at(0);
    },
    getConversationPicture(conversation) {
      if (conversation.participants.length === 2 && conversation.participants[0] !== conversation.participants[1]) {
        let other = conversation.participants.find(
          participant => participant !== this.user.username
        );
        return this.getUserByName(other).picture_url;
      }
    },
    getConversationOneToOne(conversation) {
      if (conversation.participants.length === 2 && conversation.participants[0] !== conversation.participants[1]) {
        let other = conversation.participants.find(
          participant => participant !== this.user.username
        );
        return this.getUserByName(other).username;
      }
    },
    getConversationManyToMany(conversation) {
      if (conversation.participants.length > 2) {
        let participant = "";
        for (let participantUser of conversation.participants) {
            participant += participantUser + ", ";
        }
        return participant.slice(0, -2) ;
      }
    },
    scrollBottom() {
      setTimeout(() => {
        let scrollElement = document.querySelector("#scroll");
        if (scrollElement) {
          scrollElement.scrollTop = document.querySelector(
            "#scroll"
          ).scrollHeight;
        }
      }, 0);
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    conversation(newConversation, oldConversation) {
      this.scrollBottom();
    }
  }
};
</script>

<style src="./Conversation.css" scoped />
