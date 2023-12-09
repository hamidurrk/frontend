import AuthDetails from "./auth/AuthDetails";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Home.css";
import CompList from "./CompList";
import problems from "../problems";
import { useState, useEffect } from "react";
import { CSSTransition } from 'react-transition-group';
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Home = () => {
  const [question, setQuestion] = useState(null);
  const dataCollectionRef = collection(db, "problems");
  const [showComponentList, setShowComponentList] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [problemList, setProblemList] = useState([]);
  const problemListStatic = [
    4,
    2,
    1,
    5,
    3,
    28,
    24
  ];

  const toggleComponentList = () => {
    setShowComponentList(!showComponentList);
  };

  const getQuestions = async () => {
    try {
      const data = await getDocs(dataCollectionRef);
      const questionsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setQuestion(questionsData);
      console.log(question);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function getProblemFromApi(userEmail) {
    const apiUrl = `http://13.59.173.12:8000/problem?user_id=${encodeURIComponent(
      userEmail
    )}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If the response status code is not OK, throw an error with the status
        const errorInfo = await response.json();
        console.error("API request failed:", errorInfo);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If the response is OK, parse and log the JSON body
      const responseData = await response.json();
      // console.log('API request successful:', responseData);
      return responseData;
    } catch (error) {
      console.error("Error during API request:", error);
    }
  } 

  async function problemHandle (email) {
    let apiResponse = await getProblemFromApi(email);
    console.log(apiResponse);
    setProblemList(apiResponse);
  }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.email);
        problemHandle(user.email);
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    getQuestions();

    return () => {
      listen();
    };
  }, []);

  return (
    <div className="home-wrapper">
      <div className="content-wrapper">
        <div className="topbar">
          <div className="title">BitSized</div>
          <div className="title-right">
            <AuthDetails />
          </div>
        </div>
        <div className="utils">
          <Link to="/ide">
            <button className="ide-button">IDE</button>
          </Link>
        </div>
        <div className="home-container">
          <div className="problem-container">
          {question && (
            <div className="problems">
            <div 
            className={`problem-button ${showComponentList ? "active" : ""}`} 
            onClick={toggleComponentList}>
              <h2>Problems</h2>
            </div>
            <div className="component-list-container">
              <CSSTransition
                in={showComponentList}
                timeout={300}
                classNames="component-list"
                unmountOnExit
              >
                <CompList components={question} problemList={problemList} />
              </CSSTransition>
            </div>
            
            </div> )}
          </div>
          <div className="lesson-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
