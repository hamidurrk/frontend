import { useState, useEffect } from 'react';
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const dataCollectionRef = collection(db, url);

  useEffect(() => {
    const getUsers = async () => {
    const data = await getDocs(dataCollectionRef);
    setData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }    
})
  return { data, isPending, error };

}
 
export default useFetch;





// fetch(url, { signal: abortCont.signal })
    //   .then(res => {
    //     if (!res.ok) { // error coming back from server
    //       throw Error('could not fetch the data for that resource');
    //     } 
    //     return res.json();
    //   })
    //   .then(data => {
    //     setIsPending(false);
    //     setData(data);
    //     setError(null);
    //   })
    //   .catch(err => {
    //     if (err.name === 'AbortError') {
    //       console.log('fetch aborted')
    //     } else {
    //       // auto catches network / connection error
    //       setIsPending(false);
    //       setError(err.message);
    //     }
    //   })
    // }, 1);

    // // abort the fetch
    // return () => abortCont.abort();