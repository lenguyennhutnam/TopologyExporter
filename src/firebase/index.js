// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
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

export async function getTopos() {}

export async function getTopo(id) {
  const docRef = doc(db, "topologies", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    // data = docSnap.data();
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
    return "Not found";
  }
}

export async function getUserData(id) {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    // data = docSnap.data();
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
    return "Not found";
  }
}
