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
  init({ dispatch }) {
    dispatch("getToken");
  },
  getToken({ commit }, val) {
    return new Promise((resolve, reject) => {
      axios
        .get("/.netlify/functions/get-cookie")
        .then(result => {
          if (!!result.data.decodedToken) {
            reject("NO TOKEN");
            console.log("not working");
          } else {
            commit("SET_TOKEN", data);
            resolve(data);
          }
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
