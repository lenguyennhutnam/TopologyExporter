// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, limit } from "firebase/firestore";
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

export async function addData(email, password, username) {
  const userRef = collection(db, "users");
  const q = query(userRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(collection(db, "users"), {
      email: email,
      username: username,
      password: password,
    });
    return true;
  } else {
    console.log("Existed");
    return false;
  }
}

export async function checkLogin(email, password) {
  const userRef = collection(db, "users");
  // Create a query against the collection.
  const q = query(
    userRef,
    where("email", "==", email),
    where("password", "==", password),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    // Cannot find user
    return null;
  } else {
    const userInfo = querySnapshot.docs[0].data();
    // userInfo["id"] = querySnapshot.docs[0].id;
    delete userInfo["password"];
    return userInfo;
  }
}

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
