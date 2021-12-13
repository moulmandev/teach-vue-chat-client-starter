<template>
  <div class="group">
    <div class="ui fluid search">
      <div class="ui icon input">
        <input
            v-model="search"
            type="text"
            placeholder="Rechercher un utilisateur"
            class="prompt"
        /><i class="search icon"></i>
      </div>
    </div>
    <div class="spanner">
      <hr/>
      <span>Participants</span>
      <hr/>
    </div>

    <div class="user"
        v-for="participant in getParticipants"
        :key="participant.id"
    >
      <img :src="getUserByName(participant).picture_url"/>
      <span>{{ participant }}<br/><i class="nickname"></i></span>
      <i title="Modifier le surnom" class="circular quote left link icon"></i>
      <i title="Enlever de la conversation" class="circular times icon link" style=""></i>
    </div>

    <div class="spanner">
      <hr/>
      <span>Communauté</span>
      <hr/>
    </div>

    <div class="user"
         v-for="other in getOtherPeoples"
         :key="other.id"
    >
      <img :src="other.picture_url"/>
      <span>{{ other.username }}</span>
      <i title="Ajouter à la conversation" class="circular plus icon link"></i>
    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Group",
  data() {
    return {
      search: ""
    };
  },
  watch: {
    conversation: {
      immediate: true,
      handler: function() {
        console.log("handler group : ", this.conversation);
      }
    },
  },
  created() {
    console.log("created group ", this.conversation);
  },
  computed: {
    ...mapGetters(["conversation", "user", "users"]),

    getParticipants() {
      return this.conversation.participants.filter((participant) => {
        return participant.includes(this.search);
      });
    },

    getOtherPeoples() {
      return this.users.filter((item) => {
        return !this.conversation.participants.includes(item.username) && item.username.includes(this.search);
      });
    },
  },
  methods: {
    ...mapActions([]),

    getUserByName(name) {
      return this.users.filter(user => user.username === name).at(0);
    },
  }
};
</script>

<style src="./Group.css" scoped/>
