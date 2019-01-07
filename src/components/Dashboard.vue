<template>
  <div>
    <div v-show="errorMsg">{{ errorMsg }}</div>
    <h1>This is the dashboard</h1>
    <h2 v-if="token">Hi I am a token {{ token }}</h2>
    <div>
      <label for>
        <input type="checkbox" name="role" value="admin" v-model="roles">
        Admin
      </label>
      <label for>
        <input type="checkbox" name="role" value="editor" v-model="roles">
        Editor
      </label>
      <label for>
        <input type="checkbox" name="role" value="visitor" v-model="roles">
        Visitor
      </label>
    </div>
    <label>
      Name:
      <input type="text" v-model="name">
    </label>
    <label>
      Email:
      <input type="text" v-model="email">
    </label>
    <button @click="generateToken">Generate Token</button>
    <div>
      <button @click="deleteToken">Delete Token</button>
    </div>
    <div>
      <a href="https://objective-brown-c0bc88.netlify.com/">Go to Gated Site</a>
    </div>
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
      roles: ["admin"],
      errorMsg: null
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.redirectFrom) {
      next(vm => {
        vm.errorMsg =
          "Sorry, you don't have the right access to reach the route requested";
      });
    } else {
      next();
    }
  },
  methods: {
    ...mapActions("auth", ["getToken", "setToken"]),
    generateToken: async function() {
      const data = {
        claims: {
          name: this.name,
          email: this.email
        },
        roles: this.roles,
        secret: "suchSecretsMuchToHide"
      };
      try {
        const response = await axios.post(
          "/.netlify/functions/generate",
          JSON.stringify(data)
        );
        const { jwt } = response.data;
        this.setToken(jwt);
        this.errorMsg = null;
      } catch (err) {
        console.log(err);
      }
    },
    deleteToken: async function() {
      await axios.get("/.netlify/functions/clear-cookie");
      this.setToken(null);
    }
  },
  watch: {
    error(val) {
      this.errorMsg = val;
    }
  },
  computed: {
    ...mapState("auth", {
      token: state => state.token,
      error: state => state.error
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
