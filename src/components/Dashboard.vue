<template>
  <div>
    <div v-show="errorMsg">{{ errorMsg }}</div>
    <div class="text-explanation">
    <h1>Welcome.</h1>
    <p>This is a site used to explain JWT generation using a naïve token generation solution. Play around with the roles below to see how they affect access to the gated site. The gated site requires a token with role of admin or editor. Have fun!</p>
    </div>
    <h2 v-if="token">Hi I am a token {{ token }}</h2>
    <div class="checkbox-label-group">
      <label class="checkbox-label">
        <input type="checkbox" name="role" value="admin" class="checkbox" v-model="roles">
        Admin
      </label>
      <label class="checkbox-label">
        <input type="checkbox" name="role" value="editor" class="checkbox" v-model="roles">
        Editor
      </label>
      <label class="checkbox-label">
        <input type="checkbox" name="role" value="visitor" class="checkbox" v-model="roles">
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
    <div>
      <button @click="generateToken">Generate Token</button>
      <button @click="deleteToken">Delete Token</button>
    </div>
    <div v-for="(site) in gatedSites" :key="site">
      <a :href="`/.netlify/functions/redirect?site=${site}&token=${token}`">Go to Gated Site >></a>
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
      errorMsg: null,
      gatedSites: ["https://objective-brown-c0bc88.netlify.com"]
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
        //redirect//
        const redirectUrl = localStorage.getItem("redirect_url");
        if (redirectUrl) {
          window.location.href = `/.netlify/functions/redirect?site=${redirectUrl}&token=${
            this.token
          }`;
        }
      } catch (err) {
        console.error(err);
      }
    },
    deleteToken: async function() {
      await axios.get("/.netlify/functions/clear-cookie");
      this.setToken(null);
    },
    getURLParams() {
      const urlParams = {};
      const params = decodeURIComponent(window.location.search)
        .substring(1)
        .split("=");
      if (params.length > 1) {
        urlParams[params[0]] = params[1];
      }
      return urlParams;
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
    //get URL params
    const params = this.getURLParams();
    if (params.site) {
      localStorage.setItem("redirect_url", params.site);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
h2 {
  word-break: break-all;
}
p {
  margin: 0 10em 1em 10em;
}
.text-explanation {
  margin-bottom: 2em;
  border-bottom: 1px dashed black;
}
.checkbox {
  top: -.3em;
  -ms-transform: scale(1.5); /* IE */
  -moz-transform: scale(1.5); /* FF */
  -webkit-transform: scale(1.5); /* Safari and Chrome */
  -o-transform: scale(1.5); /* Opera */
  position: relative;
  cursor: pointer;
  &-label {
    font-size: 1.5em;
    &:not(:last-child) {
      margin-right: 1em;
    }
    &-group {
      margin-bottom: 1em;
    }
  }
}
button {
  &:not(:last-child) {
    margin-right: 1em;
  }
  margin: 2em 0;
  background-color: #64b587;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1.2em;
  outline: none;
  padding: 14px 25px;
}
a {
  font-size: 1.5em;
}
input[type="text"] {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 2px solid #e9ebeb;
  border-radius: 4px;
  color: #0e1e25;
  font-size: 16px;
  font-weight: 500;
  height: 40px;
  line-height: 24px;
  padding: 6px 14px;
}
</style>
