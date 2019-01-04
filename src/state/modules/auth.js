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
  init() {},
  getToken({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get("/.netlify/functions/get-cookie")
        .then(result => {
          if (result.data.decodedToken) {
            commit("SET_TOKEN", result.data.decodedToken);
            resolve(result.data.decodedToken);
          } else {
            reject("NO TOKEN");
            console.log("not working");
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
  }
};
