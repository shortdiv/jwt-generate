import axios from "axios";

export const state = {
  token: null,
  error: null
};

export const mutations = {
  SET_TOKEN(state, val) {
    state.token = val;
  },
  SET_ERROR(state, val) {
    state.error = val;
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
          if (result.data.decodedToken != null) {
            commit("SET_TOKEN", result.data.originalToken);
            resolve(result.data.decodedToken);
          } else {
            commit("SET_ERROR", result.data.message);
            const token = result.data.originalToken || null;
            commit("SET_TOKEN", token);
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
