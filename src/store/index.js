import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticating: false,
    user: {
      username: null,
      token: null,
      picture_url: null,
    },
    users: [],
    conversations: [],
    currentConversationId: null,
    usersAvailable: [],
  },
  getters: {
    authenticating(state) {
      return state.authenticating;
    },
    authenticated(state) {
      return state.user.token !== null;
    },
    user(state) {
      return state.user;
    },
    users(state) {
      return state.users;
    },
    usersAvailable(state) {
      return state.usersAvailable;
    },
    conversations(state) {
      return state.conversations.filter((conversation) =>
        conversation.participants.includes(state.user.username)
      );
    },

    conversation(state, getters) {
      return state.conversations
        .filter(
          (conversation) => conversation.id === state.currentConversationId
        )
        .at(0);
    },
  },
  mutations: {
    syncCurrentConversation(state, conversationId) {
      state.currentConversationId = conversationId;
    },
    setAuthenticating(state, authenticating) {
      state.authenticating = authenticating;
    },
    setUser(state, { username, token, picture_url }) {
      Vue.set(state.user, "username", username);
      Vue.set(state.user, "token", token);
      Vue.set(state.user, "picture_url", picture_url);
    },
    setUsers(state, users) {
      state.users = users;
    },

    setConversations(state, conversations) {
      state.conversations = conversations;
    },

    upsertUser(state, { user }) {
      const localUserIndex = state.users.findIndex(
        (_user) => _user.username === user.username
      );

      if (localUserIndex !== -1) {
        Vue.set(state.users, localUserIndex, user);
      } else {
        state.users.push({
          ...user,
        });
      }
    },

    upsertAvailableUsers(state, { usernames }) {
      state.usersAvailable = usernames;
    },

    upsertConversation(state, { conversation }) {
      const localConversationIndex = state.conversations.findIndex(
        (_conversation) => _conversation.id === conversation.id
      );

      if (localConversationIndex !== -1) {
        Vue.set(state.conversations, localConversationIndex, conversation);
      } else {
        state.conversations.push({
          ...conversation,
        });
      }
    },

    upsertMessages(state, { conversation_id, message }) {
      const localConversationIndex = state.conversations.findIndex(
        (_conversation) => _conversation.id === conversation_id
      );
      if (localConversationIndex !== -1) {
        const localMessageIndex = state.conversations[
          localConversationIndex
        ].messages.findIndex((_message) => _message.id === message.id);
        if (localMessageIndex !== -1) {
          Vue.set(
            state.conversations[localConversationIndex].messages,
            localMessageIndex,
            message
          );
        } else {
          state.conversations[localConversationIndex].messages.push({
            ...message,
          });
        }
        state.conversations[
          localConversationIndex
        ].updated_at = new Date().toISOString();
      }
    },
    upsertMessagesId(state, { conversation_id, message_id }) {
      const localConversationIndex = state.conversations.findIndex(
        (_conversation) => _conversation.id === conversation_id
      );
      if (localConversationIndex !== -1) {
        const localMessage = state.conversations[
          localConversationIndex
        ].messages.find((_message) => _message.id === message_id);
        const localMessageIndex = state.conversations[
          localConversationIndex
        ].messages.indexOf(localMessage);

        if (localMessageIndex !== -1) {
          localMessage.deleted = true;
          Vue.set(
            state.conversations[localConversationIndex].messages,
            localMessageIndex,
            localMessage
          );
        } else {
          state.conversations[localConversationIndex].messages.splice(
            message_id,
            1
          );
        }
      }
    },
  },

  actions: {
    authenticate({ commit, dispatch }, { username, password }) {
      if (!username || !password) {
        return;
      }
      commit("setAuthenticating", true);
      Vue.prototype.$client
        .authenticate(username, password)
        .then((user) => {
          commit("setUser", user);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);

          dispatch("initializeAfterAuthentication");
        })
        .catch(() => {
          alert("Erreur d'authentification !");
        })
        .finally(() => {
          commit("setAuthenticating", false);
        });
    },

    deauthenticate() {
      localStorage.removeItem("password");
      window.location.reload();
    },

    initializeAfterAuthentication({ dispatch }) {
      dispatch("fetchUsers");
      dispatch("fetchConversations");
    },

    fetchUsers({ commit }) {
      Vue.prototype.$client.getUsers().then(({ users }) => {
        commit("setUsers", users);
      });
    },

    fetchConversations({ commit }) {
      Vue.prototype.$client.getConversations().then(({ conversations }) => {
        commit("setConversations", conversations);
      });
    },

    postMessage({ commit }, { conversation_id, content }) {
      Vue.prototype.$client
        .postMessage(conversation_id, content)
        .then(({ message }) => {
          commit("upsertMessages", conversation_id, message);
        });
    },

    addParticipant({ commit }, { conversation_id, username }) {
      Vue.prototype.$client.addParticipant(conversation_id, username);
    },

    removeParticipant({ commit }, { conversation_id, username }) {
      Vue.prototype.$client.removeParticipant(conversation_id, username);
    },

    deleteMessage({ commit }, { conversation_id, message_id }) {
      Vue.prototype.$client.deleteMessage(conversation_id, message_id);
    },

    editMessage({ commit }, { conversation_id, message_id, content }) {
      Vue.prototype.$client.editMessage(conversation_id, message_id, content);
    },

    seeConversation({ commit }, { conversation_id, message_id }) {
      Vue.prototype.$client.seeConversation(conversation_id, message_id);
    },

    createOneToOneConversation({ commit }, username) {
      const promise = Vue.prototype.$client.getOrCreateOneToOneConversation(
        username
      );

      promise.then(({ conversation }) => {
        // commit("upsertConversation", {
        //   conversation
        // });

        router.push({
          name: "Conversation",
          params: { id: conversation.id },
        });
      });

      return promise;
    },

    createManyToManyConversation({ commit }, username) {
      const promise = Vue.prototype.$client.createManyToManyConversation(
        username
      );

      promise.then(({ conversation }) => {
        // commit("upsertConversation", {
        //   conversation
        // });

        router.push({
          name: "Conversation",
          params: { id: conversation.id },
        });
      });

      return promise;
    },
  },
});
