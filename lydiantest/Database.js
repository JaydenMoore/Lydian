import firebase from 'firebase';
import 'firebase/firestore';
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: "**************************",
  authDomain: "lydian-f0717.firebaseapp.com",
  projectId: "lydian-f0717",
  storageBucket: "lydian-f0717.appspot.com",
  messagingSenderId: "576423535190",
  appId: "1:576423535190:web:63432d28222314507c11f7"
};
if (!firebase.apps.length) {
   const app = firebase.initializeApp(firebaseConfig);
}else {
   firebase.app();
}

const db = firebase.firestore();

//const db = firebase.firestore();

export function addDocument(collection, data){
  return new Promise((Resolve, Reject) => {
    db.collection(collection).add(data).then((data) => {
      Resolve(data.id)
    })
  })
}

export function updateField(ref, field){
  return new Promise((Resolve, Reject) => {
    db.doc(ref).get().then((snap) => {
      db.doc(ref).update({
        'messages': [...snap.data().messages, field],
      })
      Resolve()
    })
  })   
}

export function searchDocuments(collection, field, comparison, value){
  return new Promise((Resolve, Reject) => {
    db.collection(collection).where(field, comparison, value).get().then(snapshot => {
      if (!snapshot.empty){
        const dbData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        Resolve(dbData)
      } else {
        Reject(false)
      }
    })
  });
}

export function removeDocument(collection, document){
  const [deleted, setDeleted] = useState(false);
  
  useEffect(() => {
    db.collection(collection).doc(document).get().then((docSnap) => {
      if (docSnap.exists){
        db.collection(collection).doc(document).delete().then(() => {
          setDeleted(true)
        })
      } else {
        setDeleted(false)
      }
    });
  }, [collection, document])

  return deleted;
}

export function documentExists(collection, document){
  const [exists, setExists] = useState(false);
  
  useEffect(() => {
    db.collection(collection).doc(document).get().then((docSnap) => {
      if (docSnap.exists){
        setExists(true)
      } else {
        setExists(false)
      }
    });
  }, [collection, document])

  return exists;
}

export function useCollection2(collection, orderBy){
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection(collection).orderBy(orderBy).onSnapshot((snapshot) => {
      const dbData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setData(dbData)
      setLoading(false)
    })
  }, [collection, orderBy])

return {loading, data}
}

export function useCollection(collection, orderBy, order){
  return new Promise((Resolve) => {
    db.collection(collection).orderBy(orderBy, order).limit(50).onSnapshot((snapshot) => {
      const dbData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      Resolve(dbData)
    })
  })
}

export function grabCollection(collection, orderBy){
  return new Promise((Resolve) => {
    db.collection(collection).get().then((docs) => {
      Resolve(docs.size);
    })
  })
}

export function getFromRef(ref){
  return new Promise((Resolve, Reject) => {
    db.doc(ref).get().then((snap) => {
      //console.log(snap.data())
      Resolve(snap.data());
    })
  })
}
