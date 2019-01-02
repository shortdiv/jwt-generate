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
    debugger;
    return !!state.token;
  }
};

export const actions = {
  setToken({ commit }, val) {
    commit("SET_TOKEN", val);
  },
  isLoggedIn({ commit }) {
    debugger;
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve("hello");
      }, 1000);
    });
  }
};
