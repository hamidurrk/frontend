// App.js
import './App.css';
import { useState } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home'; 
import Ide from './components/Ide'; 
import IdeCore from './components/IdeCore'; 
import ImageUpload from './components/ImageUpload';
import ProblemDetails from './components/ProblemDetails';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
function App() {
  return (
    <Router>
      <div className="App">
        return <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />;
      </div>
    </Router>
  );
}

export default App;
{/* <main>
          <Switch>
            <Route exact path="/">
              <SignIn />
            </Route>
            <Route exact path="/signup">
              <SignUp />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/ide/:id">
              <Ide />
            </Route>
            <Route exact path="/ide">
              <IdeCore />
            </Route>
            <Route exact path="/qs">
              <ProblemDetails />
            </Route>
            <Route exact path="/imgup">
              <ImageUpload />
            </Route>
            {/* <Redirect from="/" to="/signin" /> */}
          // </Switch>
        // </main> 