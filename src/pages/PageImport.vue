<template>
  <div>
    <q-input
      @input="
        (val) => {
          file = val[0];
        }
      "
      filled
      type="file"
      hint="請務必確認檔案格式符合匯入條件"
    />
    <q-btn @click="importFun">匯入顯示</q-btn>
    <q-btn @click="saveToFirestore">存到資料庫(注意使用)</q-btn>
    <q-btn @click="compareData">讀取並比較資料庫</q-btn>
    <q-btn @click="LastUpdate">列出最近更新(要更改DB查詢日期)</q-btn>
    <q-btn @click="deleteLastUpdate">刪除最近更新(注意使用)</q-btn>

    {{ writeToDbArray }}
  </div>
</template>

<script>
import { dbFirestore } from "boot/firebase";
import Vue from "vue";
import { date } from "quasar";

export default {
  name: "",
  data() {
    return {
      inputFileStr: "",
      file: null, // 匯入檔案object
      writeToDbArray: [],
      i: 0,
      dbData: {},
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    importFun() {
      this.readFile(this.file);
    },

    readFile(selectedFile) {
      const reader = new FileReader();
      // 文件内容载入完毕之后的回调。
      reader.onload = (e) => {
        // console.log(e.target.result);
        this.inputFileStr = e.target.result;
        let inputFileArr = this.inputFileStr.split("\n").filter((x) => {
          return !x.includes("//"); //去除註解
        });

        // console.log(inputFileArr.length);
        let clearData = inputFileArr.filter((line) => {
          let item = line.split(",");
          //   if((item.length !== 9 )){
          //   console.log(item)
          //   }
          return item.length === 9 && item[0] !== ""; //過濾格式不對，及 email是空白的（節點目錄）
        });

        this.writeToDbArray = [];
        clearData.forEach((line) => {
          // console.log(item.split(/\s+/));
          let item = line.split(",");

          let data = {
            name: item[0].trim(),
            mobilePhone: item[1].trim() || "",
            companyPhone: item[2].trim() || "",
            email: item[3].trim() || "",
            county: item[4].trim() || "",
            address: item[5].trim() || "",
            proTitle: item[6].trim() || "",
            other: item[7].trim() || "",
            star: parseInt(item[8].trim()),
            avatar: "",
            photo: [],
            district: "",
            classify: "",
            professionalTitle: "",
            clubTitle: "",
            personalConnections: "",
            meetNotes: "",
            suggestions: "",
            petitionMatters: "",
            diet: "",
            interest: "",
            topic: "",
            update: "",
            zip: "",
            RedDot: false,
            updateDate: new Date(),
          };
          this.writeToDbArray.push(data);
        });

        console.log(this.writeToDbArray);
        // writeToDbArray.forEach((item) => {
        //   this.addContact(item); //mapActions 寫入資料庫
        // });
      };
      reader.readAsText(selectedFile);
    },
    // ===寫到資料庫===
    async saveToFirestore() {
      let dbData = {};
      await dbFirestore
        .collection("現場紀錄表")
        .get()
        .then((qs) => {
          if (qs.empty) {
            this.$q.dialog({
              title: "",
              message: "查不到",
            });
            this.Downloading = false;
            return false;
          }
          qs.forEach((doc) => {
            // console.log(doc.data().name);
            Vue.set(this.dbData, doc.id, doc.data());
          });
          // console.log(this.dbData);
        })
        .catch((err) => {
          console.log(err.message);
        });
      this.i = 0;
      let i = 0,
        j = 0;

      //循環匯入資料
      this.writeToDbArray.forEach((data) => {
        //比較資料
        let match = this.SearchName(data.name, this.dbData);
        let aMatch = Object.values(match)[0]; //取出物件
        if (aMatch) {//重複
          ++i;
          // console.log(data.name,data.address,"==",aMatch.name , aMatch.address)
        } else {
          ++j;
          console.log(data.name, data);
          // 寫入資料
          // dbFirestore
          //   .collection("現場紀錄表")
          //   .add(data)
          //   .then((ref) => {
          //     console.log("資料庫新增成功！", ref.id);
          //   })
          //   .catch((error) => {
          //     console.error("資料庫儲存失敗！", error);
          //   });
        }
      });
    },
    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    async compareData() {
      let dbData = {};
      await dbFirestore
        .collection("現場紀錄表")
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            // console.log(doc.data().name);
            Vue.set(this.dbData, doc.id, doc.data());
          });
          // console.log(this.dbData);
        })
        .catch((err) => {
          console.log(err.message);
        });
      this.i = 0;
      let i = 0,
        j = 0;
      this.writeToDbArray.forEach((data) => {
        let match = this.SearchName(data.name, this.dbData);
        let aMatch = Object.values(match)[0]; //取出物件
        if (aMatch) {
          ++i;
          console.log(data.name,data.address,"==",aMatch.name , aMatch.address)
        } else {
          ++j;
          console.log(data.name, data);
        }
      });
      console.log(i, j);
    },
    //搜尋名字
    SearchName(name, data) {
      let match = {};
      Object.keys(data).forEach((key) => {
        if (data[key]["name"].includes(name)) {
          // ++this.i
          // console.log(data[key]["name"], date.formatDate(data[key]["updateDate"].toDate(), 'YYYY-MM-DD HH:mm:ss'));
          Vue.set(match, key, data[key]); //符合條件的存在物件中
        }
      });
      // console.log(match);
      return match;
    },

        //刪除最近更新
    async deleteLastUpdate() {
      let start = new Date("2020-12-1");
      let end = new Date("2020-12-21");
      let delData = {};
      await dbFirestore
        .collection("現場紀錄表")
        // .limit(100)
        .where("updateDate", ">=", start)
        .where("updateDate", "<=", end)
        .get()
        .then((qs) => {
          if (qs.empty) {
            this.$q.dialog({
              title: "",
              message: "查不到",
            });
            return false;
          }

          let i = 0;
          qs.forEach((doc) => {
            let todate1 = doc.data().updateDate;
            // console.log( doc.data().name,  date.formatDate(todate1.toDate(), 'YYYY-MM-DD HH:mm:ss'))
            ++i;

            Vue.set(delData, doc.id, doc.data());
          });
          console.log(i);
        })
        .catch((err) => {
          console.log(err.message);
        });
      // console.log(delData)
      let i=0
      Object.keys(delData).forEach((key) => {
        // console.log(key,++i);

        // dbFirestore
        //   .collection("現場紀錄表")
        //   .doc(key)
        //   .delete()
        //   .then(() => {
        //     console.log(key,"資料刪除成功！",++i);
        //   });
      });
    },

    //最近更新
    LastUpdate() {
      let start = new Date("2020-12-1");
      let end = new Date("2020-12-21");

      console.log(start, end);
      dbFirestore
        .collection("現場紀錄表")
        // .limit(100)
        .where("updateDate", ">=", start)
        .where("updateDate", "<=", end)
        .get()
        .then((qs) => {
          if (qs.empty) {
            this.$q.dialog({
              title: "",
              message: "查不到",
            });
            return false;
          }

          let i = 0;
          qs.forEach((doc) => {
            let todate1 = doc.data().updateDate;
            console.log(
              doc.data().name,
              date.formatDate(todate1.toDate(), "YYYY-MM-DD HH:mm:ss")
            );
            ++i;

            // Vue.set(dbData, doc.id, doc.data());
          });
          console.log(i);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  }, //methods
};
</script>

<style>
</style>
