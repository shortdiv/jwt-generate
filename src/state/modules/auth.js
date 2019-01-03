import axios from "axios";
import cookies from "cookie";

export const state = {
  token: null
};

export const mutations = {
  SET_TOKEN(state, val) {
    state.token = val;
  }
};

export const getters = {
  hasToken(state) {
    return !!state.token;
  }
};

export const actions = {
  init: async function() {
    return new Promise((resolve, reject) => {
      axios
        .post(
          "/.netlify/functions/get-cookie",
          JSON.stringify({
            token: "iAmToken"
          })
        )
        .then(data => {
          commit("SET_TOKEN", data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  },
  setToken({ commit }, val) {
    commit("SET_TOKEN", val);
  },
  isLoggedIn() {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve("hello");
      }, 1000);
    });
  }
};
