<template>
  <div>
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
var cookie = require("cookie");

export default {
  name: "Dashboard",
  data() {
    return {
      token: null,
      name: null,
      email: null
    };
  },
  methods: {
    getStringToken(jwt) {
      const jwtFromCookie = cookie.parse(`nf_jwt=${jwt}`);
      this.token = jwtFromCookie;
    },
    getToken: async function() {
      const data = {
        claims: {
          name: this.name,
          email: this.email
        },
        secret: "this is a secret. shhhh."
      };
      try {
        const response = await axios.post(
          "/.netlify/functions/generate",
          JSON.stringify(data)
        );
        const { jwt, exp } = response.data;
        cookie.serialize("nf_jwt", jwt, {
          expires: new Date(exp)
        });
        this.getStringToken(jwt);
      } catch (err) {
        console.log(err);
      }
    }
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
