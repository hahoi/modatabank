import * as firebase from "firebase/app"

import "firebase/auth"
import "firebase/database"
import 'firebase/firestore'
import 'firebase/storage'
import "firebase/functions"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfOopOTSkdditsARd46JJLvDLozFYl7CM",
  authDomain: "modatabank.firebaseapp.com",
  databaseURL: "https://modatabank.firebaseio.com",
  projectId: "modatabank",
  storageBucket: "modatabank.appspot.com",
  messagingSenderId: "834137692136",
  appId: "1:834137692136:web:6736255dd732cbc897365d",
  measurementId: "G-GBMQ9XC7MW"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseDb = firebaseApp.database()
const dbFirestore = firebaseApp.firestore()
const dbStorage = firebaseApp.storage()
const dbFunctions = firebaseApp.functions()

export { firebaseAuth, firebaseDb,dbFirestore,dbStorage, dbFunctions }