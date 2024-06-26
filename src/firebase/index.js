// Import the functions you need from the SDKs you need
import { data } from "autoprefixer";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  limit,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  arrayUnion,
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
    userInfo["id"] = querySnapshot.docs[0].id;
    return userInfo;
  }
}

export async function updateTopo(topo) {
  const topoRef = doc(db, "topologies", topo.id);
  await updateDoc(topoRef, {
    data: topo.data,
    projectName: topo.projectName,
  });
}

export async function addTopo(topo) {
  const docRef = await addDoc(collection(db, "topologies"), {
    data: topo.data,
    projectName: topo.projectName,
  });
  const topoRef = doc(db, "topologies", docRef.id);
  const userRef = doc(db, "users", topo.userId);
  await updateDoc(topoRef, {
    id: topoRef.id,
  });
  await updateDoc(userRef, {
    topologies: arrayUnion(topoRef.id),
  });
  return topoRef.id;
}

export async function updateData(id, collection, field, data) {}

// export async function updateTopo(id, data) {
//   const typeList = {
//     user: () => {
//       console.log("user func" + data);
//     },
//     topo: () => {
//       console.log("topoFunc");
//     },
//   };
//   const def = "user";
//   typeList[def]();
// }

export async function testAdd() {}
