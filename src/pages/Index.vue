<template>
  <q-page class="flex flex-center column">
    <div v-if="this.settings.announcement.length == 0">
      <div class="" @click="go">
        <img alt="行動資料庫" src="~assets/MDB.png" />
      </div>
      <div
        class="text-h5 text-weight text-center"
        style="font-family: 'Dancing Script', cursive"
      >
        Mobile Data Bank<br />
        <span class="text-caption">V {{ settings.version }} </span>
      </div>
    </div>
    <div v-else>
      <q-card style="" class="q-ma-md">
        <q-card-section
          class="fit flex row items-start text-h6"
          v-html="this.settings.announcement"
        >
          {{ this.settings.announcement }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "PageIndex",
  mounted() {
    // console.log(this.settings.announcement.length);
    this.setMDB(false);
    this.checkVersion();
    setTimeout(() => {
      //跳轉
      this.go();
    }, this.settings.delay);
  },
  computed: {
    // ...mapState("settings", ["version"]),
    ...mapGetters("settings", ["settings"]),
  },
  methods: {
    ...mapMutations("LoadData", ["setMDB"]),
    ...mapActions("settings", ["getSettings"]),
    async checkVersion() {
      await this.getSettings();
      let dbVer = this.settings.version 
      let lsVer = await LocalStorage.getItem("version")

        if( dbVer !== lsVer ){
        //更新更新
        window.location.reload(true);
        //保存現有版本
        LocalStorage.set("version", this.settings.version);
      }
    },
    go() {
      this.setMDB(true);
      this.$router.push("/MDB").catch((err) => {});
    },
  },
};
</script>
