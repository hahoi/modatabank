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
    <q-btn @click="importFun">匯入</q-btn>
    <q-btn @click="saveToFirestore">存到資料庫</q-btn>

    {{writeToDbArray}}
  </div>
</template>

<script>
import { dbFirestore } from "boot/firebase";

export default {
  name: "",
  data() {
    return {
      inputFileStr: "",
      file: null, // 匯入檔案object
      writeToDbArray: [],
      i: 0,
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

        this.writeToDbArray = []
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

    saveToFirestore() {
      this.writeToDbArray.forEach((data) => {
        // console.log(data);
        dbFirestore
          .collection("現場紀錄表")
          .add(data)
          .then((ref) => {
            console.log("資料庫新增成功！", ref.id);
          })
          .catch((error) => {
            console.error("資料庫儲存失敗！", error);
          });
      });
    },
  },
};
</script>

<style>
</style>
