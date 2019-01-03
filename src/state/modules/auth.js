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
  init() {
    return new Promise((resolve, reject) => {
      try {
        const response = axios.post("./netlify/functions/get-cookie", {
          token: "iAmToken"
        });
        console.log(response);
        resolve(response);
      } catch (e) {
        console.log(e);
        reject(e);
      }
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
