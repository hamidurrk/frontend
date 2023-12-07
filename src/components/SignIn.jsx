import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import SignUp from './SignUp';
import "../styles/SignIn.css";
import { Link, useHistory } from 'react-router-dom';
import Home from "./Home";
import OutputModal from "./OutputModal";

const SignIn = () => {
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const history = useHistory();

  const signIn = (e) => {
    
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setShowSignIn(true);
        history.push("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  }

    return (
    <div className="sign-in-page">
       <header>
       
        <button className="signup-button-1" onClick={() => setIsSignUpModalOpen(true)}>
        Sign Up
      </button>
      <SignUp
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
      </header>
        <div className="sign-in-container">
        <form className="login-form" onSubmit={signIn}>
          <h1>BitSized</h1>
          <p>Email</p>
          <input
            type="email"
            placeholder="Enter your Stanford email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <p>Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button className="login" type="submit">Log In</button>
        </form>
      </div>
    </div>
      
    );
}
 
export default SignIn
