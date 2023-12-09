import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Quiz.css";
import { Link, useHistory } from 'react-router-dom';

const QuizDynamic = () => {
  const [questions, setQuestions] = useState(null);           //--------- transition --------//
  const history = useHistory();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionID, setCurrentQuestionID] = useState(0);     //--------------transition---------//
  const [questionCount, setQuestionCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const [authUser, setAuthUser] = useState(null);

  async function getAuthUser () {
    let response = await onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      }})
  }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.email);
        questionHandle(user.email);
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
     //vulnerable

    return () => {
      listen();
    };
  }, []);

  async function questionHandle (email) {
    let apiResponse = await getQuestionFromApi(email);
    console.log(apiResponse);
    setQuestions(apiResponse);
    const { question_id, content, options, answer_option } = apiResponse;
    let questionID = question_id;
    let answerOption = answer_option;
    // console.log(questionID, content, options, answerOption);
    setCurrentQuestion(content);
    setCurrentQuestionID(questionID);
    setLoading(false);
  };

    //-------------------------transition start---------------------- 
  async function getQuestionFromApi(userEmail) {
    const apiUrl = `http://13.59.173.12:8000/quiz?user_id=${encodeURIComponent(
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

  async function postDataToApi(questionID, userID, answerOption) {
    const apiUrl = `http://13.59.173.12:8000/quiz?question_id=${encodeURIComponent(
      questionID
    )}&user_id=${encodeURIComponent(
      userID
    )}&answer_option=${encodeURIComponent(
      answerOption
    )}`;
      console.log(apiUrl);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
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
      console.log('API request successful:', responseData);
      return responseData;
    } catch (error) {
      console.error("Error during API request:", error);
    }
  }
  
  const handleAnswerOptionClick = (selectedOptionIndex, questionID) => {
    setLoading(true)
    setQuestionCount(questionCount + 1);
    const isCorrect =
      selectedOptionIndex === currentQuestion.answer_option;

    console.log(questionID);
    
    postDataToApi(questionID, authUser.email, selectedOptionIndex);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (questionCount < 11) {

        questionHandle();
  
    
    } else {
        setShowScore(true);
    }
  };
    
  //   const handleAnswerOptionClick = (isCorrect) => {        // hard-code
	// 	if (isCorrect) {
	// 		setScore(score + 1);
	// 	}

	// 	const nextQuestion = currentQuestion + 1;
	// 	if (nextQuestion < questions.length) {
	// 		setCurrentQuestion(nextQuestion);
	// 	} else {
	// 		setShowScore(true);
	// 	}
	// };
    const handleHomeClick = () => {
    
            history.push("/home");
          
      };
  
    return (
    <div className="wrapper">
      <div className="topbar">
        <div className="title">BitSized</div>
      </div>
      <div className="quiz-container">
        {showScore ? (
          <div className="score-section">
            You scored {score} out of 10
              <button
                  className="go-home-button"
                  onClick={handleHomeClick}
                >Go to Home
                </button>
          </div>
        ) : (
          <>
          {loading ? (
            <div>Loading question {questionCount}</div>
          ) : (
            questions && (
              <div>
                <div className="question-section">
                  <div className="question-count">
                    <span>Question {questionCount}</span>/10
                  </div>
                  <div className="question-text">
                    {questions.content}
                  </div>
                </div>
                <div className="answer-section">
                  {questions.options.map((option, index) => (
                    <button
                      className="quiz-button"
                      key={index}
                      onClick={() => handleAnswerOptionClick(index, currentQuestionID)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          </>
        )}
      </div>
    </div>
        
    
    // ---------- hardcode ----------------
    // <div className="wrapper">
    //   <div className="topbar">
    //     <div className="title">BitSized</div>
    //   </div>
    //   <div className="quiz-container">
    //     {showScore ? (
    //       <div className="score-section">
    //         You scored {score} out of 10
    //         <button
    //               className="go-home-button"
    //               onClick={handleHomeClick}
    //             >Go to Home
    //             </button>
    //       </div>
    //     ) : (
    //       <>
    //         <div className="question-section">
    //           <div className="question-count">
    //             <span>Question {questions[currentQuestion].questionID}</span>/10
    //           </div>
    //           <div className="question-text">
    //             {questions[currentQuestion].content}
    //           </div>
    //         </div>
    //         <div className="answer-section">
    //           {questions[currentQuestion].options.map((option, index) => (
    //             <button
    //               className="quiz-button"
    //               key={index}
    //               onClick={() => handleAnswerOptionClick(index, questions.questionID)}
    //             >
    //               {option}
    //             </button>
    //           ))}
    //         </div>
    //       </>
    //     )}
    //   </div>
    // </div>
  );
};

export default QuizDynamic;
