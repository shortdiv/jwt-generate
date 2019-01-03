import axios from "axios";

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
  getToken() {
    return new Promise((resolve, reject) => {
      axios
        .post("./netlify/functions/get-cookie")
        .then(data => {
          resolve(data);
        })
        .catch(err => {
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
