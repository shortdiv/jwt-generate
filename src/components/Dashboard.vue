<template>
  <div>
    <div v-show="error">{{ error }}</div>
    <h1>This is the dashboard</h1>
    <h2 v-if="token">Hi I am a token {{ token }}</h2>
    <label>
      Name:
      <input type="text" v-model="name">
    </label>
    <label>
      Email:
      <input type="text" v-model="email">
    </label>
    <button @click="getToken">Generate Token</button>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapState } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      name: null,
      email: null,
      error: null
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.redirectFrom) {
      next(vm => {
        vm.error =
          "Sorry, you don't have the right access to reach the route requested";
      });
    } else {
      next();
    }
  },
  methods: {
    ...mapActions("auth", ["getToken", "setToken"]),
    setStringToken(jwt) {
      this.setToken(jwt);
    },
    getToken: async function() {
      const data = {
        claims: {
          name: this.name,
          email: this.email
        },
        secret: "suchSecretsMuchToHide"
      };
      try {
        const response = await axios.post(
          "/.netlify/functions/generate",
          JSON.stringify(data)
        );
        const { jwt } = response.data;
        this.setStringToken(jwt);
      } catch (err) {
        console.log(err);
      }
    }
  },
  computed: {
    ...mapState("auth", {
      token: state => state.token
    })
  },
  created() {
    this.getToken();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
h2 {
  word-break: break-all;
}
</style>
