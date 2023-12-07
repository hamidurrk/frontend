import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Link, useHistory } from 'react-router-dom';

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        history.push("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="signed-in-as">
        {authUser ? (
          <>
            <p style={{paddingRight: '0px'}}>{`${authUser.email}`}</p>
            <button className="auth-signout-button" onClick={userSignOut}>Sign Out</button>
          </>
        ) : (
          <p>Signed Out</p>
        )}
    </div>
  );
};

export default AuthDetails;