import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Quiz.css";
import { Link, useHistory } from 'react-router-dom';

const Quiz = () => {
    // const [questions, setQuestions] = useState(null);           //--------- transition --------//
    const history = useHistory();
  const questions = [
    {
        questionID: 1,
        content: "What is the output of: print(8 // 3)?",
        options: ["2", "2.67", "3", "Syntax Error"],
        answerOption: 0,
      },
      {
        questionID: 2,
        content: "Which data type is mutable in Python?",
        options: ["String", "Tuple", "List", "Integer"],
        answerOption: 2,
      },
    {
      questionID: 3,
      content: "How do you start writing a function in Python?",
      options: ["function", "def", "func", "create"],
      answerOption: 1,
    },
    {
      questionID: 4,
      content: "What will be the output of: print('Hello' + 'World')?",
      options: ["Hello World", "HelloWorld", "Hello+World", "Error"],
      answerOption: 1,
    },
    {
      questionID: 5,
      content: "Which of the following is used for comments in Python?",
      options: ["//", "#", "/* */", "--"],
      answerOption: 1,
    },
    {
      questionID: 6,
      content: "What does the len() function in Python do?",
      options: ["Returns the length of an object", "Converts an object to a string", "Counts the number of items in a list", "None of the above"],
      answerOption: 0,
    },
    {
      questionID: 7,
      content: "Which loop structure is used to iterate over a sequence?",
      options: ["for", "while", "do-while", "repeat-until"],
      answerOption: 0,
    },
    {
      questionID: 8,
      content: "How do you create a dictionary in Python?",
      options: ["{key: value}", "[key: value]", "(key: value)", "<key: value>"],
      answerOption: 0,
    },
    {
      questionID: 9,
      content: "What does 'if __name__ == \"__main__\":' do in Python?",
      options: ["Checks if the script is run directly", "Initializes the main function", "Declares a variable", "None of the above"],
      answerOption: 0,
    },
    {
      questionID: 10,
      content: "What is the correct way to handle exceptions in Python?",
      options: ["try-catch", "try-except", "try-finally", "try-catch-finally"],
      answerOption: 1,
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
//   const [currentQuestionID, setCurrentQuestionID] = useState(0);     //--------------transition---------//

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    // questionHandle(); //vulnerable

    return () => {
      listen();
    };
  }, []);
    //-------------------------transition start---------------------- 
//   async function getQuestionFromApi(userEmail) {
//     const apiUrl = `http://13.59.173.12:8000/quiz?user_id=${encodeURIComponent(
//       userEmail
//     )}`;

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         // If the response status code is not OK, throw an error with the status
//         const errorInfo = await response.json();
//         console.error("API request failed:", errorInfo);
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // If the response is OK, parse and log the JSON body
//       const responseData = await response.json();
//       // console.log('API request successful:', responseData);
//       return responseData;
//     } catch (error) {
//       console.error("Error during API request:", error);
//     }
//   }

//   async function postDataToApi(questionID, userID, answerOption) {
//     const apiUrl = `http://13.59.173.12:8000/quiz?user_id=${encodeURIComponent(
//       authUser.email
//     )}`;

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         // If the response status code is not OK, throw an error with the status
//         const errorInfo = await response.json();
//         console.error("API request failed:", errorInfo);
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // If the response is OK, parse and log the JSON body
//       const responseData = await response.json();
//       // console.log('API request successful:', responseData);
//       return responseData;
//     } catch (error) {
//       console.error("Error during API request:", error);
//     }
//   }

//   const questionHandle = async () => {
//     let apiResponse = await getQuestionFromApi(authUser.email);
//     console.log(apiResponse);
//     setQuestions(apiResponse);
//     const { questionID, content, options, answerOption } = apiResponse;
//     console.log(questionID, content, options, answerOption);
//     setCurrentQuestion(content)
//     setCurrentQuestionID(questionID)
//   };

  
//   const handleAnswerOptionClick = (selectedOptionIndex, questionID) => {
//     const isCorrect =
//       selectedOptionIndex === questions[currentQuestion].answerOption;
    
//     postDataToApi(questionID, authUser.email, selectedOptionIndex);

//     if (isCorrect) {
//       setScore(score + 1);
//     }

//     if (currentQuestionID < 11) {
//         questionHandle();
//     } else {
//         setShowScore(true);
//     }
//   };
    //-------------------------transition end-------------------//
    
    const handleAnswerOptionClick = (isCorrect) => {        // hard-code
		if (isCorrect) {
			setScore(score + 1);
		}

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
	};
    const handleHomeClick = () => {
    
            history.push("/home");
          
      };
  
    return (
        // ---------- dynamic----------------
    // <div className="wrapper">
    //   <div className="topbar">
    //     <div className="title">BitSized</div>
    //   </div>
    //   <div className="quiz-container">
    //     {showScore ? (
    //       <div className="score-section">
    //         You scored {score} out of 10
    //       </div>
    //     ) : (
    //       <>
    //         <div className="question-section">
    //           <div className="question-count">
    //             <span>Question {questions.questionID}</span>/10
    //           </div>
    //           <div className="question-text">
    //             {questions.content}
    //           </div>
    //         </div>
    //         <div className="answer-section">
    //           {questions.options.map((option, index) => (
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
        
    
    // ---------- hardcode ----------------
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
            <div className="question-section">
              <div className="question-count">
                <span>Question {questions[currentQuestion].questionID}</span>/10
              </div>
              <div className="question-text">
                {questions[currentQuestion].content}
              </div>
            </div>
            <div className="answer-section">
              {questions[currentQuestion].options.map((option, index) => (
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
