<template>
  <div>
    <q-btn @click="backup" label="備份行動資料庫資料"></q-btn>
  </div>
</template>

<script>
import Vue from "vue";
import { exportFile, date, extend } from "quasar";
import { dbFirestore } from "boot/firebase";
export default {
  name: "",
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //資料庫備份
    backup() {
      // let temp = [];
      // let rawData = "";
      let rawJson = {};
      dbFirestore
        .collection("現場紀錄表")
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            // Object.assign(rawJson[doc.id], { ...doc.data() });
            Vue.set(rawJson, doc.id, { ...doc.data() });
            // temp.push({ id: doc.id, ...doc.data() });
            // rawData += JSON.stringify({ id: doc.id, ...doc.data() }) + "\r\n";
          });
        })
        .then(() => {
          let newObject = extend(this.Data98, rawJson);
          //   console.log(rawJson);
          //   console.log(this.Data98);
          //   console.log(newObject);
          //   rwwJson === this.Data98 === newObject
          let formattedString = date.formatDate(
            Date.now(),
            "YYYY-MM-DDTHH:mm:ss"
          );
          // console.log(formattedString);
          const status = exportFile(
            "行動資料庫資料備份" + formattedString + ".json",
            JSON.stringify(rawJson),
            "text/plain;charset=utf-8"
          );
          if (status === true) {
            console.log("備份成功！");
          } else {
            console.log("備份失敗！");
          }
        });
    },

  },
};
</script>

<style>
</style>
