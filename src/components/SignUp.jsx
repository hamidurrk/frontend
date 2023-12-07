import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal"; 
import "../styles/SignUp.css";
import { Link, useHistory } from 'react-router-dom';

const SignUp = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        history.push("/quiz");
        onClose(); 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Sign Up Modal"
      className="sign-up-modal"
    >
      <div className="close-icon" onClick={onClose}>
        <FaTimes />
      </div>
      <form className="sign-up-form" onSubmit={signUp}>
        <h1>Create Account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button className="signup" type="submit">Sign Up</button>
      </form>
    </Modal>
  );
};

export default SignUp;
