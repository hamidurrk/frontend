import AuthDetails from "./auth/AuthDetails";
import { Link } from "react-router-dom";
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

  const toggleComponentList = () => {
    setShowComponentList(!showComponentList);
  };

  useEffect(() => {
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

    getQuestions();
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
                {question && <CompList components={question} />}
              </CSSTransition>
            </div>
            
            </div>
          </div>
          <div className="lesson-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
