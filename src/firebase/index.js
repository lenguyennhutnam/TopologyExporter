// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSep-uIA7qHU7WJsvUS0LlD06IcZHZsVM",
  authDomain: "topologyexporter.firebaseapp.com",
  projectId: "topologyexporter",
  storageBucket: "topologyexporter.appspot.com",
  messagingSenderId: "704343758170",
  appId: "1:704343758170:web:2f102491b9dd085f778f63",
  measurementId: "G-E9JD1GBYR3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export async function getData(id, collection) {
  if (!id) {
    return null;
  }
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

export async function getList(id, type) {}

export async function updateData(id, collection, field, data) {}

export async function updateTopo(id, data) {
  const typeList = {
    user: () => {
      console.log("user func" + data);
    },
    topo: () => {
      console.log("topoFunc");
    },
  };
  const def = "user";
  typeList[def]();
  // var currentTopo = getTopo(id);
  // currentTopo.projectName = data;
  // const batch = writeBatch(db);
  // const nycRef = doc(db, "users", id);
  // batch.update(nycRef, { username: currentTopo.projectName });
  // await batch.commit();
}
