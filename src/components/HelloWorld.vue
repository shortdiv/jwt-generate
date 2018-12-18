<template>
  <div>
    <h1 v-if="token">Hi I am a token {{ token }}</h1>
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
  name: "HelloWorld",
  data() {
    return {
      token: null,
      name: null,
      email: null
    };
  },
  methods: {
    getStringToken(jwt) {
      const jwtFromCookie = cookie.get(`nf_jwt=${jwt}`);
      this.token = jwtFromCookie;
    },
    getToken() {
      const data = {
        claims: {
          name: this.name,
          email: this.email
        },
        secret: "this is a secret. shhhh."
      };
      try {
        const response = await axios.post("/.netlify/functions/generate", JSON.stringify(data))
        const { jwt, exp } = response.data;
        cookie.serialize("nf_jwt", jwt, {
          expires: exp
        });
        this.getStringToken(jwt);
      } catch (err) {
        console.log(err)
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
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
