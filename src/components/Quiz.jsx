import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Quiz.css";

const Quiz = () => {
    const [questions, setQuestions] = useState(null);
//   const questions = [
//     {
//       questionID: 1,
//       content: "What is the capital of France?",
//       options: ["New York", "London", "Paris", "Dublin"],
//       answerOption: 2,
//     },
//     {
//       questionID: 2,
//       content: "Who is CEO of Tesla?",
//       options: ["Jeff Bezos", "Elon Musk", "Bill Gates", "Tony Stark"],
//       answerOption: 1,
//     },
//     {
//       questionID: 3,
//       content: "The iPhone was created by which company?",
//       options: ["Apple", "Intel", "Amazon", "Microsoft"],
//       answerOption: 0,
//     },
//     {
//       questionID: 4,
//       content: "How many Harry Potter books are there?",
//       options: ["1", "4", "6", "7"],
//       answerOption: 3,
//     },
//   ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionID, setCurrentQuestionID] = useState(0);

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    questionHandle(); //vulnerable

    return () => {
      listen();
    };
  }, []);

  async function getQuestionFromApi(userEmail) {
    const apiUrl = `http://13.59.173.12:8000/quiz?user_id=${encodeURIComponent(
      userEmail
    )}`;

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
      // console.log('API request successful:', responseData);
      return responseData;
    } catch (error) {
      console.error("Error during API request:", error);
    }
  }

  async function postDataToApi(questionID, userID, answerOption) {
    const apiUrl = `http://13.59.173.12:8000/quiz?user_id=${encodeURIComponent(
      authUser.email
    )}`;

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
      // console.log('API request successful:', responseData);
      return responseData;
    } catch (error) {
      console.error("Error during API request:", error);
    }
  }

  const questionHandle = async () => {
    let apiResponse = await getQuestionFromApi(authUser.email);
    console.log(apiResponse);
    setQuestions(apiResponse);
    const { questionID, content, options, answerOption } = apiResponse;
    console.log(questionID, content, options, answerOption);
    setCurrentQuestion(content)
    setCurrentQuestionID(questionID)
  };

  
  const handleAnswerOptionClick = (selectedOptionIndex, questionID) => {
    const isCorrect =
      selectedOptionIndex === questions[currentQuestion].answerOption;
    
    postDataToApi(questionID, authUser.email, selectedOptionIndex);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionID < 11) {
        questionHandle();
    } else {
        setShowScore(true);
    }
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
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Question {questions.questionID}</span>/10
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
                  onClick={() => handleAnswerOptionClick(index, questions.questionID)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
