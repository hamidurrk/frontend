import { useHistory, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from "react";
import problems from "../problems";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const ProblemDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const dataCollectionRef = collection(db, "problems");

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const data = await getDocs(dataCollectionRef);
        console.log(typeof(data))
        const questionsData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setQuestion(questionsData);
        console.log(question);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getQuestions();
  }, []);

  console.log(question);
      return (
        <div>
            {question && question.map((d) => {
                return (
                    <div>
                    <h1>{d.problemID}</h1>
                    <h1>{d.problemHeader}</h1>
                    <h1>{d.content}</h1>
                    </div>
                )
            })}
        </div>
      );
}
 
export default ProblemDetails;