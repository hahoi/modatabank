<template>
  <div>
    <section>
      <h3>Import XLSX</h3>
      <!-- <input type="file" @change="onChange" /> -->
      <div class="q-pa-md" style="max-width: 300px">
        <div class="q-gutter-md">
          <q-file
            v-model="file"
            label="選擇匯入的 Excel 檔案"
            @change="onChange"
          />
        </div>
      </div>
      <xlsx-read :file="file">
        <xlsx-sheets>
          <template #default="{ sheets }">
            <div class="q-pa-md" v-if="file">
              <span class="q-pr-md">選擇活頁簿</span>
              <select v-model="selectedSheet">
                <option v-for="sheet in sheets" :key="sheet" :value="sheet">
                  {{ sheet }}
                </option>
              </select>
            </div>
          </template>
        </xlsx-sheets>

        <!-- <xlsx-table :sheet="selectedSheet" /> -->
        <!-- 會用 html table 顯示xlsx的資料-->

        <div class="q-pa-md q-gutter-sm">
          <q-btn
            label="匯入資料預覽"
            @click="table_dialog = true"
            v-if="selectedSheet"
          />

          <q-dialog
            v-model="table_dialog"
            persistent
            :maximized="true"
            transition-show="slide-up"
            transition-hide="slide-down"
          >
            <q-card class="">
              <q-bar>
                <q-space />
                <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary"
                    >Close</q-tooltip
                  >
                </q-btn>
              </q-bar>

              <q-card-section class="q-pt-none">
                <!-- html table 顯示 -->
                <xlsx-table :sheet="selectedSheet" />
              </q-card-section>

              <q-bar>
                <q-space />
                <q-btn dense flat icon="close" v-close-popup>
                </q-btn>
              </q-bar>
            </q-card>
          </q-dialog>
        </div>

        <xlsx-json :sheet="selectedSheet" @parsed="returnCollection">
          <!-- <template #default="{ collection }"> -->
          <!-- 會用 json 顯示xlsx的資料-->
          <!-- <div> {{ collection }} </div> -->
          <!-- </template>  -->
        </xlsx-json>
      </xlsx-read>
    </section>
  </div>
</template>

<script>
import {
  XlsxRead,
  XlsxTable,
  XlsxSheets,
  XlsxJson,
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload,
} from "../../node_modules/vue-xlsx/dist/vue-xlsx.es.js";

export default {
  name: "DataImport",
  data() {
    return {
      file: null,
      selectedSheet: null,
      sheetName: null,
      sheets: [{ name: "SheetOne", data: [{ c: 2 }] }],
      collection: [{ a: 1, b: 2 }],
      sheet: "",
      table_dialog: false,
    };
  },
  components: {
    XlsxRead,
    XlsxTable,
    XlsxSheets,
    XlsxJson,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
      console.log(this.file);
    },
    returnCollection(collection_json) {
      console.log(this.selectedSheet);
      console.log(collection_json);
    },
  },
};
</script>

<style scope>
table {
  border-collapse: collapse;
  /* border: 3px #cccccc solid; */
}
td {
  border-collapse: collapse;
  border: 1px #cccccc solid;
}
</style>
